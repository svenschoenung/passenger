import { UIModule } from '@/store';
import { SettingsModule, PreferencesModule } from './../index';
import Vue from 'vue'
import { Rectangle } from 'electron'
import { Module, VuexModule, Mutation, Action,  } from 'vuex-module-decorators'
import { darkMode } from 'electron-util'

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
export type SettingsPageType = 'repo' | 'keys' | 'ui'
export type ContentViewType = 'text' | 'key-value'

export interface UIState {
    page: string
    settingsPage: string
    selectedPasswordPath: string | null
    filter: string
    scrollPos: ScrollPosState
    expandedFolders: { [relPath: string]: boolean }
    systemDarkMode: boolean
}

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
  passwordInClipboardInterval: number | null = null
  passwordInClipboardCountdown: number = 0

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
  setSystemDarkMode(systemDarkMode: boolean) {
    this.systemDarkMode = systemDarkMode
  }

  @Action
  startPasswordInClipboardCountdown() {
    const duration = 10
    const endDate = Math.ceil(new Date().valueOf() / 1000 + duration) 
    const interval = window.setInterval(function() {
      const now = Math.ceil(new Date().valueOf() / 1000)
      UIModule.setPasswordInClipboardCountdown(endDate - now)
      if (UIModule.passwordInClipboardCountdown <= 0) {
        removePasswordFromClipboard()
      }
    }, 1000)
    this.initPasswordInClipboardCountdown({ countdown: duration, interval })
  }

  @Action
  stopPasswordInClipboardCountdown() {
    window.clearInterval(UIModule.passwordInClipboardInterval || undefined)
    UIModule.cleanupPasswordInClipboardCountdown()
  }

  @Mutation
  initPasswordInClipboardCountdown(payload: { countdown: number, interval: number}) {
    this.passwordInClipboardCountdown = payload.countdown
    this.passwordInClipboardInterval = payload.interval
  }

  @Mutation
  setPasswordInClipboardCountdown(countdown: number) {
    this.passwordInClipboardCountdown = countdown <= 0 ? 0 : countdown
  }

  @Mutation
  cleanupPasswordInClipboardCountdown() {
    this.passwordInClipboardCountdown = 0
    this.passwordInClipboardInterval = null
  }

  get darkMode() {
    if (SettingsModule.colorTheme === 'system') {
      return this.systemDarkMode
    }
    return SettingsModule.colorTheme === 'dark'
  }

}