<template>
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
      deleteMessage: ""
    }
  },
  async created(){
    //  this.webId = this.$store.state.solid.webId
    this.readInbox()
  },
  methods: {
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


      if (this.webId != null){
        let inboxFolder = await ldflex.data.from(this.webId)[this.webId]['http://www.w3.org/ns/ldp#inbox']
        let inboxAnnonce = `${inboxFolder}`+"annonces/"
        if( !(await fc.itemExists(inboxAnnonce)) ) {
          await fc.createFolder(inboxAnnonce) // only create if it doesn't already exist
        }

        let aclObject = await fc.aclUrlParser(inboxAnnonce)
        console.log("inherit acl",aclObject)
        let aclContent = await fc.acl.createContent(inboxAnnonce, aclObject/*, options*/)
        console.log(aclContent)

        // add an other rule
        let   aclUsers = await fc.acl.addUserMode({}, [{ agent: this.webId }], ['Read', 'Write', 'Control'], ['accessTo', 'default'])
        aclUsers = await fc.acl.addUserMode(aclUsers, [{ agentClass: 'AuthenticatedAgent' }], ['Append'], ['default'])
        aclUsers = await fc.acl.addUserMode(aclUsers, [{ agentClass: 'Agent' }], ['Append', 'Read'], ['accessTo'])

        //      aclUsers = await fc.acl.addUserMode(aclUsers, [{ agent: 'https://bourgeoa.solidcommunity.net/profile/card#me' }], ['Read', 'Write', 'Control'], ['accessTo', 'default'])


        //  let aclUsers = await fc.acl.addUserMode({}, [{ agentClass: 'AuthenticatedAgent'}], ['Read', 'Write'])
        const aclContentNew = await fc.acl.createContent(inboxAnnonce, aclUsers)
        console.log('build an aclContent ' + aclContentNew)

        const { acl: aclUrl } = await fc.getItemLinks(inboxAnnonce, { links: 'include_possible'})
        //    const links = await fc.getItemLinks(inboxAnnonce, { links: 'include_possible'})

        //  console.log(links)
        let result = await fc.putFile(aclUrl, aclContentNew, 'text/turtle')
        console.log("result",result)


        let folder = await fc.readFolder(inboxAnnonce)
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
      }
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
      this.readInbox()
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
