import Vuex from 'vuex'
import Vue from 'vue'

import { createPersistedState, createSharedMutations } from 'vuex-electron'
import { getModule } from 'vuex-module-decorators'
import ElectronStore from 'electron-store'
import update from 'immutability-helper';

import UIVuexModule from './ui'

Vue.use(Vuex)

export const store = new Vuex.Store({
  modules: {
    ui: UIVuexModule
  },
  plugins: [
    createPersistedState({
      blacklist: ['changePage'],
      store: new ElectronStore({
        serialize: (state) => {
          const filteredState = update(state, {
            ui: { $unset: ['page'] }
          })
          return JSON.stringify(filteredState, null, '\t');
        }
      })
    }),
    createSharedMutations()
  ]
})

export const UIModule = getModule(UIVuexModule, store)




