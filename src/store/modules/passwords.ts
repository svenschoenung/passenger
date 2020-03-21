import Vue from 'vue'
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import path from 'path'

import { PasswordFolder, traverseTree, PasswordNode, annotateDecryptable, annotateNotEncryptable } from '@/model/passwords'
import { readPasswordTree, decryptPasswordFile } from '@/service/passwords'
import { SettingsModule, PasswordsModule, UIModule, KeysModule } from '@/store'
import { Resolvable, unresolved, resolving, resolved, failed, resolvable } from '@/store/resolvable'
import { delay } from '@/util/dev'

export type PasswordMap = { [relPath: string]: PasswordNode }

export interface PasswordsModels {
    tree: Resolvable<PasswordFolder>,
    map: Resolvable<PasswordMap>,
    list: Resolvable<PasswordNode[]>,
}

export interface PasswordsState extends PasswordsModels {
    folderCount: number
    fileCount: number
}

@Module({ name: 'passwords', namespaced: true })
export default class PasswordsVuexModule extends VuexModule implements PasswordsState {
    tree: Resolvable<PasswordFolder> = unresolved()
    map: Resolvable<PasswordMap> = unresolved()
    list: Resolvable<PasswordNode[]> = unresolved()
    folderCount: number = 0
    fileCount: number = 0

    @Mutation
    loadingPasswordsFromFileSystem() {
        this.tree = resolving()
        this.map = resolving()
        this.list = resolving()
        this.folderCount = 0
        this.fileCount = 0
    }

    @Mutation
    loadedPasswordsFromFileSystem(state: PasswordsModels) {
        this.tree = state.tree
        this.map = state.map
        this.list = state.list
        if (this.list.value) {
            let folderCount = 0
            let fileCount = 0
            this.list.value.forEach(item => {
                if (item.folder) {
                    folderCount++
                } else {
                    fileCount++
                }
            })
            this.folderCount = folderCount
            this.fileCount = fileCount
        } else {
            this.folderCount = 0
            this.fileCount = 0
        }
    }

    @Action
    async loadPasswordsFromFileSystem() {
        try {
            this.loadingPasswordsFromFileSystem()
            const repoPath = SettingsModule.repoPath as string
            const tree = await delay(() => readPasswordTree(repoPath))
            if (repoPath !== SettingsModule.repoPath) {
                return
            }
            const map: PasswordMap = {}
            const list: PasswordNode[] = []
            traverseTree(tree, node => {
                map[node.relPath] = node
                list.push(node)
            })
            this.loadedPasswordsFromFileSystem({
                tree: resolved(tree),
                map: resolved(map),
                list: resolved(list)
            })
            UIModule.expandFoldersRecursively({ from: this.tree.value!, maxDepth: 2 })
        } catch (error) {
            this.loadedPasswordsFromFileSystem({
                tree: failed(error),
                map: failed(error),
                list: failed(error)
            }) 
        }
    }

    @Mutation
    annotatePasswordsUsingPrivateKeys() {
        if (this.tree.value && KeysModule.privateKeys.value) {
            annotateDecryptable(this.tree.value, KeysModule.privateKeys.value, false)
        }
    }

    @Mutation
    annotatePasswordsUsingPublicKeys() {
        if (this.tree.value && KeysModule.publicKeys.value) {
            annotateNotEncryptable(this.tree.value, KeysModule.publicKeys.value, false)
        }
    }

    get selectedPasswordNode(): Resolvable<PasswordNode|null> {
        const map = PasswordsModule.map
        if (!map.success || !map.value) {
            return resolvable(map)
        }
        const selectedPasswordPath = UIModule.selectedPasswordPath
        if (selectedPasswordPath === null) {
            return resolvable(map, null)
        }
        return resolvable(map, map.value[selectedPasswordPath])
    }


}