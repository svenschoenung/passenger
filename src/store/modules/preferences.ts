import { openNewGitHubIssue } from 'electron-util';
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
    overviewCollapsed: boolean
    overviewWidth: number
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
  overviewCollapsed = false
  overviewWidth = 300
  overviewType: OverviewType = 'tree'
  showItemType: ItemType = 'files-and-folders' 
  showNotDecryptable: boolean = true
  contentViewType: ContentViewType = 'text'
  showAuthor: boolean = true
  showAuthorDate: boolean = true
  showCommitter: boolean = false
  showCommitterDate: boolean = false
  showMergeCommits: boolean = true

  @Mutation
  setWindowState(windowState: WindowState) {
    this.windowState = windowState 
  }

  @Mutation
  setOverviewCollapsed(overviewCollapsd: boolean) {
    this.overviewCollapsed = overviewCollapsd
  }

  @Mutation
  toggleOverviewCollapsed() {
    this.overviewCollapsed = !this.overviewCollapsed
  }

  @Mutation
  setOverviewWidth(overviewWidth: number) {
    this.overviewWidth = overviewWidth
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

  @Mutation
  setShowAuthor(showAuthor: boolean) {
    this.showAuthor = showAuthor 
  }

  @Mutation
  setShowAuthorDate(showAuthorDate: boolean) {
    this.showAuthorDate = showAuthorDate 
  }

  @Mutation
  setShowCommitter(showCommitter: boolean) {
    this.showCommitter = showCommitter 
  }

  @Mutation
  setShowCommitterDate(showCommitterDate: boolean) {
    this.showCommitterDate = showCommitterDate
  }

  @Mutation
  setShowMergeCommits(showMergeCommits: boolean) {
    this.showMergeCommits = showMergeCommits
  }
}