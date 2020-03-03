import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { Dark } from 'quasar'

export interface SetupPayload {
  repoPath: string
  gpgPath: string
  darkMode: boolean
}

@Module({ name: 'config' })
export default class ConfigVuexModule extends VuexModule {
    repoPath: string | null = null
    gpgPath: string | null = null
    darkMode = false

    @Mutation
    setup(payload: SetupPayload) {
        this.repoPath = payload.repoPath;
        this.gpgPath = payload.gpgPath;
        this.darkMode = payload.darkMode;
        Dark.set(this.darkMode)
    }

    @Action({ commit: 'setup' })
    setup$(payload: SetupPayload) {
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
    changeGPGPath(gpgPath: string) {
        this.gpgPath = gpgPath 
    }

    @Action({ commit: 'changeGPGPath' })
    changeGPGPath$(gpgPath: string) {
        return gpgPath
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