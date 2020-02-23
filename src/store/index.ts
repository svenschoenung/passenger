import Vuex from 'vuex'
import Vue from 'vue'
import { createPersistedState, createSharedMutations } from 'vuex-electron'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
      count: 24
    },
    mutations: {
      increment (state) {
        state.count++
      }
    },
    actions: {
      INCREMENT: ({commit}) => {
        commit('increment')
      }
    },
    plugins: [createPersistedState(), createSharedMutations()]
})