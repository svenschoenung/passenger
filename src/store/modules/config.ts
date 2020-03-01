import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { Dark } from 'quasar'

@Module({ name: 'config' })
export default class ConfigVuexModule extends VuexModule {
    repoPath: string | null = null
    darkMode = false

    @Mutation
    setup(payload: { repoPath: string, darkMode: boolean }) {
        this.repoPath = payload.repoPath;
        this.darkMode = payload.darkMode;
        Dark.set(this.darkMode)
    }

    @Action({ commit: 'setup' })
    setup$(payload: { repoPath: string, darkMode: boolean }) {
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

    @Mutation
    changeDarkMode(darkMode: boolean) {
        this.darkMode = darkMode 
        Dark.set(this.darkMode)
    }

    @Action({ commit: 'changeDarkMode' })
    changeDarkMode$(darkMode: boolean) {
        return darkMode
    }
}