import { SettingsModule } from './../index';
import Vue from 'vue'
import { Rectangle } from 'electron'
import { Module, VuexModule, Mutation, Action,  } from 'vuex-module-decorators'
import { darkMode } from 'electron-util'

import { PasswordNode, traverseTree } from '@/model/passwords'

export interface WindowState {
  maximized: boolean
  bounds: Rectangle
}

export interface ScrollPosState {
  tree: number;
  list: number;
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

  @Mutation
  gotoPasswordPath(relPath: string) {
    this.selectedPasswordPath = relPath 
    this.page = 'passwords'
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

  get darkMode() {
    if (SettingsModule.colorTheme === 'system') {
      return this.systemDarkMode
    }
    return SettingsModule.colorTheme === 'dark'
  }
}