import { Module, VuexModule, Mutation, Action,  } from '@/store/decorators'
import electron, { Rectangle } from 'electron'

export interface WindowState {
  maximized: boolean
  bounds: Rectangle
}

@Module({ name: 'ui' })
export default class UIVuexModule extends VuexModule {
  page = 'passwords'
  configPage = 'repo'
  selectedPasswordNode: string | null = null
  windowState: WindowState = {
    maximized: false,
    bounds: electron.remote.getCurrentWindow().getBounds()
  }
  passwordOverviewWidthInPx = 300

  @Mutation({ name: 'ui|setPage' })
  setPage(page: string) {
    this.page = page 
  }

  @Action({ commit: 'ui|setPage' })
  setPage$(page: string) {
    return page
  }

  @Mutation({ name: 'ui|setConfigPage' })
  setConfigPage(configPage: string) {
    this.configPage = configPage 
  }

  @Action({ commit: 'ui|setConfigPage' })
  setConfigPage$(configPage: string) {
    return configPage
  }

  @Mutation({ name: 'ui|selectPasswordNode' })
  selectPasswordNode(absPath: string) {
    this.selectedPasswordNode = absPath 
  }

  @Action({ commit: 'ui|selectPasswordNode' })
  selectPasswordNode$(absPath: string) {
    return absPath
  }

  @Mutation({ name: 'ui|setWindowState' })
  setWindowState(windowState: WindowState) {
    this.windowState = windowState 
  }

  @Action({ commit: 'ui|setWindowState' })
  setWindowState$(windowState: WindowState) {
    return windowState
  }

  @Mutation({ name: 'ui|setPasswordOverviewWidthInPx' })
  setPasswordOverviewWidthInPx(passwordOverviewWidthInPx: number) {
    this.passwordOverviewWidthInPx = passwordOverviewWidthInPx
  }

  @Action({ commit: 'ui|setPasswordOverviewWidthInPx' })
  setPasswordOverviewWidthInPx$(passwordOverviewWidthInPx: number) {
    return passwordOverviewWidthInPx
  }
}