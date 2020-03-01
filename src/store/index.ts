import Vuex, { Store } from 'vuex'
import Vue from 'vue'

import { createPersistedState, createSharedMutations } from 'vuex-electron'
import { getModule } from 'vuex-module-decorators'
import ElectronStore from 'electron-store'

import UIVuexModule from './modules/ui'
import RepoVuexModule from './modules/repo'
import PasswordsVuexModule from './modules/passwords'
import ConfigVuexModule from './modules/config'

Vue.use(Vuex)

export interface AppState {
  ui: UIVuexModule,
  passwords: PasswordsVuexModule,
  repo: RepoVuexModule,
  config: ConfigVuexModule
}

export const store = new Store<AppState>({
  modules: {
    ui: UIVuexModule,
    passwords: PasswordsVuexModule,
    repo: RepoVuexModule,
    config: ConfigVuexModule,
  },
  plugins: [
    createPersistedState({
      whitelist: ['setup', 'changeRepoPath'],
      storage: new ElectronStore<{state: AppState}>({
        name: 'store',
        serialize: (value) => {
          if (value && value.state && value.state.config) {
            return JSON.stringify({
              state: {
                config: value.state.config
              }
            }, null, '\t')
          }
          return '{}'
        }
      })
    })
  ]
})

export const UIModule = getModule(UIVuexModule, store)
export const RepoModule = getModule(RepoVuexModule, store)
export const PasswordsModule = getModule(PasswordsVuexModule, store)
export const ConfigModule = getModule(ConfigVuexModule, store);