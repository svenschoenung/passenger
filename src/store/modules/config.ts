
import { Dark } from 'quasar'
import { Module, VuexModule, Mutation, Action } from '@/store/decorators'

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

    @Mutation({ name: 'config|setup' })
    setup(payload: SetupPayload) {
        this.repoPath = payload.repoPath;
        this.gpgPath = payload.gpgPath;
        this.darkMode = payload.darkMode;
        Dark.set(this.darkMode)
    }

    @Action({ commit: 'config|setup' })
    setup$(payload: SetupPayload) {
        return payload
    }

    @Mutation({ name: 'config|setRepoPath' })
    setRepoPath(repoPath: string) {
        this.repoPath = repoPath 
    }

    @Action({ commit: 'config|setRepoPath' })
    setRepoPath$(repoPath: string) {
        return repoPath
    }

    @Mutation({ name: 'config|setGPGPath' })
    setGPGPath(gpgPath: string) {
        this.gpgPath = gpgPath 
    }

    @Action({ commit: 'config|setGPGPath' })
    setGPGPath$(gpgPath: string) {
        return gpgPath
    }

    @Mutation({ name: 'config|setDarkMode' })
    setDarkMode(darkMode: boolean) {
        this.darkMode = darkMode 
        Dark.set(this.darkMode)
    }

    @Action({ commit: 'config|setDarkMode' })
    setDarkMode$(darkMode: boolean) {
        return darkMode
    }
}