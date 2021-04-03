<template>

  <div>
    <div v-if="webId != null">
      <div v-if="acl.status != 'OK'">
        <h5>ACL / Authorization verification : </h5>
        <p>
          To allow other Authenticated Users to send you inbox message, you have to set correct Authorizations for <b-badge variant="warning">{{ inboxAnnonceFolder }}</b-badge> as i'm not sure the are good :
          <ul>
            <li>
              <b-badge variant="warning">{{webId}}</b-badge> with <b-badge variant="warning">CONTROL</b-badge>
            </li>
            <li>
              AuthenticatedAgent as "Poster" for the folder & "Submitters" for it's content
            </li>
          </ul>
          <br>

          <a href="https://github.com/jeff-zucker/solid-file-client/issues/189" target="_blank">
            More info about why You must change authorization on this folder</a>
          </p>
          You can do it manually at <a :href="inboxAnnonceFolder" target="_blank">{{ inboxAnnonceFolder }}</a> or use this button. <br>
          <b-button @click="setAcl" v-if="acl.status == 'KO'">Set Authorization</b-button>
          <!-- <small>
          {{ acl }}
        </small> -->
      </div>


      <b-list-group>
        INBOX ( {{ messages.length}} messages )
        <b-list-group-item v-for="m in messages" :key="m.url">
          {{ m.created }} / {{ m.creator}} : <b>{{m.annonce.title}}</b> ::: {{ m.text }}


          <b-button variant="light" @click="reply(m)" style="margin-left:auto;">
            <b-icon icon="pen"></b-icon>
          </b-button>
          <b-button variant="danger" @click="showDeleteConfirm(m)" style="margin-left:auto;" v-b-modal.message-delete>
            <b-icon icon="trash"></b-icon>
          </b-button>
        </b-list-group-item>

        <b-modal id="message-delete" centered title="Delete" @ok="onDelete">
          <div class="p-3" v-html="deleteMessage"></div>
        </b-modal>

      </b-list-group>

    </div>

    <div v-else>
      You must login to manage your annonces inbox.
    </div>
  </div>


</template>

<script>
import auth from 'solid-auth-client';
import FC from 'solid-file-client'
const fc = new FC( auth )
let ldflex = window.solid
// import { v4 as uuidv4 } from 'uuid';

export default {
  name: "AnnonceInbox",
  data() {
    return {
      messages: [],
      deleteMessage: "",
      inboxAnnonceFolder: "",
      acl: {status: "checking"}
    }
  },
  async created(){
    this.init()
  },
  methods: {
    async init(){
      if (this.webId != null){
        //get inbox Folder
        this.acl.status = "finding webId"
        let inboxFolder = await ldflex.data.from(this.webId)[this.webId]['http://www.w3.org/ns/ldp#inbox']
        this.acl.status = "finding inbox"
        // get aannonce inbox folder
        this.inboxAnnonceFolder = await `${inboxFolder}`+"annonces/"
        this.acl.status = "imagining a annonce folder"
        console.log(this.webId, this.inboxAnnonceFolder)
        await this.checkAcl()
        this.readInbox()
      }
    },
    async checkAcl(){
      // create inbox annonce folder if not exist
      this.acl.status = "checking if folder exist"
      if( !(await fc.itemExists(this.inboxAnnonceFolder)) ) {
        this.acl.status = "creating folder"
        await fc.createFolder(this.inboxAnnonceFolder) // only create if it doesn't already exist
      }
      // check aclObject
      this.acl.status = "cheching authorizations"
      this.acl.aclObject = await fc.aclUrlParser(this.inboxAnnonceFolder)
      console.log("aclObject",JSON.stringify(this.acl.aclObject, undefined,2))
      // create Content from aclObject
      this.acl.aclContent = await fc.acl.createContent(this.inboxAnnonceFolder, this.acl.aclObject/*, options*/)
      console.log("aclcontent", this.acl.aclContent)
      console.log("acl", this.acl)
      // say they are KO for the moment as i can't verify see issue : https://github.com/jeff-zucker/solid-file-client/issues/189#issuecomment-812887070
      this.acl.status = "KO"
    },

    async setAcl(){
      // according to recent solid-file-client changes : https://github.com/jeff-zucker/solid-file-client/issues/189#issuecomment-808966875
      try{
        this.acl.status = "setting authorizations"
        let   aclUsers1 = await fc.acl.addUserMode({}, [{ agent: this.webId }], ['Read', 'Write', 'Control'], ['accessTo', 'default'])
        aclUsers1 = await fc.acl.addUserMode(aclUsers1, [{ agentClass: 'AuthenticatedAgent' }], ['Append'], ['default'])

        const aclUsers2 = await fc.acl.addUserMode({}, [{ agentClass: 'AuthenticatedAgent' }], ['Append', 'Read'], ['accessTo'])

        const aclUsers = [aclUsers1, aclUsers2]

        const aclContentNew = await fc.acl.createContent(this.inboxAnnonceFolder, aclUsers)
        console.log('build an aclContent ' + aclContentNew)

        const { acl: aclUrl } = await fc.getItemLinks(this.inboxAnnonceFolder, { links: 'include_possible'})
        //    const links = await fc.getItemLinks(inboxAnnonce, { links: 'include_possible'})

        //  console.log(links)
        let result = await fc.putFile(aclUrl, aclContentNew, 'text/turtle')
        console.log("result",result)
        this.acl.status = "OK"
      }catch(e){
        this.acl.status = "ERROR : "+e
        alert(e)

      }


    },
    async readInbox() {


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


      let folder = await fc.readFolder(this.inboxAnnonceFolder)
      console.log(folder)
      let files = folder.files.sort((a,b) => new Date(b.created).getTime() - new Date(a.created).getTime());
      // console.log(files)
      this.messages = []
      //
      while ( files.length > 0){
        let f = files.shift()
        let m = await JSON.parse(await fc.readFile(f.url))
        m.url = f.url
        this.messages.push(m)
        //  console.log(this.messages)
        //  console.log(f)
        // let resource = f.url+"#this"
        // for await (const annonce_url of ldflex.data[resource]['http://purl.org/dc/terms/hasPart']){
        //   let idx = this.annonces.findIndex(x => x.url === `${annonce_url}`)
        //   if (idx === -1) {
        //     this.annonces.push({url: `${annonce_url}`})
        //   }
        // }
      }
      //}
    },
    async onDelete(){
      console.log("delete")
      await fc.deleteFile(this.urlToDelete)
      this.readInbox()
      //this.$store.dispatch('annonce/delete', this.idToDelete)
    },
    showDeleteConfirm(m){
      this.deleteMessage= "Do you want to delete <b>"+m.url+"</b>"
      this.urlToDelete = m.url
    },
  },
  watch:{
    webId(){
      this.init()
    }
  },
  computed:{
    webId() {
      return this.$store.state.solid.webId
    }
  }
}
</script>

<style>

</style>
