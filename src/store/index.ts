import Vuex, { Store } from 'vuex'
import Vue from 'vue'

import { createPersistedState } from 'vuex-electron'
import { getModule } from 'vuex-module-decorators'
import ElectronStore from 'electron-store'

import UIVuexModule, { UIState } from './modules/ui'
import RepoVuexModule, { RepoState } from './modules/repo'
import PasswordsVuexModule, { PasswordsState } from './modules/passwords'
import KeysVuexModule, { KeysState } from './modules/keys'
import ConfigVuexModule, { ConfigState } from './modules/config'
import { Dark } from 'quasar'

Vue.use(Vuex)

export interface AppState {
  ui: UIState,
  passwords: PasswordsState,
  repo: RepoState,
  keys: KeysState,
  config: ConfigState
}

export const store = new Store<AppState>({
  modules: {
    ui: UIVuexModule,
    passwords: PasswordsVuexModule,
    repo: RepoVuexModule,
    keys: KeysVuexModule,
    config: ConfigVuexModule,
  },
  plugins: [
    createPersistedState({
      whitelist: mutation => (
        mutation.type.indexOf('ui/') === 0 ||
        mutation.type.indexOf('config/') === 0
      ),
      storage: new ElectronStore<{state: AppState}>({
        name: 'store',
        serialize: (value) => {
          if (value && value.state && value.state.config) {
            return JSON.stringify({
              state: {
                ui: value.state.ui,
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
export const KeysModule = getModule(KeysVuexModule, store);
export const ConfigModule = getModule(ConfigVuexModule, store);

if (process.env.NODE_ENV === 'development') {
  store.subscribe((mutation: any) => {
    console.log('mutation', mutation)
  })
  store.subscribeAction((action: any) => {
    console.log('action', action)
  })
}

store.watch(
  state => state.config.darkMode,
  darkMode => Dark.set(darkMode),
  { deep: false, immediate: true }
)

store.watch(
  state => state.passwords.tree,
  (tree) => {
    if (tree.value && KeysModule.privateKeys.value) {
      PasswordsModule.annotatePasswordsUsingPrivateKeys();
    }
    if (tree.value && KeysModule.publicKeys.value) {
      PasswordsModule.annotatePasswordsUsingPublicKeys();
    }
  },
  { deep: false, immediate: false }
)

store.watch(
  state => state.keys.privateKeys,
  privateKeys => {
    if (PasswordsModule.tree.value && privateKeys.value) {
      PasswordsModule.annotatePasswordsUsingPrivateKeys();
    }
  },
  { deep: true, immediate: false }
)

store.watch(
  state => state.keys.publicKeys,
  publicKeys => {
    if (PasswordsModule.tree.value && publicKeys.value) {
      PasswordsModule.annotatePasswordsUsingPublicKeys();
    }
  },
  { deep: true, immediate: false }
)

store.watch(
  state => state.config.gpgPath,
  repoPath => repoPath && KeysModule.loadPrivateKeys(),
  { deep: false, immediate: true }
)

store.watch(
  state => state.config.gpgPath,
  repoPath => repoPath && KeysModule.loadPublicKeys(),
  { deep: false, immediate: true }
)

store.watch(
  state => state.config.repoPath,
  repoPath => repoPath && PasswordsModule.loadPasswordsFromFileSystem(),
  { deep: false, immediate: true }
)

