import { Module, VuexModule, Mutation } from 'vuex-module-decorators'

export interface SetupPayload {
  repoPath: string
  gpgPath: string
  darkMode: boolean
}

export interface ConfigState {
    repoPath: string | null
    gpgPath: string | null
    darkMode: boolean
}

@Module({ name: 'config', namespaced: true })
export default class ConfigVuexModule extends VuexModule implements ConfigState {
    repoPath: string | null = null
    gpgPath: string | null = null
    darkMode = false

    @Mutation
    setup(payload: SetupPayload) {
        this.repoPath = payload.repoPath;
        this.gpgPath = payload.gpgPath;
        this.darkMode = payload.darkMode;
    }

    @Mutation
    setRepoPath(repoPath: string) {
        this.repoPath = repoPath 
    }

    @Mutation
    setGPGPath(gpgPath: string) {
        this.gpgPath = gpgPath 
    }

    @Mutation
    setDarkMode(darkMode: boolean) {
        this.darkMode = darkMode 
    }
}