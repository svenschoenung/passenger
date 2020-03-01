import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'

@Module({ name: 'config' })
export default class ConfigVuexModule extends VuexModule {
    repoPath: string | null = null

    @Mutation
    setup(payload: { repoPath: string }) {
        this.repoPath = payload.repoPath 
    }

    @Action({ commit: 'setup' })
    setup$(payload: { repoPath: string }) {
        return payload
    }

    @Mutation
    changeRepoPath(repoPath: string) {
        this.repoPath = repoPath 
    }

    @Action({ commit: 'changeRepoPath' })
    changeRepoPath$(repoPath: string) {
        return repoPath
    }
}