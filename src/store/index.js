import Vue from 'vue'
import Vuex from 'vuex'
import solid from './modules/solid'
import annonce from './modules/annonce'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: { solid, annonce
  }
})
