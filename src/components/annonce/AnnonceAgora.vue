<template>
  <div>
<!--
    Agora's Annonces | <router-link :to="{ name: 'Config'}">config</router-link> -->

    <!-- <TimeScroller start="03/02/2021" :root="this.temp_url" :step="step" extension="ttl" /> -->
    <TimeLoader :root="this.temp_url" start="03/22/2021" />

    <!-- <b-list-group>
    <b-list-group-item button v-for="a in annonces" :key="a.url">
    <AnnonceLine :annonce="a" />
  </b-list-group-item>
</b-list-group> -->

</div>
</template>

<script>


// import auth from 'solid-auth-client';
// import FC from 'solid-file-client'
// const fc = new FC( auth )
// let ldflex = window.solid

export default {
  name: "AnnonceAgora",
  components: {
    //  'TimeScroller': () => import('@/components/layout/TimeScroller'),
    'TimeLoader': () => import('@/components/layout/TimeLoader')
  },
  data(){
    return {
      temp_url: this.$store.state.annonce.agora_url,
      //  step: "month"
    }
  },

  // created(){
  //   this.load()
  // },
  // methods: {
  //   async  load() {
  //     this.agora_url = this.temp_url
  //     let date = new Date()
  //     let path = [this.agora_url+date.getFullYear(), ("0" + (date.getMonth() + 1)).slice(-2)].join("/")
  //     let folder = await fc.readFolder(path)
  //     console.log(folder)
  //     let files = folder.files.sort((a,b) => new Date(b.modified).getTime() - new Date(a.modified).getTime());
  //     console.log(files)
  //     this.annoncesAll = []
  //
  //     while (this.annoncesAll.length < 100 && files.length > 0){
  //       let f = files.shift()
  //       //  console.log(f)
  //       let resource = f.url+"#this"
  //       for await (const annonce_url of ldflex.data[resource]['http://purl.org/dc/terms/hasPart']){
  //         let idx = this.annoncesAll.findIndex(x => x.url === `${annonce_url}`)
  //         if (idx === -1) {
  //           this.annoncesAll.push({url: `${annonce_url}`})
  //         }
  //       }
  //     }
  //
  //     // for await (const f of folder.files) {
  //     //   annonces.push(JSON.parse(await fc.readFile(f.url)))
  //     // }
  //     //  await folder.files.map( function(x) {
  //     //   let f =  fc.readFile(x.url)
  //     //   return `${f}`
  //     // })
  //     console.log(this.annoncesAll)
  //
  //
  //   }
  //},

  watch:{
    agora_url(){
      //  console.log(this.agora_url)
      this.temp_url = this.agora_url
    }
  },

  computed:{
    agora_url: {
      get () { return this.$store.state.annonce.agora_url},
      set (url) { this.$store.commit('annonce/setAgoraUrl', url) }
    },
    // annoncesAll: {
    //   get () { return this.$store.state.annonce.annoncesAll},
    //   set (annoncesAll) { this.$store.commit('annonce/setAnnoncesAll', annoncesAll) }
    // }

  },

}
</script>
