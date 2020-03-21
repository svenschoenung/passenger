import { Module, VuexModule, Mutation } from 'vuex-module-decorators'
import electron, { Rectangle } from 'electron'

export interface WindowState {
  maximized: boolean
  bounds: Rectangle
}

export type OverviewType = 'tree' | 'list'
export type ItemType = 'files-and-folders' | 'files-only'
export type ContentViewType = 'text' | 'key-value'

export interface PreferencesState {
    windowState: WindowState
    passwordOverviewWidthInPx: number
    overviewType: OverviewType
    showItemType: ItemType
    showNotDecryptable: boolean
    contentViewType: ContentViewType
}

@Module({ name: 'preferences', namespaced: true })
export default class PreferencesVuexModule extends VuexModule implements PreferencesState {
  windowState: WindowState = {
    maximized: false,
    bounds: electron.remote.getCurrentWindow().getBounds()
  }
  passwordOverviewWidthInPx = 300
  overviewType: OverviewType = 'tree'
  showItemType: ItemType = 'files-and-folders' 
  showNotDecryptable: boolean = true
  contentViewType: ContentViewType = 'text'

  @Mutation
  setWindowState(windowState: WindowState) {
    this.windowState = windowState 
  }

  @Mutation
  setPasswordOverviewWidthInPx(passwordOverviewWidthInPx: number) {
    this.passwordOverviewWidthInPx = passwordOverviewWidthInPx
  }

  @Mutation
  setOverviewType(overviewType: OverviewType) {
    this.overviewType = overviewType
  }

  @Mutation
  setShowItemType(showItemType: ItemType) {
    this.showItemType = showItemType
  }

  @Mutation
  setShowNotDecryptable(showNotDecryptable: boolean) {
    this.showNotDecryptable = showNotDecryptable
  }

  @Mutation
  setContentViewType(contentViewType: ContentViewType) {
    this.contentViewType = contentViewType 
  }
}