import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'

@Module({ name: 'ui' })
export default class UIVuexModule extends VuexModule {
  page = 'passwords'

  @Mutation
  changePage(page: string) {
    this.page = page 
  }

  @Action({ commit: 'changePage' })
  changePageAction(page: string) {
    return page
  }
}