<template>
  <div>
    {{ webId }}
    <b-button variant="success" v-if="webId == null" @click="login">Login</b-button>
    <b-button variant="danger" v-else @click="logout">Logout</b-button>
  </div>
</template>

<script>
import { handleIncomingRedirect, login, fetch, getDefaultSession, onSessionRestore } from '@inrupt/solid-client-authn-browser'
import { getSolidDataset, saveSolidDatasetAt } from "@inrupt/solid-client";

export default {
  name: 'SolidLoginButton',
  data: function () {
    return {
      webId: null
    }
  },
  async mounted(){
    await this.checkSession()
    onSessionRestore((url) => {
      console.log(url)
    });
  },
  methods: {
    async checkSession(){
      // 1. Call the handleIncomingRedirect() function to complete the authentication process.
      //   If the page is being loaded after the redirect from the Solid Identity Provider
      //      (i.e., part of the authentication flow), the user's credentials are stored in-memory, and
      //      the login process is complete. That is, a session is logged in
      //      only after it handles the incoming redirect from the Solid Identity Provider.
      //   If the page is not being loaded after a redirect from the Solid Identity Provider,
      //      nothing happens.
      await  handleIncomingRedirect({
        restorePreviousSession: true
      }).then((info) => {
        console.log(`Logged in with WebID [${info.webId}]`)
        this.webId = info.webId
      })
    },
    async loginAndFetch() {

      // 2. Start the Login Process if not already logged in.
      if (!getDefaultSession().info.isLoggedIn) {
        // The `login()` redirects the user to their identity provider;
        // i.e., moves the user away from the current page.
        await login({
          // Specify the URL of the user's Solid Identity Provider; e.g., "https://inrupt.net"
          oidcIssuer: "https://inrupt.net",
          // Specify the URL the Solid Identity Provider should redirect to after the user logs in,
          // e.g., the current page for a single-page app.
          redirectUrl: window.location.href,
          restorePreviousSession: true
        });
      }

      // 3. Make authenticated requests by passing `fetch` to the solid-client functions.
      // The user must have logged in as someone with the appropriate access to the specified URL.

      // For example, the user must be someone with Read access to the specified URL.
      const myDataset = await getSolidDataset(
        "https://docs-example.inrupt.net/profile/card", {
          fetch: fetch
        });
        console.log(myDataset)
        //
        // // ...
        //

        let myChangedDataset = myDataset
        // // For example, the user must be someone with Write access to the specified URL.
        const savedSolidDataset = await saveSolidDatasetAt(
          "https://docs-example.inrupt.net/profile/card",
          myChangedDataset, {
            fetch: fetch
          });

          console.log(savedSolidDataset)
        },

        async login() {
          this.loginAndFetch();
          // let session = await auth.currentSession();
          // let popupUri = 'https://solidcommunity.net/common/popup.html';
          // if (!session){
          //   session = await auth.popupLogin({ popupUri });
          // }
          // this.webId = session.webId
        },
        async logout(){
          await getDefaultSession().logout()
          await this.checkSession()

          // await  auth.logout()
          // this.webId = null
        },
      }
    }
    </script>
