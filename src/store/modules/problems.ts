import { AnnotationsModule, SettingsModule } from './../index';
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { PasswordsModule, KeysModule, UIModule } from '@/store'
import { PasswordNode, PasswordFolder } from '@/model/passwords'
import { findMatchingPublicKeys, findUnknownPublicKeys, PublicKeyFinder, unknownKey } from '@/service/gpg'
import { Resolvable } from '../resolvable'
import { GPGKey, GenericKey } from 'gpg-promised'
import { groupBy } from 'lodash';

export type ProblemType = 'error' | 'warning'

export interface ProblemFix {
    label: string,
    action: Function
}

export interface Problem {
    id: string,
    type: ProblemType,
    msg: string,
    node?: PasswordNode,
    error?: Error,
    fixes?: ProblemFix[]
}

export interface ProblemsState {
}

@Module({ name: 'problems', namespaced: true })
export default class ProblemsVuexModule extends VuexModule implements ProblemsState {

    get passwordTreeProblems(): Problem[] {
        if (PasswordsModule.tree.error) {
            return [{
                id: 'passwords',
                type: 'error',
                msg: 'Could not read from password repository',
                error: PasswordsModule.tree.error,
                fixes: [{
                    label: 'Try reloading repository',
                    action: () => {
                        UIModule.setPage('passwords')
                        PasswordsModule.loadPasswordsFromFileSystem()
                    }
                }, {
                    label: 'Change repository location',
                    action: () => {
                        UIModule.setPage('settings')
                        UIModule.setSettingsPage('repo')
                    }
                }]
            }]
        }
        return []
    }

    get publicKeyProblems(): Problem[] {
        return keysProblems('public keys', KeysModule.publicKeys, () => KeysModule.loadPublicKeys)
    }

    get privateKeyProblems(): Problem[] {
        return keysProblems('private keys', KeysModule.privateKeys, () => KeysModule.loadPrivateKeys)
    }

    get toBeEncryptedWithUnknownKeysProblems(): Problem[] {
        if (!PasswordsModule.map.value || !SettingsModule.validation.toBeEncryptedWithUnknownKeys.enable) {
            return []
        }
        return Object.keys(AnnotationsModule.toBeEncryptedWithUnknownKeys)
            .map(relPath => PasswordsModule.map.value![relPath] as PasswordNode)
            .map(folder => {
                const unknownKeys = AnnotationsModule.toBeEncryptedWithUnknownKeys[folder.relPath]
                  .map(k => unknownKey(k, 'pub'))
                return {
                    id: `toBeEncryptedWithUnknownKeys_${folder.relPath}`,
                    type: SettingsModule.validation.toBeEncryptedWithUnknownKeys.type,
                    msg: `Folder requires unknown public key${unknownKeys.length > 1 ? 's': ''} for encryption`,
                    keys: unknownKeys,
                    node: folder 
                }
            })
    }

    get encryptedWithUnknownKeysProblems(): Problem[] {
        if (!PasswordsModule.map.value || !SettingsModule.validation.encryptedWithUnknownKeys.enable) {
            return []
        }
        return Object.keys(AnnotationsModule.encryptedWithUnknownKeys)
            .map(relPath => PasswordsModule.map.value![relPath] as PasswordNode)
            .filter(node => node && !node.folder)
            .map(file => {
                const unknownKeys = AnnotationsModule.encryptedWithUnknownKeys[file.relPath]
                  .map(k => unknownKey(k, 'pub'))
                return {
                    id: `encrytpedWithUnknownKeys_${file.relPath}`,
                    type: SettingsModule.validation.encryptedWithUnknownKeys.type,
                    msg: `File was encrypted with unknown public key${unknownKeys.length > 1 ? 's': ''}`,
                    keys: unknownKeys,
                    node: file 
                }
            })
    }

    get encryptedWithUnexpectedKeysProblems(): Problem[] {
        if (!PasswordsModule.map.value || !SettingsModule.validation.encryptedWithUnexpectedKeys.enable) {
            return []
        }
        const keyFinder = new PublicKeyFinder(KeysModule.publicKeys.value || [])
        return Object.keys(AnnotationsModule.encryptedWithUnexpectedKeys)
            .map(relPath => PasswordsModule.map.value![relPath] as PasswordNode)
            .filter(node => node && !node.folder)
            .map(file => {
                const unintendedKeys = AnnotationsModule.encryptedWithUnexpectedKeys[file.relPath]
                  .map(key => keyFinder.findMatchingKey(key))
                return {
                    id: `encryptedWithUnexpectedKeys_${file.relPath}`,
                    type: SettingsModule.validation.encryptedWithUnexpectedKeys.type,
                    msg: `File was encrypted with unexpected key${unintendedKeys.length > 1 ? 's': ''}`,
                    keys: unintendedKeys,
                    node: file 
                }
            })
    }

    get encryptedWithoutExpectedKeysProblems(): Problem[] {
        if (!PasswordsModule.map.value || !SettingsModule.validation.encryptedWithoutExpectedKeys.enable) {
            return []
        }
        const keyFinder = new PublicKeyFinder(KeysModule.publicKeys.value || [])
        return Object.keys(AnnotationsModule.encryptedWithoutExpectedKeys)
            .map(relPath => PasswordsModule.map.value![relPath] as PasswordNode)
            .filter(node => node && !node.folder)
            .map(file => {
                const missingExpectedKeys = AnnotationsModule.encryptedWithoutExpectedKeys[file.relPath]
                  .map(key => keyFinder.findMatchingKey(key))
                return {
                    id: `encryptedWithoutExpectedKeys_${file.relPath}`,
                    type: SettingsModule.validation.encryptedWithoutExpectedKeys.type,
                    msg: `File was encrypted without expected key${missingExpectedKeys.length > 1 ? 's': ''}`,
                    keys: missingExpectedKeys,
                    node: file 
                }
            })
    }

    get problems() {
        return [
            ...this.passwordTreeProblems,
            ...this.publicKeyProblems,
            ...this.privateKeyProblems,
            ...this.toBeEncryptedWithUnknownKeysProblems,
            ...this.encryptedWithUnknownKeysProblems,
            ...this.encryptedWithUnexpectedKeysProblems,
            ...this.encryptedWithoutExpectedKeysProblems
        ].sort((p1, p2) => {
            if (p1.type !== p2.type) {
                return p1.type === 'error' ? -1 : 1
            }
            return (p1.node?.relPath || '').localeCompare(p2.node?.relPath || '')
        })
    }


    get errors() {
        return this.problems.filter(problem => problem.type === 'error')
    }

    get warnings() {
        return this.problems.filter(problem => problem.type === 'warning')
    }

    get errorCount() {
        return this.errors.length
    }

    get warningCount() {
        return this.warnings.length
    }

    get errorsByPath() {
        const errorsWithPath = this.errors.filter(error => error.node)
        return groupBy(errorsWithPath, error => error.node?.relPath)
    }

    get warningsByPath() {
        const warningsWithPath = this.warnings.filter(warning => warning.node)
        return groupBy(warningsWithPath, warning => warning.node?.relPath)
    }
}

function keysProblems<K extends GenericKey[]>(keyType: string, keys: Resolvable<K>, action: () => void) {
    if (keys.error) {
        return [{
            id: 'passwords',
            type: 'error' as ProblemType,
            msg: `Could not load ${keyType}`,
            error: keys.error,
            fixes: [{
                label: `Try reloading ${keyType}`,
                action: () => {
                    UIModule.setPage('keys')
                }
            }, {
                label: 'Change GPG homedir location',
                action: () => {
                    UIModule.setPage('settings')
                    UIModule.setSettingsPage('keys')
                }
            }]
        }]
    }
    return []
}