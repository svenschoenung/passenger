import { AnnotationsModule, SettingsModule } from './../index';
import { PasswordFile } from '@/model/passwords';
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { difference } from 'lodash'

import { annotateDecryptable, annotateToBeEncryptedWithUnknownKeys, annotateExpectedKeys } from '@/service/annotations'
import { PasswordsModule, KeysModule } from '@/store'
import { listUsedKeys, PublicKeyFinder } from '@/service/gpg';
import { asyncPool } from '@/util/async';
import { Trigger } from '@/store/trigger';

export type PasswordFlags = { [relPath: string]: boolean }
export type PasswordKeysMap = { [relPath: string]: string[] }

export interface AnnotationsState {
    decryptable: PasswordFlags
    hasDecryptableChildren: PasswordFlags
    expectedKeys: PasswordKeysMap
    usedKeys: PasswordKeysMap 
    toBeEncryptedWithUnknownKeys: PasswordKeysMap
    encryptedWithUnknownKeys: PasswordKeysMap
    encryptedWithUnexpectedKeys: PasswordKeysMap
    encryptedWithoutExpectedKeys: PasswordKeysMap
}

@Module({ name: 'annotations', namespaced: true })
export default class AnnotationsVuexModule extends VuexModule implements AnnotationsState {
    decryptable: PasswordFlags = {}
    hasDecryptableChildren: PasswordFlags = {}
    expectedKeys: PasswordKeysMap = {}
    usedKeys: PasswordKeysMap = {}
    toBeEncryptedWithUnknownKeys: PasswordKeysMap = {}
    encryptedWithUnknownKeys: PasswordKeysMap = {}
    encryptedWithUnexpectedKeys: PasswordKeysMap = {}
    encryptedWithoutExpectedKeys: PasswordKeysMap = {}

    @Mutation
    @Trigger({ whenChanged: state => [
        state.passwords.tree.value, 
        state.keys.privateKeys.value
    ]})
    annotateFilesAndFoldersThatAreDecryptable() {
        const result = {
            decryptable: {},
            hasDecryptableChildren: {},
        }
        if (PasswordsModule.tree.value && KeysModule.privateKeys.value) {
            annotateDecryptable(PasswordsModule.tree.value, KeysModule.privateKeys.value, false, result)
        }
        this.decryptable = result.decryptable
        this.hasDecryptableChildren = result.hasDecryptableChildren
    }

    @Mutation
    @Trigger({ whenChanged: state => [
        state.passwords.tree.value
    ]})
    annotateFilesAndFoldersWithExpectedKeys() {
        const result = {
            expectedKeys: {}
        }
        if (PasswordsModule.tree.value) {
            annotateExpectedKeys(PasswordsModule.tree.value!, [], result)
        }
        this.expectedKeys = result.expectedKeys
    }

    @Mutation
    @Trigger({ whenChanged: state => [
        state.passwords.tree.value, 
        state.keys.publicKeys.value, 
        state.settings.validation.toBeEncryptedWithUnknownKeys.enable
    ]})
    annotateFilesAndFoldersToBeEncryptedWithUnknownKeys() {
        const toBeEncryptedWithUnknownKeys: PasswordKeysMap = {}

        if (PasswordsModule.tree.value &&
            KeysModule.publicKeys.value &&
            SettingsModule.validation.toBeEncryptedWithUnknownKeys.enable) {

            annotateToBeEncryptedWithUnknownKeys(PasswordsModule.tree.value, KeysModule.publicKeys.value, [], toBeEncryptedWithUnknownKeys)
        }
        this.toBeEncryptedWithUnknownKeys = toBeEncryptedWithUnknownKeys
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
    @Trigger({ timeout: 100, whenChanged: state => [
        state.passwords.list.value,
        state.settings.validation.encryptedWithUnknownKeys.enable ||
        state.settings.validation.encryptedWithUnexpectedKeys.enable ||
        state.settings.validation.encryptedWithoutExpectedKeys.enable
    ]})
    async annotateFilesWithUsedKeys() {
        const usedKeys: PasswordKeysMap = {}

        const needsUsedKeys =
            SettingsModule.validation.encryptedWithUnknownKeys.enable ||
            SettingsModule.validation.encryptedWithUnexpectedKeys.enable ||
            SettingsModule.validation.encryptedWithoutExpectedKeys.enable;
        if (PasswordsModule.list.value && needsUsedKeys) {
            const files = PasswordsModule.list.value.filter(item => !item.folder) as PasswordFile[]
            await asyncPool(files, async file => {
                usedKeys[file.relPath] = await listUsedKeys(file.absPath)
            })
        }
        AnnotationsModule.setUsedKeys(usedKeys)
    }

    @Mutation
    @Trigger({ whenChanged: state => [
        state.passwords.tree.value,
        state.keys.publicKeys.value,
        state.annotations.usedKeys,
        state.settings.validation.encryptedWithUnknownKeys.enable
    ]})
    annotateFilesEncryptedWithUnknownKeys() {
        const encryptedWithUnknownKeys: PasswordKeysMap = {}

        if (PasswordsModule.tree.value &&
            KeysModule.publicKeys.value &&
            AnnotationsModule.usedKeys &&
            SettingsModule.validation.encryptedWithUnknownKeys.enable) {

        console.log('annotateFilesEncryptedWithUnknownKeys2')

            const keyFinder = new PublicKeyFinder(KeysModule.publicKeys.value)
            Object.keys(this.usedKeys).forEach(relPath => {
                const usedKeys = this.usedKeys[relPath]
                const unknownKeys = usedKeys.filter(usedKey => keyFinder.isUnknownKey(usedKey))
                if (unknownKeys.length > 0) {
                    encryptedWithUnknownKeys[relPath] = unknownKeys
                }
            })
            console.log('encryptedWithUnknownKeys', encryptedWithUnknownKeys)
        }
        this.encryptedWithUnknownKeys = encryptedWithUnknownKeys
    }

    @Mutation
    @Trigger({ whenChanged: state => [
        state.passwords.tree.value,
        state.keys.publicKeys.value,
        state.annotations.usedKeys,
        state.settings.validation.encryptedWithUnexpectedKeys.enable
    ]})
    annotateFilesEncryptedWithUnexpectedKeys() {
        if (!KeysModule.publicKeys.value || !SettingsModule.validation.encryptedWithUnexpectedKeys.enable) {
            this.encryptedWithUnexpectedKeys = {}
            return;
        }
        const encryptedWithUnexpectedKeys: PasswordKeysMap = {}

        if (PasswordsModule.tree.value &&
            KeysModule.publicKeys.value &&
            AnnotationsModule.usedKeys &&
            SettingsModule.validation.encryptedWithUnexpectedKeys.enable) {

            const keyFinder = new PublicKeyFinder(KeysModule.publicKeys.value)
            Object.keys(this.usedKeys).forEach(relPath => {
                const knownUsedKeys = this.usedKeys[relPath]
                    .map(usedKey => keyFinder.findMatchingKeyId(usedKey))
                    .filter(key => !!key) as string[]
                const knownExpectedKeys = this.expectedKeys[relPath]
                    .map(expectedKey => keyFinder.findMatchingKeyId(expectedKey))
                    .filter(key => !!key) as string[]
                const unexpectedKeys = difference(knownUsedKeys, knownExpectedKeys)
                if (unexpectedKeys.length > 0) {
                    encryptedWithUnexpectedKeys[relPath] = unexpectedKeys
                }
            })
        }
        this.encryptedWithUnexpectedKeys = encryptedWithUnexpectedKeys
    }

    @Mutation
    @Trigger({ whenChanged: state => [
        state.passwords.tree.value,
        state.keys.publicKeys.value,
        state.annotations.usedKeys,
        state.settings.validation.encryptedWithoutExpectedKeys.enable
    ]})
    annotateFilesEncryptedWithoutExpectedKeys() {
        const encryptedWithoutExpectedKeys: PasswordKeysMap = {}

        if (PasswordsModule.tree.value &&
            KeysModule.publicKeys.value &&
            AnnotationsModule.usedKeys &&
            SettingsModule.validation.encryptedWithoutExpectedKeys.enable) {

            const keyFinder = new PublicKeyFinder(KeysModule.publicKeys.value)
            Object.keys(this.usedKeys).forEach(relPath => {
                const knownUsedKeys = this.usedKeys[relPath]
                  .map(usedKey => keyFinder.findMatchingKeyId(usedKey))
                  .filter(key => !!key) as string[]
                const knownExpectedKeys = this.expectedKeys[relPath]
                  .map(expectedKey => keyFinder.findMatchingKeyId(expectedKey))
                  .filter(key => !!key) as string[]
                const missingExpectedKeys = difference(knownExpectedKeys, knownUsedKeys)
                if (missingExpectedKeys.length > 0) {
                    encryptedWithoutExpectedKeys[relPath] = missingExpectedKeys
                }
            })
        }
        this.encryptedWithoutExpectedKeys = encryptedWithoutExpectedKeys
    }
}