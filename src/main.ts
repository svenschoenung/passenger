import Vue from 'vue'
import VueRovingTabindex from "@4rk/vue-roving-tabindex";

import App from './App.vue'
import { store } from '@/store'
import '@/ui/quasar'
import '@/components'
import '@/pages'

Vue.config.productionTip = false
 
Vue.use(VueRovingTabindex);

new Vue({
  store,
  render: h => h(App),
}).$mount('#app')

