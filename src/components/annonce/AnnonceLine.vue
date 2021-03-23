<template>
  <!-- <div> -->

    <b-card
    tag="article"
    style="max-width: 20rem;"
    class="mb-2"
    button
    >
  <b-button href="#" variant="outline-info">
    <b-card-title class="d-flex justify-content-between align-items-center">


      <span>{{a.title}}</span>
      <b-badge variant="primary" pill class="mr-3">{{a.category}}</b-badge>
      <b-card-text>
        {{a.price}} {{a.currency}}

      </b-card-text>


    </b-card-title>
    <b-card-img :src="a.image" alt="Image" top></b-card-img>
    </b-button>
    <b-card-text>
      {{ a.description }}
    </b-card-text>

    <!-- {{ a.images }} -->



    <small> modified: {{a.date}}</small>
  </b-card>


<!-- <b-button variant="outline-info"> -->
<!-- </b-button>
{{ a}}
</div> -->
</template>

<script>
import auth from 'solid-auth-client';
import FC from 'solid-file-client'
const fc = new FC( auth )

export default {
  name: "AnnonceLine",
  props: ['annonce'],
  data(){
    return {
      a: {}
    }
  },
  async created(){
    this.a = JSON.parse(await fc.readFile(this.annonce.url))
    this.a.image = this.a.images[0] || "https://picsum.photos/400/200/?image=41"
    this.a.date = this.a.modified.pop() || this.a.created
  }
}
</script>

<style>

</style>
