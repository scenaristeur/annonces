<template>
  <div>
    <b-dropdown variant="success" v-if="webId == null" text="Login">
      <b-dropdown-item v-for="issuer in issuers" :key="issuer" @click="login" :issuer="issuer">{{ issuer }}</b-dropdown-item>
    </b-dropdown>
    <b-button variant="danger" v-else @click="logout">Logout</b-button>
  </div>
</template>

<script>

export default {
  name: 'SolidLoginButton',
  data() {
    return {
      issuers: [
        "https://inrupt.net",
        "https://broker.pod.inrupt.com",
        "https://solidcommunity.net",
      ]
    }
  },
  computed:{
    webId() {
      return this.$store.state.solid.webId
    }
  },
  methods: {
    async login(e) {
      console.log(e.target.getAttribute('issuer'))
      console.log(e,e.target, e.target.value)

      this.$store.dispatch('solid/login', e.target.getAttribute('issuer'))
    },
    async logout(){
      this.$store.dispatch('solid/logout')
    },
  }
}
</script>
