import Vuex from 'vuex'
import Vue from 'vue'

import { createPersistedState, createSharedMutations } from 'vuex-electron'
import { getModule } from 'vuex-module-decorators'
import ElectronStore from 'electron-store'
import update from 'immutability-helper';

import UIVuexModule from './modules/ui'
import RepoVuexModule from './modules/repo'
import PasswordsVuexModule from './modules/passwords'

Vue.use(Vuex)

export interface AppState {
  ui: UIVuexModule,
  passwords: PasswordsVuexModule,
  repo: RepoVuexModule
}

export const store = new Vuex.Store<AppState>({
  modules: {
    ui: UIVuexModule,
    passwords: PasswordsVuexModule,
    repo: RepoVuexModule,
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
export const RepoModule = getModule(RepoVuexModule, store)
export const PasswordsModule = getModule(PasswordsVuexModule, store)




