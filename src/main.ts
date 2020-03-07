import Vue from 'vue'
import App from './App.vue'
import { store } from './store'
import './ui/quasar'
import VueRovingTabindex from "@4rk/vue-roving-tabindex";

Vue.config.productionTip = false
 
Vue.use(VueRovingTabindex);

new Vue({
  store,
  render: h => h(App),
}).$mount('#app')

