import { PublicKey, PrivateKey } from 'gpg-promised';
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'

import { SettingsModule } from '@/store';
import { loadPrivateKeys, loadPublicKeys, deletePublicKey } from '@/service/gpg';
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
    setPublicKeys(publicKeys: Resolvable<PublicKey[]>) {
        this.publicKeys = publicKeys
    }

    @Action
    async loadPublicKeys() {
        try {
            this.loadingPublicKeys()
            const publicKeys = await delay(() => loadPublicKeys({ homedir: SettingsModule.gpgPath }))
            this.setPublicKeys(resolved(publicKeys))
        } catch (error) {
            this.setPublicKeys(failed(error))
        }
    }

    @Mutation
    loadingPrivateKeys() {
        this.privateKeys = resolving()
    }

    @Mutation
    setPrivateKeys(privateKeys: Resolvable<PrivateKey[]>) {
        this.privateKeys = privateKeys
    }

    @Action
    async loadPrivateKeys() {
        try {
            this.loadingPrivateKeys()
            const privateKeys = await delay(() => loadPrivateKeys({ homedir: SettingsModule.gpgPath }))
            this.setPrivateKeys(resolved(privateKeys))
        } catch (error) {
            this.setPrivateKeys(failed(error))
        }
    }

    @Action
    async deletePublicKeys(keys: PublicKey[]) {
        if (!this.publicKeys.value) {
            return
        }
        const deleted: { [keyid: string]: boolean } = {} 
        for (const i in keys) {
            try {
                await delay(() => deletePublicKey(keys[i], { homedir: SettingsModule.gpgPath }))
                deleted[keys[i].keyid] = true
            } catch (error) {
                console.log(error)
            } 
        }
        this.setPublicKeys(resolved(this.publicKeys.value.filter(key => !deleted[key.keyid])))
    }
}