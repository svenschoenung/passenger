import Vue from 'vue'

import './styles/quasar.scss'
import { Quasar } from 'quasar'
import iconSet from 'quasar/icon-set/ionicons-v4'

Vue.use(Quasar, {
  config: {},
  components: { /* not needed if importStrategy is not 'manual' */ },
  directives: { /* not needed if importStrategy is not 'manual' */ },
  plugins: { },
  iconSet
})