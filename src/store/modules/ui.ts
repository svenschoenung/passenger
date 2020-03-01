import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'

@Module({ name: 'ui' })
export default class UIVuexModule extends VuexModule {
  page = 'passwords'
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
  selectPasswordNode(absPath: string) {
    this.selectedPasswordNode = absPath 
  }

  @Action({ commit: 'selectPasswordNode' })
  selectPasswordNode$(absPath: string) {
    return absPath
  }
}