<template>
  <vue-bootstrap-typeahead
  v-model="category"
  :data="categories"
  placeholder="Category, keyword, (or search)"
  size="lg"
  @hit="run_query"
  />
  <!--   @hit="category = $event"-->
</template>

<script>
let ldflex = window.solid
//import VueBootstrapTypeahead from 'vue-bootstrap-typeahead'
export default {
  name: "AnnonceSearch",
  components: {
    'VueBootstrapTypeahead': () => import('vue-bootstrap-typeahead'),
  },
  data(){
    return {
      categories: ['Canada', 'USA', 'Mexico'],
      category: '',
      selectedAddress: null
    }
  },
  created(){
    console.log(this.$store.state.annonce.agora_url)
    this.init()
  },
  methods: {
    async init(){
      this.category_url = this.removeTwoLastDirectoryPartOf(this.$store.state.annonce.agora_url)+'/categories.ttl'
      console.log(this.category_url)
      this.categories = []
      for await (const subject of ldflex.data[this.category_url].subjects){
      //  console.log(`${subject}`);
        let base = this.category_url+"#"
        if (`${subject}`.includes(base)){
          this.categories.push(`${subject}`.replace(base,''))
        }

      }
      console.log(this.categories)
    },
    run_query() {
      console.log(this.category)
    },
    removeTwoLastDirectoryPartOf(the_url){
      var the_arr = the_url.split('/');
      the_arr.pop()
      the_arr.pop();
      return( the_arr.join('/') );
    }
  },
  watch:{
    agora_url(){
      this.init()
    }
  },
  agora_url:{
    webId() {
      return this.$store.state.annonce.agora_url
    },
  }

}
</script>

<style>

</style>
