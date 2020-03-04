import Vue from 'vue'
import Vuex from 'vuex'
import { store } from './store'
import App from './App.vue'
import './quasar'
import VueRovingTabindex from "@4rk/vue-roving-tabindex";

Vue.config.productionTip = false
 
Vue.use(VueRovingTabindex);

new Vue({
  store,
  render: h => h(App),
}).$mount('#app')

