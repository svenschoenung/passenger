import { Module, VuexModule, Mutation } from 'vuex-module-decorators'

export interface SetupPayload {
  repoPath: string
  gpgPath: string
  colorTheme: ColorTheme
}

export type ColorTheme = 'light' | 'dark' | 'system'

export interface SettingsState {
    repoPath: string | null
    gpgPath: string | null
    colorTheme: ColorTheme
    showStatusBar: boolean
    enablePasswordInClipboardTimeout: boolean
    passwordInClipboardTimeout: number
}

@Module({ name: 'settings', namespaced: true })
export default class SettingsVuexModule extends VuexModule implements SettingsState {
    repoPath: string | null = null
    gpgPath: string | null = null
    colorTheme: ColorTheme = 'system' 
    showStatusBar = true
    enablePasswordInClipboardTimeout = false
    passwordInClipboardTimeout = 40

    @Mutation
    setup(payload: SetupPayload) {
        this.repoPath = payload.repoPath;
        this.gpgPath = payload.gpgPath;
        this.colorTheme = payload.colorTheme;
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
    setColorTheme(colorTheme: ColorTheme) {
        this.colorTheme = colorTheme
    }

    @Mutation
    setShowStatusBar(showStatusBar: boolean) {
        this.showStatusBar = showStatusBar
    }

    @Mutation
    setEnablePasswordInClipboardTimeout(enablePasswordInClipboardTimeout: boolean) {
        this.enablePasswordInClipboardTimeout = enablePasswordInClipboardTimeout
    }

    @Mutation
    setPasswordInClipboardTimeout(passwordInClipboardTimeout: number) {
        this.passwordInClipboardTimeout = passwordInClipboardTimeout
    }
}