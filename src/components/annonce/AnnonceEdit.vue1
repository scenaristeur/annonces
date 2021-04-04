<template>
  <b-container>
    <div v-if="webId != null">
      <h3>Add an Annonce</h3>
      <b-form>

        <b-form-group
        id="input-group-title"
        label="Title:"
        label-for="input-title"
        description="Your annonce / 'small ad' need a explicit title."
        >
        <b-form-input
        id="input-title"
        v-model="annonce.title" :state="getState()" autofocus
        placeholder="Enter annonce title"
        required
        ></b-form-input>
      </b-form-group>


      <!-- <b-input placeholder="title" v-model="annonce.title" :state="getState()" autofocus /> -->

      <b-form-group
      id="input-group-category"
      label="Categories:"
      label-for="input-category"
      description="Please add 1 to 3 categories to specify where to find your annonce."
      >
      <b-form-input
      id="input-category"
      placeholder="3 categories max, comma separated"
      v-model="annonce.category"
      ></b-form-input>
    </b-form-group>

    <!-- <b-input placeholder="3 categories max, comma separated" v-model="annonce.category" /> -->



    <b-form-group
    id="input-group-category"
    label="Description:"
    label-for="input-description"
    description="Please give a clear description."
    >
    <b-textarea id="input-description" placeholder="Description" v-model="annonce.description"  rows="7"/>
    <!-- <b-form-input
    id="input-category"
    placeholder="3 categories max, comma separated"
    v-model="annonce.category"
    required
    ></b-form-input> -->
  </b-form-group>

  <b-form inline>
    <label class="mr-sm-2" for="input-price">Price:</label>
    <b-input id="input-price" placeholder="price" v-model="annonce.price" class="mr-sm-2" />
    <label class="mr-sm-2" for="input-currency">Currency:</label>
    <b-input id="input-currency" placeholder="currency (€,$...)" v-model="annonce.currency" class="mr-sm-2" />
  </b-form>
  <!-- <b-button variant="light" @click="addField()" style="margin-left:auto;">
  <b-icon icon="plus"></b-icon>
</b-button> -->



<b-form-group
id="input-group-images"
label="Images:"
label-for="input-images"
description="Add some images for a better description & visibility"
>
<Upload id="input-images" :images="annonce.images" @imagesUploaded="imagesUploaded"/>
<!-- <b-form-input
id="input-title"
v-model="annonce.title" :state="getState()" autofocus
placeholder="Enter annonce title"
required
></b-form-input> -->
</b-form-group>
<p>If you add images, don't forget to hit the "send" button before hitting the "save" one.</p>


<div class="d-flex">

  <b-button class="ml-auto" variant="info" @click="add()">save</b-button>
  <b-button class="ml-2" variant="secondary" @click="goBack()">back</b-button>
</div>
</b-form>
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
    this.annonce = this.$route.params.id != undefined ?  this.annoncesMy.find(x => x.id === this.$route.params.id): new Annonce()
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
    annoncesMy() {
      return this.$store.state.annonce.annoncesMy
    },
    webId() {
      return this.$store.state.solid.webId
    },
  },
}
</script>

<style>

</style>
