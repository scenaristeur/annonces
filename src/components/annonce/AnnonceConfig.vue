<template>
  <div>
    <h3>Config.</h3>
    <p>Here you can change to your prefered Agora POD. A agora POD is used to agglomerate annonces.<br>
      You must be able to write to this agora POD, and people you want to share your annonce must be able to read this uri.<br>
    </p>
    <p>

      <b-input-group class="mt-3">
        <b-input v-model="temp_url" />
        <b-input-group-append>
          <b-button variant="outline-success" @click="tempUrlChanged">Change Agora</b-button>
        </b-input-group-append>
      </b-input-group>

      <b-button @click="reset">Reset to <b>default Agora POD</b></b-button>

    </p>

  </div>
</template>

<script>
// FUTUR WORK : save a list of prefered Agoras on users POD
export default {
  name: "AnnonceConfig",
  data(){
    return {
  //  temp_url: ""
    }
  },
  methods: {
    reset() {
      this.temp_url = this.$store.state.annonce.defaultAgoraPod
    },
      async  tempUrlChanged() {
        this.agora_url = this.temp_url
    },
  },
  // watch:{
  //   agora_url(){
  //     //  console.log(this.agora_url)
  //     this.temp_url = this.agora_url
  //   }
  // },

  computed:{
    temp_url: {
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

<style>

</style>
