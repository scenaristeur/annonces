<template>
  <div>
    <div v-if='webId != null'>
      <small>logged as {{ webId }}</small>
    </div>
  </div>
</template>

<script>

import { handleIncomingRedirect, /*login, fetch, getDefaultSession,*/ onSessionRestore } from '@inrupt/solid-client-authn-browser'

export default {
  name: "SolidSession",
  data() {
    return {
      //  webId: null
    }
  },
  async created(){
    await  handleIncomingRedirect({
      restorePreviousSession: true
    }).then((info) => {
      console.log(`Logged in with WebID [${info.webId}]`)
      this.webId = info.webId

    })
    onSessionRestore((url) => {
      console.log(url)
    });
    //this.checkSession()
  },
  computed:{
    webId: {
      get () { return this.$store.state.solid.webId},
      set (webId) { this.$store.dispatch('solid/webId', webId) }
    }
  },
}
</script>

<style>

</style>
