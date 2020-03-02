import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'

@Module({ name: 'keys' })
export default class KeysVuexModule extends VuexModule {
    publicKeys: string[] = []
    privateKeys: string[] = []

    @Mutation
    setPublicKeys(publicKeys: string[]) {
        this.publicKeys = publicKeys
    }

    @Action({ commit: 'setPublicKeys' })
    async setPublicKeys$(publicKeys: string[]) {
        return publicKeys
    }

    @Mutation
    setPrivateKeys(privateKeys: string[]) {
        this.publicKeys = privateKeys
    }

    @Action({ commit: 'setPrivateKeys' })
    async setPrivateKeys$(privateKeys: string[]) {
        return privateKeys
    }
}