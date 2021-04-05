<template>
  <div>
    <h5>Acl for {{ path }} : </h5>
    <div v-if="acl.status != 'OK'">
      <h5>ACL / Authorization verification : </h5>

      <b-badge :variant="acl.color">{{acl.status}}</b-badge>
      <b-badge :variant="acl.color">{{acl.message}}</b-badge>


      <p>
        To allow other Authenticated Users to send you inbox message, you have to set correct Authorizations for <b-badge variant="warning">{{ path }}</b-badge> as i'm not sure the are good :
        <ul>
          <li>
            <b-badge variant="warning">{{webId}}</b-badge> with <b-badge variant="warning">CONTROL</b-badge>
          </li>
          <li>
            AuthenticatedAgent as "Poster" for the folder & "Submitters" for it's content
          </li>
        </ul>
        <br>

        {{ acl.aclObject}}
        <hr>
        <p>



          Acl for <b-badge variant="warning">{{path}}</b-badge>
          <b-list-group>
            <b-list-group-item v-for="(aclAuth,i) in acl.aclObject" :key="i">
              <div v-if="aclAuth">
                aclAuth is ARRAY ?   {{ Array.isArray(aclAuth)}}
                <div v-for="(value, k) in Object.entries(aclAuth)" :key="k">
                  <div v-if="value[1].mode">
                    <h5>{{value[0].split('&')[0]}} : <b-badge variant="warning">{{value[0].split('&')[1]}}</b-badge></h5>
                    <b>Can :</b>
                    <b-badge :variant="value[1].mode.Read == 1? 'success': 'danger'">READ</b-badge>
                    <b-badge :variant="value[1].mode.Append == 1? 'success': 'danger'">APPEND</b-badge>
                    <b-badge :variant="value[1].mode.Write == 1? 'success': 'danger'">WRITE</b-badge>
                    <b-badge :variant="value[1].mode.Control == 1? 'success': 'danger'">CONTROL</b-badge>

                    <!-- <b-badge variant="warning">  APPEND : {{value[1].mode.Append}}</b-badge>
                    <b-badge variant="warning">  WRITE : {{value[1].mode.Write}}</b-badge>
                    <b-badge variant="warning">  CONTROL : {{value[1].mode.Control}}</b-badge> -->
                    <!-- <div v-for="(mode, m) in Object.entries(value[1].mode)" :key="m">
                    <b-badge variant="warning">{{mode}}</b-badge>

                  </div> -->

                  <br>
                  <b>What ?</b>
                  <!-- {{value[1].access}} -->
                  <b-badge v-if="value[1].access.accessTo == 1">{{path}}</b-badge>
                  <div  v-if="value[1].access.default == 1">content of
                    <b-badge> {{ path }}</b-badge>
                  </div>

                  <br>
                  <!-- <b>And:</b> {{value[1].key}}<br> -->
                  <br>
                </div>
                <div v-else>
                  {{ value[1]}} should have mode
                </div>
              </div>
            </div>
          </b-list-group-item>
        </b-list-group>


        <!-- <b-table striped hover responsive  :items="acl.aclObject">
        <template #cell()="data">
        <b>Agent:</b> {{data.item}} : {{data.item}}<br>
        <b>Mode :</b> {{data.item.mode}}<br>
        <b>Access:</b> {{data.item.access}}
      </template>
    </b-table> -->


  </p>


  <!-- <a href="https://github.com/jeff-zucker/solid-file-client/issues/189" target="_blank">
  More info about why You must change authorization on this folder</a>
</p> -->
You can do it manually at <a :href="path" target="_blank">{{ path }}</a> or use this button. <br>
<b-button @click="setAcl" v-if="acl.status == 'KO'">Set Authorization</b-button>
<!-- <small>
{{ acl }}
</small> -->
</div>
<div v-else>
  ACL OK
  {{ acl }}

</div>
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
  props: ['path', 'authorizations', 'webId'],
  data() {
    return {
      acl: {status: "init", message: "I will check authorizations", color: "danger"}
    }
  },
  async created(){
    this.init()
  },
  methods: {
    // async init(){
    //   if (this.webId != null && this.path.length > 0){
    //     getPublicAccess(this.path).then(access => {
    //       // => access is an object like
    //       //    {
    //       //       read: true, append: false, write: false,
    //       //       controlRead: false, controlWrite: false
    //       //    }
    //       //    or null if the ACL is not accessible to the current user.
    //       if (access === null) {
    //         console.log("Could not load access details for this Resource.")
    //       } else {
    //         console.log(
    //           "Can everyone read this Resource:",
    //           access.read,
    //         );
    //         console.log(
    //           "Can everyone add data to this Resource:",
    //           access.append,
    //         );
    //         console.log(
    //           "Can everyone change data in this Resource:",
    //           access.write,
    //         );
    //         console.log(
    //           "Can everyone see and change who has what access to this Resource:",
    //           access.controlRead && access.controlWrite,
    //         );
    //       }
    //     });
    //   }
    // },
    // async init1(){
    //   if (this.webId != null && this.path != undefined && this.path.length > 0){
    //     let folder = await fc.readFolder( this.path, {links:"include"} )
    //     console.log(folder)
    //     if(folder.links.acl!= undefined){
    //       this.acl.message = "ACL FOUND"
    //     //  this.loadJsonld(folder.links.acl)
    //     }else{
    //       //console.log("NO ACL FOUND")
    //       this.acl.status = "KO"
    //       this.acl.message = "NO ACL FOUND"
    //     }
    //
    //   }
    // },
    // async loadJsonld(s){
    //   console.log(s)
    //   let documentLoaderType = 'xhr'
    //   await jsonld.useDocumentLoader(documentLoaderType, {withCredentials : true});
    //   let doc = await jsonld.documentLoader(s, function(err) {
    //     if(err) {
    //       alert(err)
    //     }
    //   })
    //   doc.jsonld = JSON.parse(doc.document)
    //   delete doc.document
    //   console.log(doc)
    //   //await this.ldpToGraph(doc)
    // },
    async init(){
      if (this.webId != null && this.path.length > 0){
        this.acl.status = "imagining a annonce folder"
        console.log(this.webId, this.path)

        if( !(await fc.itemExists(this.path)) ) {
          this.acl.status = "creating folder"
          await fc.createFolder(this.path) // only create if it doesn't already exist
        }
        await this.checkAcl("first run")
        // let folder = await fc.readFolder( this.path, {links:"include"} )
        // console.log(folder)
        // if(folder.links.acl!= undefined){
        //   this.acl.message = "ACL FOUND"
        //   let url = folder.links.acl
        //   //    let url = "https://spoggy-test9.solidcommunity.net/public/.acl"
        //   let aclContent = await fc.readFile(url)
        //   const jsonld = ttl2jsonld.parse(aclContent);
        //   console.log(jsonld)
        //   console.log(JSON.stringify(jsonld,null,2));
        //   console.log(jsonld['@graph'])
        //   jsonld['@graph'].forEach(auth => {
        //     console.log(auth)
        //   });
        // }

        //  this.loadJsonld(folder.links.acl)
      }else{
        //console.log("NO ACL FOUND")
        this.acl.status = "KO"
        this.acl.message = "NO ACL FOUND"
      }

      //  }
    },
    async checkAcl(step){
      // create inbox annonce folder if not exist
      this.acl.status = "checking if folder exist"

      // check aclObject
      this.acl.status = "cheching authorizations"
      this.acl.aclObject = await fc.aclUrlParser(this.path)

// console.log("ME",this.acl.aclObject[0]["agent&https://spoggy-test4.solidcommunity.net/profile/card#me"])


      console.log(step,"aclObject on ",this.path,JSON.stringify(this.acl.aclObject, undefined,2))
      // create Content from aclObject
      this.acl.aclContent = await fc.acl.createContent(this.path, this.acl.aclObject/*, options*/)
      console.log(step,"aclcontent on ",this.path, this.acl.aclContent)
      console.log(step,"aclon ",this.path, this.acl)
      // say they are KO for the moment as i can't verify see issue : https://github.com/jeff-zucker/solid-file-client/issues/189#issuecomment-812887070
      this.acl.status = "KO"
      console.log(this.acl.aclObject)
      if (Array.isArray(this.acl.aclObject)){
        let auths = []

        this.acl.aclObject.forEach((aclAuth) => {
          console.log(aclAuth)
          for (const [key, value] of Object.entries(aclAuth)) {
            console.log(key, value);
            let keysSplit = key.split('&')
            auths[keysSplit[0]] == undefined ? auths[keysSplit[0]] = {[keysSplit[1]]: []} : ""
            auths[keysSplit[0]][keysSplit[1]] == undefined ? auths[keysSplit[0]][keysSplit[1]] = [value] : auths[keysSplit[0]][keysSplit[1]].push(value)
            // formate to [{ agent: this.webId }], ['Read', 'Write', 'Control'], ['accessTo', 'default']
            //or [{ agentClass: 'AuthenticatedAgent' }], ['Append', 'Read'], ['accessTo']
            // let agent = {}
            // let mode= []
            // let access= []
            //
            // agent[value.agent.predicate] = value.agent.object
            // for (const [m, v] of Object.entries(value.mode)) {
            //   v == 1 ? mode.push(m) : ""
            // }
            // for (const [a, v] of Object.entries(value.access)) {
            //   v == 1 ? access.push(a) : ""
            // }
            //
            // let auth = [[agent], mode,  access]
            // auths.push(auth)

          }


        });
        console.log("AUTHS",auths)

        console.log(JSON.stringify(auths,null,2));


        // let b = [
        //   [
        //     [
        //       {
        //         "agent": "https://spoggy-test4.solidcommunity.net/profile/card#me"
        //       }
        //     ],
        //     [
        //       "Read",
        //       "Write",
        //       "Control"
        //     ],
        //     [
        //       "accessTo",
        //       "default"
        //     ]
        //   ],
        //   [
        //     [
        //       {
        //         "agentClass": "AuthenticatedAgent"
        //       }
        //     ],
        //     [
        //       "Append"
        //     ],
        //     [
        //       "default"
        //     ]
        //   ],
        //   [
        //     [
        //       {
        //         "agentClass": "AuthenticatedAgent"
        //       }
        //     ],
        //     [
        //       "Read",
        //       "Append"
        //     ],
        //     [
        //       "accessTo"
        //     ]
        //   ]
        // ]
        //
        // if (auths === b){
        //   this.acl.status = "OK"
        //   this.acl.message = "ACL IS OK"
        // }

        //  console.log("RESULT",result);


      }else{
        console.log("is not ARRAY")
        this.acl.status = "KO"
        this.acl.message = "is not an array"
      }

      //let mode = await window.aclMode(this.path, this.acl.aclContent, /*options*/)
      //console.log(window)
    },
    // comparer(otherArray){
    //   return function(current){
    //     return otherArray.filter(function(other){
    //       return other.value == current.value && other.display == current.display
    //     }).length == 0;
    //   }
    // },

    async setAcl(){
      // according to recent solid-file-client changes : https://github.com/jeff-zucker/solid-file-client/issues/189#issuecomment-808966875
      try{
        this.acl.status = "setting authorizations"
        const aclOwner = await fc.acl.addUserMode({}, [{ agent: this.webId }], ['Read', 'Write', 'Control'], ['accessTo', 'default'])
        const aclUsers1 = await fc.acl.addUserMode({}, [{ agentClass: 'AuthenticatedAgent' }], ['Append'], ['default'])
        const aclUsers2 = await fc.acl.addUserMode({}, [{ agentClass: 'AuthenticatedAgent' }], ['Append', 'Read'], ['accessTo'])

        const aclUsers = [aclOwner, aclUsers1, aclUsers2]

        const aclContentNew = await fc.acl.createContent(this.path, aclUsers)
        console.log('build an aclContent ' + aclContentNew)

        const { acl: aclUrl } = await fc.getItemLinks(this.path, { links: 'include_possible'})
        //    const links = await fc.getItemLinks(inboxAnnonce, { links: 'include_possible'})

        //  console.log(links)
        let result = await fc.putFile(aclUrl, aclContentNew, 'text/turtle')
        console.log("result",result)
        //this.acl.status = "OK"
        await this.checkAcl("after update")
      }catch(e){
        this.acl.status = "ERROR : "+e
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
    path(){
      this.init()
    }
  },
}
</script>

<style>

</style>
