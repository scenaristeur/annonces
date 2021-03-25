<template>


  <b-card
  tag="article"
  style="max-width: 20rem;"
  class="mb-2"
  no-body
  >
  <b-card-body>

    <b-card-img :src="a.image" top></b-card-img>

    <!-- <b-card-title>{{a.title}}</b-card-title> -->
    <b-link @click="showDetails" variant="outline-info" class="stretched-link">

      <h4 class="d-flex justify-content-between align-items-center">
        {{ a.title && a.title.length > 50 ? a.title.substring(0,50)+".." : a.title  }}
        <b-badge variant="primary" pill class="mr-3">{{a.price}} {{a.currency}}</b-badge>
      </h4>

    </b-link>

    <b-card-sub-title >
      <b-badge variant="primary" pill class="mr-3">{{a.category}}</b-badge>

    </b-card-sub-title>




    <b-card-text>
      {{ a.description && a.description.length > 60 ? a.description.substring(0,60)+".." : a.description  }}
    </b-card-text>
    <small> modified: {{a.date}}</small>

    <!-- <b-button @click="showDetails" class="stretched-link" variant="outline-info">More</b-button> -->
  </b-card-body>
</b-card>

<!-- <div>




<b-card
tag="article"
style="max-width: 20rem;"
class="mb-2"
button
>
<b-card-body @click="showDetails" href="#" variant="outline-info" class="stretched-link">
<b-card-title class="d-flex justify-content-between align-items-center">



</b-card-title>
<b-card-text>

</b-card-text>







</b-card-body>
</b-card>


</div> -->
</template>

<script>
import auth from 'solid-auth-client';
import FC from 'solid-file-client'
const fc = new FC( auth )

export default {
  name: "AnnonceCard",
  props: ['annonce'],
  data(){
    return {
      a: {}
    }
  },
  async created(){
    this.a = JSON.parse(await fc.readFile(this.annonce.url))
    this.a.image = this.a.images[0] || "" //"https://picsum.photos/400/200/?image=41"
    this.a.date = this.a.modified.pop() || this.a.created
  },
  methods: {
    showDetails() {
      //this.$router.push('/add')
      console.log(this.a.id)
      this.$router.push({ name: 'Detail', query: { url: this.a.url } })
    },
  }
}
</script>

<style>

</style>
