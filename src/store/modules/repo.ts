import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'

@Module({ name: 'repo' })
export default class RepoVuexModule extends VuexModule {
  location: string = '/Users/sven/.password-store'

  @Mutation
  changeLocation(location: string) {
    this.location = location 
  }

  @Action({ commit: 'changeLocation' })
  changeLocation$(page: string) {
    return page
  }
}