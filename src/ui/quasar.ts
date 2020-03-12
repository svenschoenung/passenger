import Vue from 'vue'

import '@/styles/style.scss'
import {
  Quasar, QIcon, QChip, QList, QItem, QToolbar, QToolbarTitle, QMenu, QCheckbox, QBadge,
  QSplitter, QTree, QScrollArea, QLayout, QBtn, QInput, QBreadcrumbs, QBreadcrumbsEl,
  QDrawer, QFooter, QPageContainer, QAvatar, QDialog, QHeader, QItemSection, QRadio,
  QItemLabel, QToggle, QTooltip, QSpace, QCircularProgress, QForm, QSeparator, QVirtualScroll,
  Ripple, ClosePopup
} from 'quasar'
import iconSet from 'quasar/icon-set/ionicons-v4'

Vue.use(Quasar, {
  config: {},
  components: {
    QIcon, QChip, QList, QItem, QToolbar, QToolbarTitle, QMenu, QCheckbox, QBadge,
    QSplitter, QTree, QScrollArea, QLayout, QBtn, QInput, QBreadcrumbs, QBreadcrumbsEl,
    QDrawer, QFooter, QPageContainer, QAvatar, QDialog, QHeader, QItemSection, QRadio,
    QItemLabel, QToggle, QTooltip, QSpace, QCircularProgress, QForm, QSeparator, QVirtualScroll
  },
  directives: { Ripple, ClosePopup },
  plugins: { },
  iconSet
})