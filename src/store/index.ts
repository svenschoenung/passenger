import Vuex from 'vuex'
import Vue from 'vue'

import { createPersistedState, createSharedMutations } from 'vuex-electron'
import { getModule } from 'vuex-module-decorators'

import UIVuexModule from './ui'

Vue.use(Vuex)

export const store = new Vuex.Store({
  modules: {
    ui: UIVuexModule
  },
  plugins: [createPersistedState(), createSharedMutations()]
})

export const UIModule = getModule(UIVuexModule, store)




