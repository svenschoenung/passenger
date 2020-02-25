import Vuex from 'vuex'
import Vue from 'vue'
import { createPersistedState, createSharedMutations } from 'vuex-electron'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    page: 'passwords'
  },
  mutations: {
    changePage(state, payload: string) {
      state.page = payload
    }
  },
  actions: {
    CHANGE_PAGE({commit}, payload: string) {
      commit('changePage', payload)
    }
  },
  plugins: [createPersistedState(), createSharedMutations()]
})