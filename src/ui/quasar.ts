import Vue from 'vue'

import '@/styles/style.scss'
import {
  Quasar, QIcon, QChip, QList, QItem, QToolbar, QToolbarTitle, QMenu,
  QSplitter, QTree, QScrollArea, QLayout, QBtn, QInput, QBreadcrumbs, QBreadcrumbsEl,
  QDrawer, QFooter, QPageContainer, QAvatar, QDialog, QHeader, QItemSection, 
  QItemLabel, QToggle, QTooltip, QSpace, QCircularProgress, QForm, QSeparator, 
  Ripple
} from 'quasar'
import iconSet from 'quasar/icon-set/ionicons-v4'

Vue.use(Quasar, {
  config: {},
  components: {
    QIcon, QChip, QList, QItem, QToolbar, QToolbarTitle, QMenu, 
    QSplitter, QTree, QScrollArea, QLayout, QBtn, QInput, QBreadcrumbs, QBreadcrumbsEl,
    QDrawer, QFooter, QPageContainer, QAvatar, QDialog, QHeader, QItemSection, 
    QItemLabel, QToggle, QTooltip, QSpace, QCircularProgress, QForm, QSeparator
  },
  directives: { Ripple },
  plugins: { },
  iconSet
})