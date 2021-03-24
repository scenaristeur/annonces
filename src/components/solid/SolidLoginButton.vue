<template>
  <span>
    <b-button variant="success" v-if="webId == null" @click="login" size="sm">Login</b-button>
    <b-button variant="danger" v-else @click="logout" size="sm">Logout</b-button>
  </span>
</template>

<script>
import auth from 'solid-auth-client';

export default {
  name: 'SolidLoginButton',
  data: function () {
    return {
    //  webId: null
    }
  },
  computed:{
    webId: {
      get () { return this.$store.state.solid.webId},
      set (webId) { this.$store.dispatch('solid/setWebId', webId) }
    }
  },
  methods: {
    async login() {
      let session = await auth.currentSession();
      let popupUri = 'https://solidcommunity.net/common/popup.html';
      if (!session){
        session = await auth.popupLogin({ popupUri });
      }
      this.webId = session.webId
    },
    async logout(){
      await  auth.logout()
      this.webId = null
    },
  }
}
</script>
