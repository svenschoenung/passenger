import { AnnotationsModule } from './../index';
import { traverseTree, PasswordFile } from '@/model/passwords';
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import async from 'async'
import { difference } from 'lodash'

import { annotateDecryptable, annotateToBeEncryptedWithUnknownKeys, annotateIntendedKeys } from '@/service/annotations'
import { PasswordsModule, KeysModule } from '@/store'
import { listUsedKeys, findUnknownPublicKeys, findMatchingPublicKeys, isUnknownKey, findMatchingKey, PublicKeyFinder } from '@/service/gpg';
import { PublicKey } from 'gpg-promised';
import { asyncPool } from '@/util/async';

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
            await asyncPool(files, 20, async file => {
                usedKeys[file.relPath] = await listUsedKeys(file.absPath)
            })
            AnnotationsModule.setUsedKeys(usedKeys)
        }
    }

    @Mutation
    annotateFilesEncryptedWithUnknownKeys() {
        if (KeysModule.publicKeys.value) {
            const encryptedWithUnknownKeys: PasswordKeysMap = {}
            const keyFinder = new PublicKeyFinder(KeysModule.publicKeys.value)
            Object.keys(this.usedKeys).forEach(relPath => {
                const usedKeys = this.usedKeys[relPath]
                const unknownKeys = usedKeys.filter(usedKey => !keyFinder.findMatchingKey(usedKey))
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
            const keyFinder = new PublicKeyFinder(KeysModule.publicKeys.value)
            Object.keys(this.usedKeys).forEach(relPath => {
                const knownUsedKeys = this.usedKeys[relPath]
                  .map(usedKey => keyFinder.findMatchingKeyId(usedKey))
                  .filter(key => !!key) as string[]
                const knownIntendedKeys = this.intendedKeys[relPath]
                  .map(intendedKey => keyFinder.findMatchingKeyId(intendedKey))
                  .filter(key => !!key) as string[]
                const unintendedKeys = difference(knownUsedKeys, knownIntendedKeys)
                if (unintendedKeys.length > 0) {
                    encryptedWithUnintendedKeys[relPath] = unintendedKeys
                }
            })
            this.encryptedWithUnintendedKeys = encryptedWithUnintendedKeys
        }
    }

    @Mutation
    annotateFilesEncryptedWithoutIntendedKeys() {
        if (KeysModule.publicKeys.value) {
            const encryptedWithoutIntendedKeys: PasswordKeysMap = {}
            const keyFinder = new PublicKeyFinder(KeysModule.publicKeys.value)
            Object.keys(this.usedKeys).forEach(relPath => {
                const knownUsedKeys = this.usedKeys[relPath]
                  .map(usedKey => keyFinder.findMatchingKeyId(usedKey))
                  .filter(key => !!key) as string[]
                const knownIntendedKeys = this.intendedKeys[relPath]
                  .map(intendedKey => keyFinder.findMatchingKeyId(intendedKey))
                  .filter(key => !!key) as string[]
                const missingIntendedKeys = difference(knownIntendedKeys, knownUsedKeys)
                if (missingIntendedKeys.length > 0) {
                    encryptedWithoutIntendedKeys[relPath] = missingIntendedKeys
                }
            })
            this.encryptedWithoutIntendedKeys = encryptedWithoutIntendedKeys
        }
    }
}