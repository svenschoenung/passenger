import { PublicKey, PrivateKey } from 'gpg-promised';
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'

import { ConfigModule } from '@/store';
import { loadPrivateKeys, loadPublicKeys } from '@/service/keys';
import { Resolvable, unresolved, resolving, resolved, failed } from '@/store/resolvable';
import { delay } from '@/util/dev';

export interface KeysState {
    publicKeys: Resolvable<PublicKey[]>
    privateKeys: Resolvable<PrivateKey[]>
}

@Module({ name: 'keys', namespaced: true })
export default class KeysVuexModule extends VuexModule implements KeysState {
    publicKeys: Resolvable<PublicKey[]> = unresolved()
    privateKeys: Resolvable<PrivateKey[]> = unresolved()

    @Mutation
    loadingPublicKeys() {
        this.publicKeys = resolving()
    }

    @Mutation
    loadedPublicKeys(publicKeys: Resolvable<PublicKey[]>) {
        this.publicKeys = publicKeys
    }

    @Action
    async loadPublicKeys() {
        try {
            this.loadingPublicKeys()
            const publicKeys = await delay(() => loadPublicKeys(ConfigModule.gpgPath as string))
            this.loadedPublicKeys(resolved(publicKeys))
        } catch (error) {
            this.loadedPublicKeys(failed(error))
        }
    }

    @Mutation
    loadingPrivateKeys() {
        this.privateKeys = resolving()
    }

    @Mutation
    loadedPrivateKeys(privateKeys: Resolvable<PrivateKey[]>) {
        this.privateKeys = privateKeys
    }

    @Action
    async loadPrivateKeys() {
        try {
            this.loadingPrivateKeys()
            const privateKeys = await delay(() => loadPrivateKeys(ConfigModule.gpgPath as string))
            this.loadedPrivateKeys(resolved(privateKeys))
        } catch (error) {
            this.loadedPrivateKeys(failed(error))
        }
    }
}