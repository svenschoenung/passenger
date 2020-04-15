import { Module, VuexModule, Mutation } from 'vuex-module-decorators'

export interface SetupPayload {
  repoPath: string
  gpgPath: string
  colorTheme: ColorTheme
}

export type ColorTheme = 'light' | 'dark' | 'system'

export enum CustomFieldType {
    user = 'user',
    email = 'email',
    url = 'url'
}

export interface CustomField {
    type: CustomFieldType,
    keys: string[]
}

export const DEFAULT_CUSTOM_FIELDS: CustomField[] = [
    {
        type: CustomFieldType.user,
        keys: ['User', 'Username', 'Login', 'Account']
    },
    {
        type: CustomFieldType.email,
        keys: ['Email', 'Mail', 'Email-Address']
    },
    {
        type: CustomFieldType.url,
        keys: ['URL', 'Web', 'Website']
    }
]

export interface TimeoutSettings {
    enable: boolean
    seconds: number
}

export interface SettingsState {
    repoPath: string | null
    gpgPath: string | null
    gpgBinaryPath: string | null
    colorTheme: ColorTheme
    showStatusBar: boolean
    customFields: CustomField[]
    timeouts: {
        passwordInClipboard: TimeoutSettings
        passwordReveal: TimeoutSettings
    }
}

export type TimeoutType = keyof SettingsState['timeouts']

@Module({ name: 'settings', namespaced: true })
export default class SettingsVuexModule extends VuexModule implements SettingsState {
    repoPath: string | null = null
    gpgPath: string | null = null
    gpgBinaryPath: string | null = null
    colorTheme: ColorTheme = 'system' 
    showStatusBar = true
    showSplashScreen = true
    customFields = DEFAULT_CUSTOM_FIELDS
    timeouts = {
        passwordInClipboard: { enable: true, seconds: 40 },
        passwordReveal: { enable: true, seconds: 40 }
    }

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
    setGPGBinaryPath(gpgBinaryPath: string) {
        this.gpgBinaryPath = gpgBinaryPath
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
    setShowSplashScreen(showSplashScreen: boolean) {
        this.showSplashScreen = showSplashScreen
    }

    @Mutation
    setEnableTimeout(payload: { type: TimeoutType, enable: boolean }) {
        this.timeouts[payload.type].enable = payload.enable
    }

    @Mutation
    setTimeoutSeconds(payload: { type: TimeoutType, seconds: number }) {
        this.timeouts[payload.type].seconds = payload.seconds
    }

    @Mutation
    setCustomFields(customFields: CustomField[]) {
        this.customFields = customFields
    }
}