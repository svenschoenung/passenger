import { Module, VuexModule, Mutation, Action,  } from '@/store/decorators'

@Module({ name: 'ui' })
export default class UIVuexModule extends VuexModule {
  page = 'passwords'
  configPage = 'repo'
  selectedPasswordNode: string | null = null

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
}