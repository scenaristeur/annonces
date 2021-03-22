<template>
  <div>
    <b-button @click="test">Test</b-button>

  </div>
</template>

<script>

import {/* handleIncomingRedirect, login,*/ fetch, getDefaultSession,/* onSessionRestore*/ } from '@inrupt/solid-client-authn-browser'
import { getSolidDataset,/* saveSolidDatasetAt */} from "@inrupt/solid-client";

export default {
  name: "SolidFetchTest",

  methods: {
    async test() {

      // 3. Make authenticated requests by passing `fetch` to the solid-client functions.
      // The user must have logged in as someone with the appropriate access to the specified URL.
let webId = await getDefaultSession().info.webId
      // For example, the user must be someone with Read access to the specified URL.
      const myDataset = await getSolidDataset(
      //  "https://docs-example.inrupt.net/profile/card", {
          webId, {
          fetch: fetch
        });
        console.log(myDataset)
        //
        // // ...
        //

        // let myChangedDataset = myDataset
        // // // For example, the user must be someone with Write access to the specified URL.
        // const savedSolidDataset = await saveSolidDatasetAt(
        //   "https://docs-example.inrupt.net/profile/card",
        //   myChangedDataset, {
        //     fetch: fetch
        //   });
        //
        //   console.log(savedSolidDataset)
        }
      }
    }
    </script>

    <style>

    </style>
