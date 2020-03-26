import { AnnotationsModule } from './../index';
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { PasswordsModule, KeysModule, UIModule } from '@/store'
import { PasswordNode, PasswordFolder } from '@/model/passwords'
import { findMatchingPublicKeys, findMissingPublicKeys } from '@/service/gpg'
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

    get unknownKeyProblems(): Problem[] {
        if (!PasswordsModule.map.value) {
            return []
        }
        return Object.keys(AnnotationsModule.notEncryptable)
            .filter(relPath => AnnotationsModule.notEncryptable[relPath])
            .map(relPath => PasswordsModule.map.value![relPath] as PasswordNode)
            .filter(node => node && node.folder)
            .map(folder => {
                const keys = (folder as PasswordFolder).keys
                const missingKeys = findMissingPublicKeys(keys, KeysModule.publicKeys.value!)
                  .map(key => key.keyid)
                return {
                    id: `unknownKey_${folder.relPath}`,
                    type: 'error',
                    msg: `Unknown public key${missingKeys.length > 1 ? 's': ''}: ${missingKeys.join(', ')}`,
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

    get problems() {
        return [
            ...this.unknownKeyProblems,
            ...this.passwordTreeProblems,
            ...this.publicKeyProblems,
            ...this.privateKeyProblems
        ]
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
