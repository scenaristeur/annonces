<template>
  <div>
    <b-button variant="success" v-if="webId == null" @click="login">Login</b-button>
    <b-button variant="danger" v-else @click="logout">Logout</b-button>
  </div>
</template>

<script>

export default {
  name: 'SolidLoginButton',
  computed:{
    webId() {
      return this.$store.state.solid.webId
    }
  },
  methods: {
    async login() {
      this.$store.dispatch('solid/login')
    },
    async logout(){
      this.$store.dispatch('solid/logout')
    },
  }
}
</script>
