import Vue from 'vue'
import FolderBreadcrumbs from './FolderBreadcrumbs.vue'
import FolderPicker from './FolderPicker.vue'
import KeyList from './KeyList.vue'
import MenuBar from './MenuBar.vue'
import PasswordFolderDetails from './PasswordFolderDetails.vue'
import PasswordTree from './PasswordTree.vue'
import SetupDialog from './SetupDialog.vue'

Vue.component('folder-picker', FolderPicker)
Vue.component('folder-breadcrumbs', FolderBreadcrumbs)
Vue.component('key-list', KeyList)
Vue.component('menu-bar', MenuBar)
Vue.component('password-folder-details', PasswordFolderDetails)
Vue.component('password-tree', PasswordTree)
Vue.component('setup-dialog', SetupDialog)
