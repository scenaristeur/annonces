// let ldflex = window.solid
import { /*handleIncomingRedirect,*/ login, fetch, getDefaultSession,/* onSessionRestore*/ } from '@inrupt/solid-client-authn-browser'

import { WS } from "@inrupt/vocab-solid-common";
import { FOAF, SCHEMA_INRUPT_EXT, VCARD } from "@inrupt/vocab-common-rdf";

import {
  getSolidDataset,
  getThing,
  getStringNoLocale,
  getUrl,
  getUrlAll,
  /* saveSolidDatasetAt */
} from "@inrupt/solid-client";



const state = () => ({
  webId: null,
  storage: null
})

// getters
const getters = {}

// actions
const actions = {
  async login(context, issuer){
    console.log(context, issuer)
    if (!getDefaultSession().info.isLoggedIn) {
      // The `login()` redirects the user to their identity provider;
      // i.e., moves the user away from the current page.
      await login({
        // Specify the URL of the user's Solid Identity Provider; e.g., "https://inrupt.net"
        oidcIssuer: issuer,
        // Specify the URL the Solid Identity Provider should redirect to after the user logs in,
        // e.g., the current page for a single-page app.
        redirectUrl: window.location.href,
        restorePreviousSession: true
      });
    }
  },
  async logout(context){
    console.log(context)
    await getDefaultSession().logout()
    context.commit('setWebId', null)

  },
  async webId(context, webId){
    context.commit('setWebId',webId)
    if (webId != null){

      //  let webId = await getDefaultSession().info.webId
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
        let storage = getUrl(profile, WS.storage);
        console.log("storage", storage)

        context.commit('setStorage', storage)

      }else{
        context.commit('setStorage', null)
      }
      //   if (webId != null){
      //     let storage = `${await ldflex.data[webId].storage}`
      //     context.commit('setStorage', storage)
      //   //  console.log("rootstate",context.rootState.ldp_store)
      // //    context.commit('ldp_store/setServer', {name: webId+' storage', url: storage}, { root: true })
      //   //  context.rootState.ldp_store.commit('setServer', {name: webId+' storage', url: storage})
      //   }else{
      //     context.commit('setStorage', null)
      //   //  context.commit('ldp_store/setServer', {name: 'Localhost', url: 'http://localhost:3000'}, { root: true })
      //
      //   }
      //   let groups = []
      //   console.log("TODO: remplacer par solid-client-js peut-il eviter les nombreux appels ?")
      //   for await (const group of ldflex.data[webId]['http://www.w3.org/ns/org#memberOf']){
      //     //  console.log(`${group}`)
      //     let g = {url:`${group}`, name: await ldflex.data[`${group}`].vcard$fn}
      //     groups.push(g)
      //     context.commit('setGroups',groups)
      //   }
      //
      // }
    }
  }

  // mutations
  const mutations = {
    setWebId(state, webId){
      console.log(webId)
      state.webId = webId
    },
    setStorage(state, storage){
      console.log(storage)
      state.storage = storage
    },

  }

  export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
  }
