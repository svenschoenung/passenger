import { AnnotationsModule } from './../index';
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { PasswordsModule, KeysModule, UIModule } from '@/store'
import { PasswordNode, PasswordFolder } from '@/model/passwords'
import { findMatchingPublicKeys, findUnknownPublicKeys, PublicKeyFinder, unknownKey } from '@/service/gpg'
import { Resolvable } from '../resolvable'
import { GPGKey, GenericKey } from 'gpg-promised'

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

    get toBeEncryptedWithUnknownKeysProblems(): Problem[] {
        if (!PasswordsModule.map.value) {
            return []
        }
        return Object.keys(AnnotationsModule.toBeEncryptedWithUnknownKeys)
            .map(relPath => PasswordsModule.map.value![relPath] as PasswordNode)
            .filter(node => node && node.folder)
            .map(folder => {
                const unknownKeys = AnnotationsModule.toBeEncryptedWithUnknownKeys[folder.relPath]
                  .map(k => unknownKey(k, 'pub'))
                return {
                    id: `toBeEncryptedWithUnknownKeys_${folder.relPath}`,
                    type: 'error',
                    msg: `Folder requires unknown public key${unknownKeys.length > 1 ? 's': ''} for encryption`,
                    keys: unknownKeys,
                    node: folder 
                }
            })
    }

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

    get encryptedWithUnknownKeysProblems(): Problem[] {
        if (!PasswordsModule.map.value) {
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
                    type: 'warning',
                    msg: `File was encrypted with unknown public key${unknownKeys.length > 1 ? 's': ''}`,
                    keys: unknownKeys,
                    node: file 
                }
            })
    }

    get encryptedWithUnintendedKeysProblems(): Problem[] {
        if (!PasswordsModule.map.value) {
            return []
        }
        const keyFinder = new PublicKeyFinder(KeysModule.publicKeys.value || [])
        return Object.keys(AnnotationsModule.encryptedWithUnintendedKeys)
            .map(relPath => PasswordsModule.map.value![relPath] as PasswordNode)
            .filter(node => node && !node.folder)
            .map(file => {
                const unintendedKeys = AnnotationsModule.encryptedWithUnintendedKeys[file.relPath]
                  .map(key => keyFinder.findMatchingKey(key))
                return {
                    id: `encryptedWithUnintendedKeys_${file.relPath}`,
                    type: 'warning',
                    msg: `File was encrypted with unexpected key${unintendedKeys.length > 1 ? 's': ''}`,
                    keys: unintendedKeys,
                    node: file 
                }
            })
    }


    get encryptedWithoutIntendedKeysProblems(): Problem[] {
        if (!PasswordsModule.map.value) {
            return []
        }
        const keyFinder = new PublicKeyFinder(KeysModule.publicKeys.value || [])
        return Object.keys(AnnotationsModule.encryptedWithoutIntendedKeys)
            .map(relPath => PasswordsModule.map.value![relPath] as PasswordNode)
            .filter(node => node && !node.folder)
            .map(file => {
                const missingIntendedKeys = AnnotationsModule.encryptedWithoutIntendedKeys[file.relPath]
                  .map(key => keyFinder.findMatchingKey(key))
                return {
                    id: `encryptedWithoutIntendedKeys_${file.relPath}`,
                    type: 'warning',
                    msg: `File was encrypted without expected key${missingIntendedKeys.length > 1 ? 's': ''}`,
                    keys: missingIntendedKeys,
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
            ...this.encryptedWithUnintendedKeysProblems,
            ...this.encryptedWithoutIntendedKeysProblems
        ].sort((p1, p2) => {
            if (p1.type !== p2.type) {
                return p1.type === 'error' ? -1 : 1
            }
            return (p1.node?.relPath || '').localeCompare(p2.node?.relPath || '')
        })
    }

    get errorCount() {
        return count(this.problems, 'error')
    }

    get warningCount() {
        return count(this.problems, 'warning')
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

function count(problems: Problem[], type: ProblemType) {
    return problems.filter(problem => problem.type === type).length
}
