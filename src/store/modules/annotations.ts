import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'

import { annotateDecryptable, annotateNotEncryptable } from '@/service/annotations'
import { PasswordsModule, KeysModule } from '@/store'

export type PasswordFlags = { [relPath: string]: boolean }

export interface AnnotationsState {
    decryptable: PasswordFlags
    decryptableChildren: PasswordFlags
    notEncryptable: PasswordFlags
}

@Module({ name: 'annotations', namespaced: true })
export default class AnnotationsVuexModule extends VuexModule implements AnnotationsState {
    decryptable: PasswordFlags = {}
    decryptableChildren: PasswordFlags = {}
    notEncryptable: PasswordFlags = {}

    @Mutation
    clearAnnotations() {
        this.decryptable = {}
        this.decryptableChildren = {}
    }

    @Mutation
    annotatePasswordsUsingPrivateKeys() {
        if (PasswordsModule.tree.value && KeysModule.privateKeys.value) {
            this.decryptable = {}
            this.decryptableChildren = {}
            annotateDecryptable(PasswordsModule.tree.value, KeysModule.privateKeys.value, false,
                this.decryptable, this.decryptableChildren)
        }
    }

    @Mutation
    annotatePasswordsUsingPublicKeys() {
        if (PasswordsModule.tree.value && KeysModule.publicKeys.value) {
            this.notEncryptable = {}
            annotateNotEncryptable(PasswordsModule.tree.value, KeysModule.publicKeys.value, false, this.notEncryptable)
        }
    }
}