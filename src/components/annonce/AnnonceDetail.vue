<template>
  <div>

    <b-card
    tag="article"
    class="mb-2"
    button
    >

    <b-card-title class="d-flex justify-content-between align-items-center">

      <span>{{a.title}}</span>
      <b-card-sub-title >
        <b-badge variant="primary"  v-for="(c, i) in a.category.split(',')" :key="i"  pill class="mr-3">{{c}}</b-badge>
      </b-card-sub-title>
      <b-card-text>
        {{a.price}} {{a.currency}}

      </b-card-text>
    </b-card-title>


    <b-card-text>
      {{ a.description }}
    </b-card-text>


    <b-alert v-if="error.length == 0" show>
      <div v-if="webId != null">
        Contact : <b-button v-b-modal.modal-contact variant="info">{{ a.creator }}</b-button>
      </div>
      <div v-else>
        You must login to contact the creator of this annonce.
      </div>
    </b-alert>
    <b-alert v-else show variant="danger">
      {{ error }}

      <b-button variant="danger" to="/">Back to Annonces List</b-button>
    </b-alert>

    <div v-for="i in a.images" :key="i">
      <b-card-img :src="i" alt="Image"   style="max-width: 20rem;"
      class="mb-2" bottom></b-card-img>
    </div>
    <!-- {{ a.images }} -->



    <small> modified: {{a.date}}</small>
  </b-card>


  <b-modal id="modal-contact" centered title="Send a message" @ok="onSend" size="lg">

    <b-form-textarea
    id="textarea"
    v-model="message.text"
    :placeholder="'Enter your message to '+ a.creator"
    rows="3"
    max-rows="6"
    ></b-form-textarea>
  </b-modal>

</div>

<!-- <b-button variant="outline-info"> -->
<!-- </b-button>
{{ a}}
</div> -->
</template>

<script>
import auth from 'solid-auth-client';
import FC from 'solid-file-client'
const fc = new FC( auth )
let ldflex = window.solid
import { v4 as uuidv4 } from 'uuid';


export default {
  name: "AnnonceDetail",
  data(){
    return {
      a: {category: ""},
      message: {},
      error : ""
    }
  },
  async created(){
    let url = this.$route.query.url
    console.log(url)
    if (url == undefined){ this.$router.push({path: '/'}) }else{
      try{
        this.a = JSON.parse(await fc.readFile(url))
        this.a.image = this.a.images[0] || "https://picsum.photos/400/200/?image=41"
        this.a.date = this.a.modified.pop() || this.a.created
        let inboxFolder = await ldflex.data.from(this.a.creator)[this.a.creator]['http://www.w3.org/ns/ldp#inbox']
        this.inboxAnnonce = `${inboxFolder}`+"annonces/"
      }catch(e){
        this.error = e+ "... \n There is no annonce at \n"+url
      }
    }
  },
  methods: {
    async onSend() {
      this.message.annonce = this.a
      this.message.creator = this.webId
      this.message.created = new Date().toISOString()
      console.log(this.message)
      console.log(this.inboxAnnonce)
      let file = this.inboxAnnonce+uuidv4()+".json"


      // let aclObject = await fc.aclUrlParser(this.inboxAnnonce)
      // console.log("inherit acl",aclObject)

      try{
        await fc.postFile(file, JSON.stringify(this.message), "application/json")
        alert("Message send to "+this.message.annonce.creator)
      }catch(e){
        alert("Sorry but i can not send message, "+e)
      }
      this.message.text = ""

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
