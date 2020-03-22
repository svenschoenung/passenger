import Vue from 'vue'
import VueRovingTabindex from "@4rk/vue-roving-tabindex";
import VueVirtualScroller from 'vue-virtual-scroller'

import '@/styles/style.scss'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'

import '@/ui/quasar'
import '@/errors'
import '@/components'
import '@/pages'
import App from './App.vue'
import { store } from '@/store'
import { showErrorNotification } from '@/errors';

Vue.config.productionTip = false
Vue.config.errorHandler = (err, vm, info) => {
  showErrorNotification(err)
};

Vue.use(VueRovingTabindex);
Vue.use(VueVirtualScroller)

new Vue({
  store,
  render: h => h(App),
}).$mount('#app')

