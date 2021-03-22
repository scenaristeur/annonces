<template>
  <div>
    <b-button @click="test">Test</b-button>
    see https://docs.inrupt.com/developer-tools/javascript/client-libraries/tutorial/read-write-data/
  </div>
</template>

<script>

import {/* handleIncomingRedirect, login,*/ fetch, getDefaultSession,/* onSessionRestore*/ } from '@inrupt/solid-client-authn-browser'

//import { SPACE } from "@inrupt/vocab-solid-common";
import { FOAF, SCHEMA_INRUPT_EXT, VCARD } from "@inrupt/vocab-common-rdf";

import {
  getSolidDataset,
  getThing,
  getStringNoLocale,
  getUrl,
  getUrlAll,
  /* saveSolidDatasetAt */
} from "@inrupt/solid-client";

export default {
  name: "SolidFetchTest",

  methods: {
    async test() {

      // 3. Make authenticated requests by passing `fetch` to the solid-client functions.
      // The user must have logged in as someone with the appropriate access to the specified URL.
      let webId = await getDefaultSession().info.webId
      // For example, the user must be someone with Read access to the specified URL.
      const userDataset = await getSolidDataset(
        //  "https://docs-example.inrupt.net/profile/card", {
        webId, {
          fetch: fetch
        });
        console.log(userDataset)

        const profile = getThing(
          userDataset,
          webId
        );

        const lastName = getStringNoLocale(profile, SCHEMA_INRUPT_EXT.familyName);
        const fname = getStringNoLocale(profile, FOAF.firstName);
        const role = getStringNoLocale(profile, VCARD.role);

        console.log(lastName, fname, role)

        // 3. Retrieve specific data from the retrieved thing; i.e. profile.

        // 3a. Get a single string data value from the profile.
        // Specifically, the operation returns the profile's VCARD.fn
        // (i.e., "http://www.w3.org/2006/vcard/ns#fn") value as a string.

        const fn = getStringNoLocale(profile, VCARD.fn);

        // 3b. Get multiple URL data from the profile.
        // Specifically , the operation returns the profile's FOAF.knows
        // (i.e., "http://xmlns.com/foaf/0.1/knows") values as an array of URLs.
        // The URLs point to the Things representing Persons.

        const acquaintances = getUrlAll(profile, FOAF.knows);

        console.log(fn, acquaintances)

      //  console.log("SPACE",SPACE)
        let storage = getUrl(profile, "http://www.w3.org/ns/pim/space#storage");
        console.log("storage", storage)
        //
        // // ...
        //

        // let myChangedDataset = userDataset
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
