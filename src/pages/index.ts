import Vue from 'vue'

import ConfigPage from './ConfigPage.vue'
import ConfigKeysPage from './config/ConfigKeysPage.vue'
import ConfigRepoPage from './config/ConfigRepoPage.vue'
import ConfigUIPage from './config/ConfigUIPage.vue'
import KeysPage from './KeysPage.vue'
import PasswordsPage from './PasswordsPage.vue'
import RepoPage from './RepoPage.vue'

Vue.component('config-page', ConfigPage)
Vue.component('config-keys-page', ConfigKeysPage)
Vue.component('config-repo-page', ConfigRepoPage)
Vue.component('config-ui-page', ConfigUIPage)
Vue.component('keys-page', KeysPage)
Vue.component('passwords-page', PasswordsPage)
Vue.component('repo-page', RepoPage)
