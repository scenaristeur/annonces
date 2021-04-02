<template>
  <vue-bootstrap-typeahead
  ref="typehead"
  v-model="category"
  :data="categories"
  placeholder="Category"
  size="lg"
  :minMatchingChars="mmc"
  @hit="run_query"
  >
  <template slot="append">
    <button @click="reset" class="btn btn-primary">
      X
    </button>
  </template>
</vue-bootstrap-typeahead>
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
      mmc: 1,
      categories: [],
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
          let cat = `${subject}`.replace(base,'')
          !this.categories.includes(cat) ?  this.categories.push(cat) : ""
        }

      }
      console.log(this.categories)
    },
    run_query() {
      console.log(this.category)
      this.$emit('searchChanged',this.category)
    },
    removeTwoLastDirectoryPartOf(the_url){
      var the_arr = the_url.split('/');
      the_arr.pop()
      the_arr.pop();
      return( the_arr.join('/') );
    },
    reset(){
      this.category = ""
    //  this.$refs.typehead.value = ""
    }
  },
  watch:{
    agora_url(){
      this.init()
    },
    category(){
      console.log(this.category)
      if (this.category.length == 0){
        this.run_query()
      }
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
