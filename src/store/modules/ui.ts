import Vue from 'vue'
import { Rectangle } from 'electron'
import { Module, VuexModule, Mutation, Action,  } from 'vuex-module-decorators'
import { darkMode } from 'electron-util'

import { SettingsModule, PreferencesModule, UIModule } from '@/store';
import { TimeoutType } from '@/store/modules/settings';
import { PasswordNode, traverseTree, getParents } from '@/model/passwords'
import { removePasswordFromClipboard } from '@/service/clipboard';

export interface WindowState {
  maximized: boolean
  bounds: Rectangle
}

export interface ScrollPosState {
  tree: number;
  list: number;
}

export interface CopyToClipboard {
  text: string
  password?: boolean 
}

export type OverviewType = 'tree' | 'list'
export type ItemType = 'files-and-folders' | 'files-only'
export type PageType = 'settings' | 'repo' | 'keys' | 'passwords' | 'problems'
export type SettingsPageType = 'repo' | 'keys' | 'fields' | 'validation' | 'ui'
export type ContentViewType = 'text' | 'key-value'

export interface CountdownState {
  seconds: number
  interval: number | null
}

export interface UIState {
    page: string
    settingsPage: string
    selectedPasswordPath: string | null
    filter: string
    scrollPos: ScrollPosState
    expandedFolders: { [relPath: string]: boolean }
    systemDarkMode: boolean
    countdowns: {
      passwordInClipboard: CountdownState
      passwordReveal: CountdownState
      passwordPopup: CountdownState
    }
}

export type CountdownType = keyof UIState['countdowns']

export interface ExpandFoldersPayload {
  from: PasswordNode
  maxDepth?: number
}

@Module({ name: 'ui', namespaced: true })
export default class UIVuexModule extends VuexModule implements UIState {
  page: PageType = 'passwords'
  settingsPage: SettingsPageType = 'repo'
  selectedPasswordPath: string | null = null
  filter: string = ''
  scrollPos: ScrollPosState = { tree: 0, list: 0 }
  expandedFolders: { [relPath: string]: boolean } = {}
  systemDarkMode: boolean = darkMode.isEnabled
  countdowns: UIState['countdowns'] = {
    passwordInClipboard: { seconds: 0, interval: null },
    passwordReveal: { seconds: 0, interval: null },
    passwordPopup: { seconds: 0, interval: null }
  }

  @Mutation
  setPage(page: PageType) {
    this.page = page 
  }

  @Mutation
  setSettingsPage(settingsPage: SettingsPageType) {
    this.settingsPage = settingsPage 
  }

  @Mutation
  selectPasswordPath(relPath: string | null) {
    this.selectedPasswordPath = relPath 
  }

  @Action
  async gotoPasswordPath(relPath: string) {
    this.setPage('passwords')
    await Vue.nextTick()
    if (PreferencesModule.overviewType === 'tree') {
      this.expandFolders(getParents(relPath).map(parent => parent.relPath))
    }
    this.selectPasswordPath(relPath)
  }

  @Mutation
  setFilter(filter: string) {
    this.filter = filter
  }

  @Mutation
  setScrollPos(pos: Partial<ScrollPosState>) {
    this.scrollPos = { ...this.scrollPos, ...pos }
  }

  @Mutation
  expandFoldersRecursively({ from, maxDepth = Number.POSITIVE_INFINITY}: ExpandFoldersPayload) {
    traverseTree(from, (node, depth) => {
      if (depth >= maxDepth) {
        return { skipChildren: true }
      }
      if (node.folder && node.children) {
        Vue.set(this.expandedFolders, node.relPath, true)
      }
    })
  }

  @Mutation
  collapseFoldersRecursively({ from, maxDepth = Number.POSITIVE_INFINITY}: ExpandFoldersPayload) {
    traverseTree(from, (node, depth) => {
      if (depth >= maxDepth) {
        return { skipChildren: true }
      }
      if (node.folder && node.children) {
        Vue.delete(this.expandedFolders, node.relPath)
      }
    })
  }

  @Mutation
  expandFolders(relPaths: string[]) {
    relPaths.forEach(relPath => Vue.set(this.expandedFolders, relPath, true))
  }

  @Mutation
  toggleFolders(relPaths: string[]) {
    relPaths.forEach(relPath => { 
      if (this.expandedFolders[relPath]) {
        Vue.delete(this.expandedFolders, relPath)
      } else {
        Vue.set(this.expandedFolders, relPath, true)
      }
    })
  }

  @Mutation
  clearExpandedFolders() {
    this.expandedFolders = {}
  }

  @Mutation
  setSystemDarkMode(systemDarkMode: boolean) {
    this.systemDarkMode = systemDarkMode
  }

  @Action
  startPasswordInClipboardCountdown() {
    startCountdown({
      countdownType: 'passwordInClipboard',
      timeoutType: 'passwordInClipboard',
      elapsed: () => removePasswordFromClipboard()
    })
  } 

  @Action
  startPasswordRevealCountdown() {
    startCountdown({
      countdownType: 'passwordReveal',
      timeoutType: 'passwordReveal',
      elapsed: () => this.endCountdown('passwordReveal')
    })
  }

  @Action
  startPasswordPopupCountdown() {
    startCountdown({
      countdownType: 'passwordPopup',
      timeoutType: 'passwordReveal',
      elapsed: () => this.endCountdown('passwordPopup')
    })
  }

  @Action
  endCountdown(type: CountdownType) {
    window.clearInterval(UIModule.countdowns[type].interval || undefined)
    UIModule.clearCountdown(type)
  }

  @Mutation
  initCountdown(payload: { type: CountdownType, countdown: CountdownState }) {
    this.countdowns[payload.type] = payload.countdown
  }

  @Mutation
  setCountdownSeconds(payload: { type: CountdownType, seconds: number }) {
    this.countdowns[payload.type].seconds = payload.seconds <= 0 ? 0 : payload.seconds
  }

  @Mutation
  clearCountdown(type: CountdownType) {
    this.countdowns[type].seconds = 0
    this.countdowns[type].interval = null
  }

  get darkMode() {
    if (SettingsModule.colorTheme === 'system') {
      return this.systemDarkMode
    }
    return SettingsModule.colorTheme === 'dark'
  }

}

function startCountdown(opts: { countdownType: CountdownType, timeoutType: TimeoutType, elapsed: () => void }) {
  const seconds = SettingsModule.timeouts[opts.timeoutType].seconds
  const endDate = Math.ceil(new Date().valueOf() / 1000 + seconds) 
  const interval = window.setInterval(function() {
    const now = Math.ceil(new Date().valueOf() / 1000)
    UIModule.setCountdownSeconds({ type: opts.countdownType, seconds: endDate - now })
    if (UIModule.countdowns[opts.countdownType].seconds <= 0 && UIModule.countdowns[opts.countdownType].interval) {
      opts.elapsed()
    }
  }, 1000)
  UIModule.initCountdown({ type: opts.countdownType, countdown: { seconds, interval } })
}