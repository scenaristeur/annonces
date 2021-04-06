<template>
  <div>
    <AnnonceSearch @searchChanged="searchChanged" />
    <b-list-group>
      <AnnonceCard :annonce="a" v-for="a in annonces" :key="a.url" :search="search" />
    </b-list-group>

    <infinite-loading @infinite="infiniteHandler" :identifier="infiniteId" spinner="waveDots"></infinite-loading>
    <b-alert
    v-model="busy"
    class="position-fixed fixed-bottom rounded-3"
    style="z-index: 2000; bottom:0px"
    variant="info"
    dismissible
    >{{title}}
  </b-alert>
</div>
</template>

<script>
// import axios from 'axios';
//
// const api = '//hn.algolia.com/api/v1/search_by_date?tags=story';
let ldflex = window.solid


export default {
  name: "TimeLoader",
  props: ['root', 'start'],
  components: {
    'AnnonceSearch': () => import('@/components/annonce/AnnonceSearch'),
    'InfiniteLoading': () => import('vue-infinite-loading'),
    'AnnonceCard': () => import('@/components/annonce/AnnonceCard'),
  },
  data() {
    return {
      page: 1,
      annonces: [],
      limite: null,
      search: "",
      infiniteId: +new Date(),
      title: "",
      busy: false
    };
  },
  created(){

    this.init()
  },
  methods: {
    init(){
      console.log("todo : insert this.annoncesAll deja recupérées en cache")
      //this.annonces.push(... this.annoncesAll)
      // this.busy = true
      // console.log("connues",this.annoncesAll)
      //  this.annonces = this.annoncesAll
      // this.busy = false
      this.limite = this.start != undefined ? new Date(this.start) : new Date("02/01/2021")
      this.date = new Date()
        this.infiniteId += 1;
    },
    async infiniteHandler($state) {

      if (this.limite <= this.date ){
        this.busy = true
        let path = this.getPath()
        let resource = path+"#this"
        try{
          this.title = "loading "+this.date.toLocaleDateString()
          for await (const annonce_url of ldflex.data[resource]['http://purl.org/dc/terms/hasPart']){
            let idx = this.annonces.findIndex(x => x.url === `${annonce_url}`)
            if (idx === -1) {
              this.annonces.push({url: `${annonce_url}`})
            }
          }
        }catch{
          console.log("nothing on",path)
        }
        this.date.setDate(this.date.getDate() -1)
        //  let data = [{date: this.date}]
        //  this.annonces.push(...data);
        $state.loaded();
        this.busy = false
        this.$store.commit('annonce/setAnnoncesAll', this.annonces)
      }else{
        $state.complete();
      }

      // axios.get(api, {
      //   params: {
      //     page: this.page,
      //   },
      // }).then(({ data }) => {
      //   console.log(data)
      //   if (data.hits.length) {
      //     this.page += 1;
      //     this.annonces.push(...data.hits);
      //     $state.loaded();
      //   } else {
      //     $state.complete();
      //   }
      // });


    },
    searchChanged(s){
      this.search = s
      console.log(s)
      this.annonces = []
      this.init()

    },
    getPath(){
      let path = this.root
      path +=[this.date.getFullYear(), ("0" + (this.date.getMonth() + 1)).slice(-2), ("0" + this.date.getDate()).slice(-2)].join("/")
      path+= ".ttl"
      return path
    },
    makeToast(title, content, variant = null) {
      this.$bvToast.toast(content , {
        title: title,
        variant: variant,
        solid: true
      })
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
