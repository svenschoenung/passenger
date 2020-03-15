import { Module, VuexModule, Mutation, Action,  } from 'vuex-module-decorators'
import electron, { Rectangle } from 'electron'

export interface WindowState {
  maximized: boolean
  bounds: Rectangle
}

export type OverviewType = 'tree' | 'list'
export type ItemType = 'files-and-folders' | 'files-only'
export type PageType = 'config' | 'repo' | 'keys' | 'passwords' | 'problems'
export type ConfigPageType = 'repo' | 'keys' | 'ui'
export type ContentViewType = 'text' | 'key-value'

export interface UIState {
    page: string
    configPage: string
    selectedPasswordPath: string | null
    windowState: WindowState
    passwordOverviewWidthInPx: number
    filter: string
    overviewType: OverviewType
    showItemType: ItemType
    showNotDecryptable: boolean
    contentViewType: ContentViewType
}

@Module({ name: 'ui', namespaced: true })
export default class UIVuexModule extends VuexModule implements UIState {
  page: PageType = 'passwords'
  configPage: ConfigPageType = 'repo'
  selectedPasswordPath: string | null = null
  windowState: WindowState = {
    maximized: false,
    bounds: electron.remote.getCurrentWindow().getBounds()
  }
  passwordOverviewWidthInPx = 300
  filter: string = ''
  overviewType: OverviewType = 'tree'
  showItemType: ItemType = 'files-and-folders' 
  showNotDecryptable: boolean = true
  contentViewType: ContentViewType = 'text'

  @Mutation
  setPage(page: PageType) {
    this.page = page 
  }

  @Mutation
  setConfigPage(configPage: ConfigPageType) {
    this.configPage = configPage 
  }

  @Mutation
  selectPasswordPath(relPath: string) {
    this.selectedPasswordPath = relPath 
  }

  @Mutation
  gotoPasswordPath(relPath: string) {
    this.selectedPasswordPath = relPath 
    this.page = 'passwords'
  }

  @Mutation
  setWindowState(windowState: WindowState) {
    this.windowState = windowState 
  }

  @Mutation
  setPasswordOverviewWidthInPx(passwordOverviewWidthInPx: number) {
    this.passwordOverviewWidthInPx = passwordOverviewWidthInPx
  }

  @Mutation
  setFilter(filter: string) {
    this.filter = filter
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