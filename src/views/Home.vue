<template>
  <div class="home">
    <AnnonceAgora />
  </div>
</template>
<script>

export default {
  name: 'Home',
  components: {
    'AnnonceAgora': () => import('@/components/annonce/AnnonceAgora'),
  },
}
</script>
