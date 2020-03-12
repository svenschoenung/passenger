import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'

export interface RepoState {
}

@Module({ name: 'repo', namespaced: true })
export default class RepoVuexModule extends VuexModule implements RepoState {
}