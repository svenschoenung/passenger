import { ConfigModule } from '@/store';
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { KeysModule } from '..';
import { loadPrivateKeys, loadPublicKeys } from '@/service/keys';
import { PublicKey, PrivateKey } from 'gpg-promised';

@Module({ name: 'keys' })
export default class KeysVuexModule extends VuexModule {
    publicKeys: PublicKey[] | null = null
    privateKeys: PrivateKey[] | null = null

    @Mutation
    setPublicKeys(publicKeys: PublicKey[]) {
        this.publicKeys = publicKeys
    }

    @Action({ commit: 'setPublicKeys' })
    async loadPublicKeys$() {
        return await loadPublicKeys(ConfigModule.gpgPath as string)
    }

    @Mutation
    setPrivateKeys(privateKeys: PrivateKey[]) {
        this.privateKeys = privateKeys
    }

    @Action({ commit: 'setPrivateKeys' })
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