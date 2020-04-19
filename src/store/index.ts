import { PasswordFolder } from './../model/passwords';
import { Resolvable } from './resolvable';
import Vuex, { Store } from 'vuex'
import Vue from 'vue'

import { createPersistedState } from 'vuex-electron'
import { getModule } from 'vuex-module-decorators'
import ElectronStore from 'electron-store'
import { Dark } from 'quasar'

import UIVuexModule, { UIState } from './modules/ui'
import OperationsVuexModule, { OperationsState } from './modules/operations'
import PasswordsVuexModule, { PasswordsState } from './modules/passwords'
import AnnotationsVuexModule, { AnnotationsState } from './modules/annotations'
import RepoVuexModule, { RepoState } from './modules/repo'
import KeysVuexModule, { KeysState } from './modules/keys'
import ProblemsVuexModule, { ProblemsState } from './modules/problems'
import PreferencesVuexModule, { PreferencesState } from './modules/preferences'
import SettingsVuexModule, { SettingsState, ValidationSettings } from './modules/settings'
import { PublicKey } from 'gpg-promised';
import { initTriggers, getModuleWithTriggers } from './trigger';
 
Vue.use(Vuex)

export interface AppState {
  ui: UIState,
  operations: OperationsState,
  passwords: PasswordsState,
  annotations: AnnotationsState,
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
    annotations: AnnotationsVuexModule,
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

export const UIModule = getModuleWithTriggers(UIVuexModule, store)
export const OperationsModule = getModuleWithTriggers(OperationsVuexModule, store)
export const RepoModule = getModuleWithTriggers(RepoVuexModule, store)
export const PasswordsModule = getModuleWithTriggers(PasswordsVuexModule, store)
export const AnnotationsModule = getModuleWithTriggers(AnnotationsVuexModule, store)
export const KeysModule = getModuleWithTriggers(KeysVuexModule, store);
export const ProblemsModule = getModuleWithTriggers(ProblemsVuexModule, store);
export const PreferencesModule = getModuleWithTriggers(PreferencesVuexModule, store);
export const SettingsModule = getModuleWithTriggers(SettingsVuexModule, store);

if (process.env.NODE_ENV === 'development') {
  store.subscribe((mutation: any) => {
    console.log('mutation', mutation)
  })
  store.subscribeAction((action: any) => {
    console.log('action', action)
  })
}

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
  { immediate: true }
)

/*
store.watch(
  state => 
    state.settings.validation.encryptedWithUnknownKeys.enable ||
    state.settings.validation.encryptedWithUnexpectedKeys.enable ||
    state.settings.validation.encryptedWithoutExpectedKeys.enable,
  (needsUsedKeys, oldNeedsUsedKeys) => {
    if (PasswordsModule.tree.value && needsUsedKeys && !oldNeedsUsedKeys) {
      setTimeout(() => AnnotationsModule.annotateFilesWithUsedKeys(), 100)
    }
  },
  { deep: true, immediate: false }
)
*/

/*
store.watch(
  state => state.passwords.tree,
  tree => {
    const needsUsedKeys =
      SettingsModule.validation.encryptedWithUnknownKeys.enable ||
      SettingsModule.validation.encryptedWithUnexpectedKeys.enable ||
      SettingsModule.validation.encryptedWithoutExpectedKeys.enable;
    if (tree.value && needsUsedKeys) {
      Vue.nextTick(() => AnnotationsModule.annotateFilesWithUsedKeys())
    }
  },
  { deep: true, immediate: false }
)
*/

/*
store.watch(
  state => state.passwords.tree,
  (tree) => {
    if (tree.value) {
      Vue.nextTick(() => AnnotationsModule.annotateFilesAndFoldersWithExpectedKeys())
    }
  },
  { deep: true, immediate: false }
)

store.watch(
  state => [state.passwords.tree, state.keys.privateKeys],
  ([tree, privateKeys]) => {
    if (tree.value && privateKeys.value) {
      Vue.nextTick(() => AnnotationsModule.annotateFilesAndFoldersThatAreDecryptable())
    }
  },
  { deep: true, immediate: false }
)

store.watch(
  state => [
    state.passwords.tree, 
    state.keys.publicKeys, 
    state.settings.validation.toBeEncryptedWithUnknownKeys.enable
  ] as [Resolvable<PasswordFolder>, Resolvable<PublicKey[]>, boolean],
  ([tree, publicKeys, toBeEncryptedWithUnknownKeys]) => {
    if (tree.value && publicKeys.value && toBeEncryptedWithUnknownKeys) {
      Vue.nextTick(() => AnnotationsModule.annotateFilesAndFoldersToBeEncryptedWithUnknownKeys());
    }
  },
  { deep: true, immediate: false }
)

store.watch(
  state => [
    state.passwords.tree.value,
    state.keys.publicKeys.value,
    state.annotations.usedKeys.value,
    state.settings.validation.encryptedWithUnknownKeys.enable
  ],
  ([tree, publicKeys, usedKeys, encryptedWithUnknownKeys]) => {
    if (tree && publicKeys && usedKeys && encryptedWithUnknownKeys) {
      Vue.nextTick(() => AnnotationsModule.annotateFilesEncryptedWithUnknownKeys());
    }
  },
  { deep: true, immediate: false }
)

store.watch(
  state => [
    state.passwords.tree.value,
    state.keys.publicKeys.value,
    state.annotations.usedKeys.value,
    state.settings.validation.encryptedWithUnexpectedKeys.enable
  ],
  ([tree, publicKeys, usedKeys, encryptedWithUnexpectedKeys]) => {
    if (tree && publicKeys && usedKeys && encryptedWithUnexpectedKeys) {
      Vue.nextTick(() => AnnotationsModule.annotateFilesEncryptedWithUnexpectedKeys())
    }
  },
  { deep: true, immediate: false }
)

store.watch(
  state => [
    state.passwords.tree.value,
    state.keys.publicKeys.value,
    state.annotations.usedKeys.value,
    state.settings.validation.encryptedWithoutExpectedKeys.enable
  ],
  ([tree, publicKeys, usedKeys, encryptedWithoutExpectedKeys]) => {
    if (tree && publicKeys && usedKeys && encryptedWithoutExpectedKeys) {
      Vue.nextTick(() => AnnotationsModule.annotateFilesEncryptedWithoutExpectedKeys())
    }
  },
  { deep: true, immediate: false }
)

store.watch(
  state => state.settings.gpgPath,
  gpgPath => {
    if (gpgPath) {
      KeysModule.loadPrivateKeys()
      KeysModule.loadPublicKeys()
    }
  },
  { immediate: true }
)
*/

store.watch(
  state => state.settings.repoPath,
  repoPath => {
    UIModule.selectPasswordPath(null)
    UIModule.clearExpandedFolders()
    if (repoPath) {
      PasswordsModule.loadPasswordsFromFileSystem()
      RepoModule.loadCommitsFromRepo()
    }
  },
  { immediate: true }
)

initTriggers(store)