import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'

@Module({ name: 'ui' })
export default class UIVuexModule extends VuexModule {
  page = 'passwords'
  configPage = 'repo'
  selectedPasswordNode: string | null = null

  @Mutation
  changePage(page: string) {
    this.page = page 
  }

  @Action({ commit: 'changePage' })
  changePage$(page: string) {
    return page
  }

  @Mutation
  changeConfigPage(configPage: string) {
    this.configPage = configPage 
  }

  @Action({ commit: 'changeConfigPage' })
  changeConfigPage$(configPage: string) {
    return configPage
  }

  @Mutation
  selectPasswordNode(absPath: string) {
    this.selectedPasswordNode = absPath 
  }

  @Action({ commit: 'selectPasswordNode' })
  selectPasswordNode$(absPath: string) {
    return absPath
  }
}