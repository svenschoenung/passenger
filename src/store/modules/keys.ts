import { PublicKey, PrivateKey } from 'gpg-promised';

import { ConfigModule, KeysModule } from '@/store';
import { Module, VuexModule, Mutation, Action } from '@/store/decorators'
import { loadPrivateKeys, loadPublicKeys } from '@/service/keys';

@Module({ name: 'keys' })
export default class KeysVuexModule extends VuexModule {
    publicKeys: PublicKey[] | null = null
    privateKeys: PrivateKey[] | null = null

    @Mutation({ name: 'keys|setPublicKeys' })
    setPublicKeys(publicKeys: PublicKey[]) {
        this.publicKeys = publicKeys
    }

    @Action({ commit: 'keys|setPublicKeys' })
    async loadPublicKeys$() {
        return await loadPublicKeys(ConfigModule.gpgPath as string)
    }

    @Mutation({ name: 'keys|setPrivateKeys' })
    setPrivateKeys(privateKeys: PrivateKey[]) {
        this.privateKeys = privateKeys
    }

    @Action({ commit: 'keys|setPrivateKeys' })
    async loadPrivateKeys$() {
        return await loadPrivateKeys(ConfigModule.gpgPath as string)
    }

    get loadPrivateKeys() {
        if (this.privateKeys) {
            return this.privateKeys
        } 
        KeysModule.loadPrivateKeys$()
        return null
    }

    get loadPublicKeys() {
        if (this.publicKeys) {
            return this.publicKeys
        } 
        KeysModule.loadPublicKeys$()
        return null
    }
}