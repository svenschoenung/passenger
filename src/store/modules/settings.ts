import { overviewFilterHeight, overviewToolbarHeight } from './../../constants';
import { Module, VuexModule, Mutation } from 'vuex-module-decorators'
import { statusBarHeight } from '@/constants'

export interface SetupPayload {
  repoPath: string
  gpgPath: string
  darkMode: boolean
}

export interface SettingsState {
    repoPath: string | null
    gpgPath: string | null
    darkMode: boolean
}

@Module({ name: 'settings', namespaced: true })
export default class SettingsVuexModule extends VuexModule implements SettingsState {
    repoPath: string | null = null
    gpgPath: string | null = null
    darkMode = false
    showStatusBar = true

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

    @Mutation
    setShowStatusBar(showStatusBar: boolean) {
        this.showStatusBar = showStatusBar
    }
}