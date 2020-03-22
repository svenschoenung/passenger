import Vue from 'vue'

import {
  Quasar, QIcon, QChip, QList, QItem, QToolbar, QToolbarTitle, QMenu, QCheckbox, QBadge,
  QSplitter, QTree, QScrollArea, QLayout, QBtn, QInput, QBreadcrumbs, QBreadcrumbsEl, QBtnToggle,
  QDrawer, QFooter, QPageContainer, QAvatar, QDialog, QHeader, QItemSection, QRadio, QBtnDropdown,
  QItemLabel, QToggle, QTooltip, QSpace, QCircularProgress, QForm, QSeparator, QVirtualScroll,
  Ripple, ClosePopup, Notify
} from 'quasar'

Vue.use(Quasar, {
  config: {},
  components: {
    QIcon, QChip, QList, QItem, QToolbar, QToolbarTitle, QMenu, QCheckbox, QBadge,
    QSplitter, QTree, QScrollArea, QLayout, QBtn, QInput, QBreadcrumbs, QBreadcrumbsEl, QBtnToggle,
    QDrawer, QFooter, QPageContainer, QAvatar, QDialog, QHeader, QItemSection, QRadio, QBtnDropdown,
    QItemLabel, QToggle, QTooltip, QSpace, QCircularProgress, QForm, QSeparator, QVirtualScroll
  },
  directives: { Ripple, ClosePopup },
  plugins: { Notify }
})