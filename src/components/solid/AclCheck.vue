<template>
  <div>

    <!-- errors : {{ errors }}

    {{authorizations}} -->
    <b-list-group>
      <b-list-group-item v-for="(e, i) in errors" :key="i" variant="danger">
        {{e}}
      </b-list-group-item>

    </b-list-group>




    <!-- <a href="https://github.com/jeff-zucker/solid-file-client/issues/189" target="_blank">
    More info about why You must change authorization on this folder</a>
  </p> -->
  <!-- You can do it manually at <a :href="path" target="_blank">{{ path }}</a> or use this button. <br> -->
  <b-button @click="setAcl" v-if="errors.length > 0">Set Authorization</b-button>

</div>
</template>

<script>
import auth from 'solid-auth-client';
import FC from 'solid-file-client'
const fc = new FC( auth )

// import {
//   getPublicAccess,
// } from "@inrupt/solid-client/access/universal";
// import * as jsonld from 'jsonld';
//import * as ttl2jsonld from '@frogcat/ttl2jsonld';


export default {
  name: "AclCheck",
  props: ['authorizations', 'webId'],
  data() {
    return {
      acl: {},
      errors: []
    }
  },
  async created(){
    this.init()
  },
  methods: {
    async init(){
      if (this.webId != null && this.authorizations!= null ){
        for (const [key, value] of Object.entries(JSON.parse(this.authorizations))) {
        //  console.log(key, value);
          this.path = key
          let remoteAcl = await this.checkRemoteAcl(key)
          if (remoteAcl != null){
            let auth = {}
            auth[key] = value
            auth.url = key
            await this.comparaison(auth, remoteAcl)
          }

        }
      }
    },



    async comparaison(wanted, effective){
      console.warn("Todo : reverse comparaison ")

      let what = wanted.url

      await this.compareWhat(wanted[what].accessTo, effective[what].accessTo, "accessTo")
      await this.compareWhat(wanted[what].default, effective[what].default, "default")

    },
    async compareWhat(whatWanted, whatEffective, what){
    //  console.log("compare",whatWanted, whatEffective)
      let modes = ["Read", "Write", "Append", "Control"]
      for (const [key, value] of Object.entries(whatWanted)) {
        !Object.prototype.hasOwnProperty.call(whatEffective, key) ? this.errors.push("Effective Acl does not have rule on "+what+" for "+ key) : ""
        value.type != whatEffective[key].type ? this.errors.push("Effective Acl does not have the  good type : "+whatEffective[key].type+ " instead of "+ value.type): ""

        modes.forEach((m) => {
      //    console.log(value.mode[m], whatEffective[key].mode[m], value.mode[m] == whatEffective[key].mode[m])
          value.mode[m] != whatEffective[key].mode[m] ? this.errors.push(m+" Mode should be : "+value.mode[m]+ " instead of "+ whatEffective[key].mode[m]): ""
        });

        // value.mode.Read.valueOf() == whatEffective[key].mode.Read.valueOf() ? this.errors.push("Read Mode should be : "+value.mode.Read+ " instead of "+ whatEffective[key].mode.Read): ""
        // value.mode.Write.valueOf() == whatEffective[key].mode.Write.valueOf() ? this.errors.push("Write Mode should be : "+value.mode.Read+ " instead of "+ whatEffective[key].mode.Write): ""
        // value.mode.Append.valueOf() == whatEffective[key].mode.Append.valueOf() ? this.errors.push("Append Mode should be : "+value.mode.Read+ " instead of "+ whatEffective[key].mode.Append): ""
        // value.mode.Control.valueOf() == whatEffective[key].mode.Control.valueOf() ? this.errors.push("Control Mode should be : "+value.mode.Read+ " instead of "+ whatEffective[key].mode.Control): ""
      }
    },
    async checkRemoteAcl(url){
      let remoteAcl = null
    //  console.log(url)



      this.acl.status = "cheching authorizations"

      this.acl.aclObject = await fc.aclUrlParser(url)

    //  console.log(this.acl.aclObject)
      if (Array.isArray(this.acl.aclObject)){
        let auths = {}
        auths[url] == undefined ? auths[url] = {accessTo: {}, default: {}} : ""
        auths.array = []

        let a = {what: url, accesTo: [], default: []}
      //  console.log("Auths", auths)

        this.acl.aclObject.forEach((aclAuth) => {
        //  console.log(aclAuth)
          for (const [key, value] of Object.entries(aclAuth)) {
          //  console.log(key, value);

            let keySplit = key.split('&')
            let agent = {type: keySplit[0], value: keySplit[1] }
            let who = agent
            let how = value.mode
            let auth = {who: who, how: how}
            //by path
            //console.log("accessTo",value.access.accessTo)
            //console.log("default",value.access.default)

            if (
              value.access.accessTo == 1){
                auths[url].accessTo[keySplit[1]] = {type: keySplit[0], mode: value.mode}

                a.accesTo.push(auth)

              }

              if (value.access.default == 1){
                auths[url].default[keySplit[1]] = {type: keySplit[0], mode: value.mode}
                a.default.push(auth)
              }

              auths.array.push(a)
            }
          });
          //console.log("AUTHS",auths)
          remoteAcl = auths

        }else{
          this.errors.push("Can not read ACL, it is not an array")
        }





        if(remoteAcl == null){
          this.errors.push("I cannot get remote ACL for"+ url)
        }
        return remoteAcl
      },
      async setAcl(){
        this.errors = []
        // according to recent solid-file-client changes : https://github.com/jeff-zucker/solid-file-client/issues/189#issuecomment-808966875
        try{
          this.acl.status = "setting authorizations"
          const aclOwner = await fc.acl.addUserMode({}, [{ agent: this.webId }], ['Read', 'Write', 'Control'], ['accessTo', 'default'])
          const aclUsers1 = await fc.acl.addUserMode({}, [{ agentClass: 'AuthenticatedAgent' }], ['Append'], ['default'])
          const aclUsers2 = await fc.acl.addUserMode({}, [{ agentClass: 'AuthenticatedAgent' }], ['Append', 'Read'], ['accessTo'])

          const aclUsers = [aclOwner, aclUsers1, aclUsers2]

          const aclContentNew = await fc.acl.createContent(this.path, aclUsers)
        //  console.log('build an aclContent ' + aclContentNew)

          const { acl: aclUrl } = await fc.getItemLinks(this.path, { links: 'include_possible'})
          //    const links = await fc.getItemLinks(inboxAnnonce, { links: 'include_possible'})

          //  console.log(links)
        //  let result =
          await fc.putFile(aclUrl, aclContentNew, 'text/turtle')
        //  console.log("result",result)
          //this.acl.status = "OK"
          await this.init()
        }catch(e){
          this.errors.push("I can not write ACL :"+ e)
          alert(e)

        }



        // @prefix : <#>.
        // @prefix acl: <http://www.w3.org/ns/auth/acl#>.
        // @prefix foaf: <http://xmlns.com/foaf/0.1/>.
        // @prefix target: <./>.
        //
        // :ReadAppend
        //     a acl:Authorization;
        //     acl:accessTo target:;
        //     acl:agentClass acl:AuthenticatedAgent;
        //     acl:mode acl:Read, acl:Append.
        //
        // :ReadWriteControl
        //     a acl:Authorization;
        //     acl:accessTo target:;
        //     acl:default target:;
        //     acl:agent </profile/card#me>;
        //     acl:agent <https://bourgeoa.solidcommunity.net/profile/card#me>;
        //     acl:mode acl:Read, acl:Write, acl:Control.

        //       @prefix : <#>.
        // @prefix acl: <http://www.w3.org/ns/auth/acl#>.
        // @prefix foaf: <http://xmlns.com/foaf/0.1/>.
        // @prefix target: <./>.
        //
        // :ReadAppend
        //     a acl:Authorization;
        //     acl:accessTo target:;
        //     acl:agentClass acl:AuthenticatedAgent;
        //     acl:mode acl:Read, acl:Append.
        //
        // :ReadWriteControl
        //     a acl:Authorization;
        //     acl:accessTo target:;
        //     acl:agent </profile/card#me>;
        //     acl:mode acl:Read, acl:Write, acl:Control.


        // if (this.webId != null){
        //   let inboxFolder = await ldflex.data.from(this.webId)[this.webId]['http://www.w3.org/ns/ldp#inbox']
        //   let inboxAnnonce = `${inboxFolder}`+"annonces/"
        //   if( !(await fc.itemExists(inboxAnnonce)) ) {
        //     await fc.createFolder(inboxAnnonce) // only create if it doesn't already exist
        //   }
        //
        //   let aclObject = await fc.aclUrlParser(inboxAnnonce)
        //   console.log("inherit acl",aclObject)
        //   let aclContent = await fc.acl.createContent(inboxAnnonce, aclObject/*, options*/)
        //   console.log(aclContent)
        //
        //   // add an other rule
        //   let   aclUsers = await fc.acl.addUserMode({}, [{ agent: this.webId }], ['Read', 'Write', 'Control'], ['accessTo', 'default'])
        //   aclUsers = await fc.acl.addUserMode(aclUsers, [{ agentClass: 'AuthenticatedAgent' }], ['Append'], ['default'])
        //   aclUsers = await fc.acl.addUserMode(aclUsers, [{ agentClass: 'Agent' }], ['Append', 'Read'], ['accessTo'])
        //
        //   //      aclUsers = await fc.acl.addUserMode(aclUsers, [{ agent: 'https://bourgeoa.solidcommunity.net/profile/card#me' }], ['Read', 'Write', 'Control'], ['accessTo', 'default'])
        //
        //
        //   //  let aclUsers = await fc.acl.addUserMode({}, [{ agentClass: 'AuthenticatedAgent'}], ['Read', 'Write'])
        //   const aclContentNew = await fc.acl.createContent(inboxAnnonce, aclUsers)
        //   console.log('build an aclContent ' + aclContentNew)
        //
        //   const { acl: aclUrl } = await fc.getItemLinks(inboxAnnonce, { links: 'include_possible'})
        //   //    const links = await fc.getItemLinks(inboxAnnonce, { links: 'include_possible'})
        //
        //   //  console.log(links)
        //   let result = await fc.putFile(aclUrl, aclContentNew, 'text/turtle')
        //   console.log("result",result)

      },



    },
    watch:{
      webId(){
        this.init()
      },
      authorizations(){
        this.init()
      }
    },
  }
  </script>

  <style>

  </style>
