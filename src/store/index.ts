import Vuex, { Store } from 'vuex'
import Vue from 'vue'

import { createPersistedState } from 'vuex-electron'
import { getModule } from 'vuex-module-decorators'
import ElectronStore from 'electron-store'
import { Dark } from 'quasar'
import { darkMode } from 'electron-util'

import UIVuexModule, { UIState } from './modules/ui'
import OperationsVuexModule, { OperationsState } from './modules/operations'
import PasswordsVuexModule, { PasswordsState } from './modules/passwords'
import RepoVuexModule, { RepoState } from './modules/repo'
import KeysVuexModule, { KeysState } from './modules/keys'
import ProblemsVuexModule, { ProblemsState } from './modules/problems'
import PreferencesVuexModule, { PreferencesState } from './modules/preferences'
import SettingsVuexModule, { SettingsState } from './modules/settings'
 
Vue.use(Vuex)

export interface AppState {
  ui: UIState,
  operations: OperationsState,
  passwords: PasswordsState,
  repo: RepoState,
  keys: KeysState,
  problems: ProblemsState,
  preferences: PreferencesState,
  settings: SettingsState
}

export const store = new Store<AppState>({
  modules: {
    ui: UIVuexModule,
    operations: OperationsVuexModule,
    passwords: PasswordsVuexModule,
    repo: RepoVuexModule,
    keys: KeysVuexModule,
    problems: ProblemsVuexModule,
    preferences: PreferencesVuexModule,
    settings: SettingsVuexModule,
  },
  plugins: [
    createPersistedState({
      whitelist: mutation => (
        mutation.type.indexOf('preferences/') === 0 ||
        mutation.type.indexOf('settings/') === 0
      ),
      storage: new ElectronStore<{state: AppState}>({
        name: 'store',
        serialize: (value) => {
          if (value && value.state) {
            return JSON.stringify({
              state: {
                preferences: value.state.preferences,
                settings: value.state.settings
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
export const OperationsModule = getModule(OperationsVuexModule, store)
export const RepoModule = getModule(RepoVuexModule, store)
export const PasswordsModule = getModule(PasswordsVuexModule, store)
export const KeysModule = getModule(KeysVuexModule, store);
export const ProblemsModule = getModule(ProblemsVuexModule, store);
export const PreferencesModule = getModule(PreferencesVuexModule, store);
export const SettingsModule = getModule(SettingsVuexModule, store);

if (process.env.NODE_ENV === 'development') {
  store.subscribe((mutation: any) => {
    console.log('mutation', mutation)
  })
  store.subscribeAction((action: any) => {
    console.log('action', action)
  })
}

darkMode.onChange(() => {
  UIModule.setSystemDarkMode(darkMode.isEnabled)
});

store.subscribeAction({
  before (action: any) {
    OperationsModule.addRunningOperation(action)
  },
  after(action: any) {
    OperationsModule.removeRunningOperation(action)
  }
})

store.watch(
  (state, getters) => getters['ui/darkMode'] as boolean,
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
  state => state.settings.gpgPath,
  repoPath => repoPath && KeysModule.loadPrivateKeys(),
  { deep: false, immediate: true }
)

store.watch(
  state => state.settings.gpgPath,
  repoPath => repoPath && KeysModule.loadPublicKeys(),
  { deep: false, immediate: true }
)

store.watch(
  state => state.settings.repoPath,
  repoPath => {
    UIModule.selectPasswordPath(null)
    if (repoPath) {
      PasswordsModule.loadPasswordsFromFileSystem()
    }
  },
  { deep: false, immediate: true }
)

