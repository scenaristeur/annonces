<template>
  <b-container>
    <div v-if="webId != null">
      <h3>Add an Annonce</h3>
      <b-input placeholder="title" v-model="annonce.title" :state="getState()" autofocus />
      <b-input placeholder="3 categories max, comma separated" v-model="annonce.category" />
      <b-textarea placeholder="description" v-model="annonce.description" />
      <b-input placeholder="price" v-model="annonce.price" />
      <b-input placeholder="currency (€,$...)" v-model="annonce.currency" />

      <!-- <b-button variant="light" @click="addField()" style="margin-left:auto;">
      <b-icon icon="plus"></b-icon>
    </b-button> -->

    <Upload :images="annonce.images" @imagesUploaded="imagesUploaded"/>
    <div class="d-flex">
      if you have added images, don't forget to hit the "send" button before hitting the "save" one.
      <b-button class="ml-auto" variant="primary" @click="add()">save</b-button>
      <b-button class="ml-2" variant="outline-secondary" @click="goBack()">back</b-button>
    </div>
  </div>
  <div v-else>
    You must login to manage your annonces.
  </div>
</b-container>
</template>

<script>
import {Annonce} from './Annonce'


export default {
  name: "AnnonceEdit",
  components: {
    'Upload': () => import('@/components/portfolio/Upload'),
  },
  data(){
    return{
      annonce: null,
      files: null
    }
  },
  created(){
    console.log(this.$route.params.id)
    this.annonce = this.$route.params.id != undefined ?  this.annonces.find(x => x.id === this.$route.params.id): new Annonce()
    this.annonce.images == undefined ? this.annonce.images = [] : ""
  },
  methods: {
    add() {
      if (this.annonce.title.length < 1){
        alert("Title must not be empty !")
        return
      }
      console.log(this.annonce)
      this.$store.dispatch('annonce/update', this.annonce)
      this.$router.go(-1)
    },
    goBack(){
      this.$router.go(-1)
    },
    getState() {
      return this.annonce.title.length > 0;
    },
    imagesUploaded(images){
      console.log(images)
      this.annonce.images = images
    }
  },
  computed:{
    annonces() {
      return this.$store.state.annonce.annonces
    },
    webId() {
      return this.$store.state.solid.webId
    },
  },
}
</script>

<style>

</style>
