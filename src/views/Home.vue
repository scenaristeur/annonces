<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png"> -->

    <AnnonceAgora />



    <!-- <Upload /> -->
    <HelloWorld msg="Welcome to Vue2/Solid Boilerplate based on Solid Specifications"/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Home',
  components: {
    HelloWorld,

    'AnnonceAgora': () => import('@/components/annonce/AnnonceAgora'),
    //  'Upload': () => import('@/components/portfolio/Upload'),
  },
}
</script>
