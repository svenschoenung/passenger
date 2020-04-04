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

export interface SettingsState {
    repoPath: string | null
    gpgPath: string | null
    colorTheme: ColorTheme
    showStatusBar: boolean
    enablePasswordInClipboardTimeout: boolean
    passwordInClipboardTimeout: number
    customFields: CustomField[]
}

@Module({ name: 'settings', namespaced: true })
export default class SettingsVuexModule extends VuexModule implements SettingsState {
    repoPath: string | null = null
    gpgPath: string | null = null
    colorTheme: ColorTheme = 'system' 
    showStatusBar = true
    enablePasswordInClipboardTimeout = false
    passwordInClipboardTimeout = 40
    customFields = DEFAULT_CUSTOM_FIELDS

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

    @Mutation
    setCustomFields(customFields: CustomField[]) {
        this.customFields = customFields
    }
}