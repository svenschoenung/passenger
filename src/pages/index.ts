import Vue from 'vue'

import SettingsPage from './SettingsPage.vue'
import SettingsKeysPage from './settings/SettingsKeysPage.vue'
import SettingsRepoPage from './settings/SettingsRepoPage.vue'
import SettingsSecurityPage from './settings/SettingsSecurityPage.vue'
import SettingsUIPage from './settings/SettingsUIPage.vue'
import ProblemsPage from './ProblemsPage.vue'
import KeysPage from './KeysPage.vue'
import PasswordsPage from './PasswordsPage.vue'
import RepoPage from './RepoPage.vue'

Vue.component('settings-page', SettingsPage)
Vue.component('settings-keys-page', SettingsKeysPage)
Vue.component('settings-security-page', SettingsSecurityPage)
Vue.component('settings-repo-page', SettingsRepoPage)
Vue.component('settings-ui-page', SettingsUIPage)
Vue.component('problems-page', ProblemsPage)
Vue.component('keys-page', KeysPage)
Vue.component('passwords-page', PasswordsPage)
Vue.component('repo-page', RepoPage)
