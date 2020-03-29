import { AnnotationsModule } from './../index';
import { traverseTree, PasswordFile } from '@/model/passwords';
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import async from 'async'
import { difference } from 'lodash'

import { annotateDecryptable, annotateToBeEncryptedWithUnknownKeys, annotateIntendedKeys } from '@/service/annotations'
import { PasswordsModule, KeysModule } from '@/store'
import { listUsedKeys, findUnknownPublicKeys, findMatchingPublicKeys, isUnknownKey, findMatchingKey } from '@/service/gpg';
import { PublicKey } from 'gpg-promised';

export type PasswordFlags = { [relPath: string]: boolean }
export type PasswordKeysMap = { [relPath: string]: string[] }

export interface AnnotationsState {
    decryptable: PasswordFlags
    hasDecryptableChildren: PasswordFlags
    intendedKeys: PasswordKeysMap
    usedKeys: PasswordKeysMap 
    toBeEncryptedWithUnknownKeys: PasswordKeysMap
    encryptedWithUnknownKeys: PasswordKeysMap
    encryptedWithUnintendedKeys: PasswordKeysMap
    encryptedWithoutIntendedKeys: PasswordKeysMap
}

@Module({ name: 'annotations', namespaced: true })
export default class AnnotationsVuexModule extends VuexModule implements AnnotationsState {
    decryptable: PasswordFlags = {}
    hasDecryptableChildren: PasswordFlags = {}
    intendedKeys: PasswordKeysMap = {}
    usedKeys: PasswordKeysMap = {}
    toBeEncryptedWithUnknownKeys: PasswordKeysMap = {}
    encryptedWithUnknownKeys: PasswordKeysMap = {}
    encryptedWithUnintendedKeys: PasswordKeysMap = {}
    encryptedWithoutIntendedKeys: PasswordKeysMap = {}

    @Mutation
    annotateFilesAndFoldersThatAreDecryptable() {
        if (PasswordsModule.tree.value && KeysModule.privateKeys.value) {
            const result = {
                decryptable: {},
                hasDecryptableChildren: {},
            }
            annotateDecryptable(PasswordsModule.tree.value, KeysModule.privateKeys.value, false, result)
            this.decryptable = result.decryptable
            this.hasDecryptableChildren = result.hasDecryptableChildren
        }
    }

    @Mutation
    annotateFilesAndFoldersWithIntendedKeys() {
        if (PasswordsModule.tree.value) {
            const result = {
                intendedKeys: {}
            }
            annotateIntendedKeys(PasswordsModule.tree.value, [], result)
            this.intendedKeys = result.intendedKeys
        }
    }

    @Mutation
    annotateFilesAndFoldersToBeEncryptedWithUnknownKeys() {
        if (PasswordsModule.tree.value && KeysModule.publicKeys.value) {
            const toBeEncryptedWithUnknownKeys: PasswordKeysMap = {}
            annotateToBeEncryptedWithUnknownKeys(PasswordsModule.tree.value, KeysModule.publicKeys.value, [], toBeEncryptedWithUnknownKeys)
            this.toBeEncryptedWithUnknownKeys = toBeEncryptedWithUnknownKeys
        }
    }

    @Mutation
    setEncryptedWithUnknownKeys(encryptedWithUnknownKeys: PasswordKeysMap) {
        this.encryptedWithUnknownKeys = encryptedWithUnknownKeys
    }

    @Mutation
    setUsedKeys(usedKeys: PasswordKeysMap) {
        this.usedKeys = usedKeys
    }

    @Action
    async annotateFilesWithUsedKeys() {
        if (PasswordsModule.list.value && KeysModule.publicKeys.value) {
            const usedKeys: PasswordKeysMap = {}
            const files = PasswordsModule.list.value.filter(item => !item.folder) as PasswordFile[]
            await async.eachLimit(files, 10, async (file, cb) => {
                try {
                    usedKeys[file.relPath] = await listUsedKeys(file.absPath)
                    cb()
                } catch (e) {
                    cb(e)
                }
            })
            console.log('usedKeys', usedKeys)
            AnnotationsModule.setUsedKeys(usedKeys)
        }
    }

    @Mutation
    annotateFilesEncryptedWithUnknownKeys() {
        if (KeysModule.publicKeys.value) {
            const encryptedWithUnknownKeys: PasswordKeysMap = {}
            const unknownKeysCache: PasswordFlags = {}
            Object.keys(this.usedKeys).forEach(relPath => {
                const usedKeys = this.usedKeys[relPath]
                const unknownKeys = usedKeys.filter(usedKey => {
                    if (!Object.prototype.hasOwnProperty.call(unknownKeysCache, usedKey)) {
                        unknownKeysCache[usedKey] = isUnknownKey(usedKey, KeysModule.publicKeys.value!)
                    }
                    return unknownKeysCache[usedKey]
                })
                if (unknownKeys.length > 0) {
                    encryptedWithUnknownKeys[relPath] = unknownKeys
                }
            })
            this.encryptedWithUnknownKeys = encryptedWithUnknownKeys
        }
    }

    @Mutation
    annotateFilesEncryptedWithUnintendedKeys() {
        if (KeysModule.publicKeys.value) {
            const encryptedWithUnintendedKeys: PasswordKeysMap = {}
            const keysCache: { [key: string]: string | null } = {}
            Object.keys(this.usedKeys).forEach(relPath => {
                const usedKeys = this.usedKeys[relPath]
                const knownUsedKeys = usedKeys.map(usedKey => {
                    if (!Object.prototype.hasOwnProperty.call(keysCache, usedKey)) {
                        const matchingKey = findMatchingKey(usedKey, KeysModule.publicKeys.value!)
                        keysCache[usedKey] = matchingKey ? matchingKey.keyid : null
                    }
                    return keysCache[usedKey]
                }).filter(key => !!key) as string[]
                const intendedKeys = this.intendedKeys[relPath]
                const knownIntendedKeys = intendedKeys.map(intendedKey => {
                    if (!Object.prototype.hasOwnProperty.call(keysCache, intendedKey)) {
                        const matchingKey = findMatchingKey(intendedKey, KeysModule.publicKeys.value!)
                        keysCache[intendedKey] = matchingKey ? matchingKey.keyid : null
                    }
                    return keysCache[intendedKey]
                }).filter(key => !!key) as string[]
                const unintendedKeys = difference(knownUsedKeys, knownIntendedKeys)
                if (unintendedKeys.length > 0) {
                    encryptedWithUnintendedKeys[relPath] = unintendedKeys
                }
            })
            this.encryptedWithUnintendedKeys = encryptedWithUnintendedKeys
        }
    }
}