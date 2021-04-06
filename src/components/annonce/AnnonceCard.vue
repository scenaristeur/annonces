<template>
  <b-list-group-item  v-if="show" button class="mb-2 rounded-5" @click="showDetails" variant="info" >



    <div class="row">
      <b-col md="3" v-if="a.image != undefined && a.image.length > 0">
        <b-img :src="a.image" thumbnail fluid style="max-height=100px" class="mb-2" :title='a.images != undefined && a.images.length > 1 ? a.images.length+" images": ""'>

        </b-img>
        <b-badge v-if="a.images.length>1" variant="info" style="position: absolute; top:10px, right:100px">{{a.images.length}}</b-badge>
      </b-col>
      <b-col>
        <div  class="flex-column align-items-start">
          <div class="d-flex w-100 justify-content-between">
            <h4 class="mb-1">{{a.title}}</h4>
            <!-- <div></div> -->
            <b-alert show variant="info" v-if="a.price != undefined && a.price.length > 0"><b>{{a.price}} {{a.currency}}</b></b-alert>
            <!-- <small>3 days ago</small> -->
            <!-- <b-badge variant="primary" pill class="mr-3"></b-badge> -->
          </div>

          <!-- <b-badge variant="primary" pill class="mr-3">{{a.price}} {{a.currency}}</b-badge> -->

          <div v-if="a.category != undefined">
            <b-badge variant="primary"  v-for="(c, i) in a.category.split(',')" :key="i"  pill class="mr-3">{{c}}</b-badge>
          </div>

          <p class="mb-1">
            {{ a.description && a.description.length > 60 ? a.description.substring(0,60)+".." : a.description  }}
          </p>

          <small v-if="a.date != undefined">{{new Date(a.date).toLocaleDateString()}}</small>
        </div>
      </b-col>
    </div>

    <!-- <b-col>
    <h4 class="d-flex justify-content-between align-items-center">
    {{ a.title && a.title.length > 50 ? a.title.substring(0,50)+".." : a.title  }}
  </h4>



</b-col> -->


<!-- <b-card no-body class="overflow-hidden"  v-if="show">
<b-row no-gutters>
<b-col md="3" v-if="a.image.length > 0">
<b-card-img :src="a.image" class="rounded-0" style="max-height=100px"></b-card-img>
</b-col>
<b-col>
<b-card-body>
<b-link @click="showDetails" variant="outline-info" class="stretched-link">

<h4 class="d-flex justify-content-between align-items-center">
{{ a.title && a.title.length > 50 ? a.title.substring(0,50)+".." : a.title  }}
</h4>

</b-link>
<b-badge variant="primary" pill class="mr-3">{{a.price}} {{a.currency}}</b-badge>

<b-card-sub-title >
<b-badge variant="primary"  v-for="(c, i) in a.category.split(',')" :key="i"  pill class="mr-3">{{c}}</b-badge>
</b-card-sub-title>

<b-card-text>
{{ a.description && a.description.length > 60 ? a.description.substring(0,60)+".." : a.description  }}
</b-card-text>
<small> modified: {{a.date}}</small>
</b-card-body>
</b-col>
</b-row>
</b-card> -->
</b-list-group-item>

</template>

<script>
import auth from 'solid-auth-client';
import FC from 'solid-file-client'
const fc = new FC( auth )

export default {
  name: "AnnonceCard",
  props: ['annonce', 'search'],
  data(){
    return {
      a: {},
      show : false
    }
  },
  async created(){

    this.init()

  },
  methods: {

    async  init(){
      this.idx = this.annoncesAll.findIndex(x => x.url === this.annonce.url)
      if (this.idx === -1) {
        console.log("ohoh, not found ???",)
        //  this.annonces.push({url: `${annonce_url}`})
      }else{
        console.log(this.idx)
        //  console.log("found",this.annoncesAll[idx])
        this.a = this.annoncesAll[this.idx]
        console.log(this.a)
        if (this.a.title == undefined){
          await  this.fetchAnnonce()
          await this.updateAnnoncesAll()
        }

      }
    },

    async fetchAnnonce(){
      let aText = await fc.readFile(this.annonce.url)
      if (aText.includes(this.search)){
        this.show = true
        this.a = JSON.parse(aText)
        this.a.image = this.a.images[0] || "" //"https://picsum.photos/400/200/?image=41"
        this.a.date = this.a.modified.pop() || this.a.created
        //  console.log(this.a)
      }else{
        this.show = false
      }
    },
    async updateAnnoncesAll(){
      console.log("updateAll", this.a)
        this.$store.commit('annonce/updateAnnoncesAll', this.a)
    },


    showDetails() {
      //this.$router.push('/add')
      console.log(this.a.id)
      this.$router.push({ name: 'Detail', query: { url: this.a.url } })
    },
  },
  computed:{
    annoncesAll: {
      get () { return this.$store.state.annonce.annoncesAll},
      set () {  }
    }
  },
}
</script>

<style>

</style>
