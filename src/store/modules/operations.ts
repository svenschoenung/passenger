import { PublicKey, PrivateKey } from 'gpg-promised';
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'

import { Resolvable, unresolved, resolving, resolved, failed } from '@/store/resolvable';

export interface Operation {
    name: string,
    action: string
    started: Date
}

export interface OperationsState {
    runningOperations: Operation[]
}

const OPERATION_NAMES: { [action: string]: string } = {
    'passwords/loadPasswordsFromFileSystem': 'Loading passwords from file system',
    'keys/loadPublicKeys': 'Loading public keys from GPG',
    'keys/loadPrivateKeys': 'Loading private keys from GPG',
    'annotations/annotateFilesWithUsedKeys': 'Determining used keys'
}

@Module({ name: 'operations', namespaced: true })
export default class OperationsVuexModule extends VuexModule implements OperationsState {
    runningOperations: Operation[] = []

    @Mutation
    addRunningOperation(action: any) {
        this.runningOperations.push({ 
            action,
            name: OPERATION_NAMES[action.type],
            started: new Date()
        })
    }

    @Mutation
    removeRunningOperation(action: string) {
        const index = this.runningOperations.findIndex(o => o.action = action)
        if (index >= 0) {
            this.runningOperations.splice(index, 1);
        }
    }
}