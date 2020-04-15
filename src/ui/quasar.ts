import Vue from 'vue'

import {
  QIcon, QChip, QList, QItem, QToolbar, QToolbarTitle, QMenu, QCheckbox, QBadge,
  QSpinner, QTabPanels, QSplitter, QTree, QScrollArea, QLayout, QBtn, QInput,
  QBreadcrumbs, QBreadcrumbsEl, QBtnToggle, QTabs, QRouteTab, QDrawer, QFooter,
  QPageContainer, QAvatar, QDialog, QHeader, QItemSection, QRadio, QBtnDropdown, QLinearProgress,
  QTabPanel, QItemLabel, QToggle, QTooltip, QSpace, QCircularProgress, QForm, QField,
  QSeparator, QVirtualScroll, QSelect, QCard, QCardSection, QCardActions, QTab, QExpansionItem,
  Ripple, ClosePopup, Notify, Dialog, Quasar

} from 'quasar'

Vue.use(Quasar, {
  config: {},
  components: {
    QIcon, QChip, QList, QItem, QToolbar, QToolbarTitle, QMenu, QCheckbox, QBadge,
    QSpinner, QTabPanels, QSplitter, QTree, QScrollArea, QLayout, QBtn, QInput,
    QBreadcrumbs, QBreadcrumbsEl, QBtnToggle, QTabs, QRouteTab, QDrawer, QFooter,
    QPageContainer, QAvatar, QDialog, QHeader, QItemSection, QRadio, QBtnDropdown, QLinearProgress,
    QTabPanel, QItemLabel, QToggle, QTooltip, QSpace, QCircularProgress, QForm, QField,
    QSeparator, QVirtualScroll, QSelect, QCard, QCardSection, QCardActions, QTab, QExpansionItem
  },
  directives: { Ripple, ClosePopup },
  plugins: { Notify, Dialog }
})