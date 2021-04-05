<template>

  <div>
    <div v-if="webId != null">

      <AclCheck :path="inboxAnnonceFolder" :authorizations="authorizations" :webId="webId" />


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
  components: {
    'AclCheck': () => import('@/components/solid/AclCheck'),
  },
  data() {
    return {
      messages: [],
      deleteMessage: "",
      inboxAnnonceFolder: "",
      authorizations: null
      //  acl: {status: "checking"}
    }
  },
  async created(){
    this.init()
  },
  methods: {
    async init(){

      if (this.webId != null){
        //get inbox Folder
        let inboxFolder = await ldflex.data.from(this.webId)[this.webId]['http://www.w3.org/ns/ldp#inbox']
        // get aannonce inbox folder
        this.inboxAnnonceFolder = await `${inboxFolder}`+"annonces/"
        //  this.acl.status = "imagining a annonce folder"
        //  console.log(this.webId, this.inboxAnnonceFolder)
        // await this.checkAcl("first run")
        if( !(await fc.itemExists(this.inboxAnnonceFolder)) ) {
          await fc.createFolder(this.inboxAnnonceFolder) // only create if it doesn't already exist
        }
        this.buildAuthorization()
      }
      this.readInbox()
    },
buildAuthorization(){
  this.authorizations= `{
    "${this.inboxAnnonceFolder}": {
      "accessTo": {
        "${this.webId}": {
          "type": "agent",
          "mode": {
            "Read": 1,
            "Append": 0,
            "Write": 1,
            "Control": 1
          }
        },
        "AuthenticatedAgent": {
          "type": "agentClass",
          "mode": {
            "Read": 1,
            "Append": 1,
            "Write": 0,
            "Control": 0
          }
        }
      },
      "default": {
        "${this.webId}": {
          "type": "agent",
          "mode": {
            "Read": 1,
            "Append": 0,
            "Write": 1,
            "Control": 1
          }
        },
        "AuthenticatedAgent": {
          "type": "agentClass",
          "mode": {
            "Read": 0,
            "Append": 1,
            "Write": 0,
            "Control": 0
          }
        }
      }
  }}`
},
    async readInbox() {
      if (this.inboxAnnonceFolder != undefined && this.inboxAnnonceFolder.length > 0){
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
