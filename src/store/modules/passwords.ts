import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { PasswordFolder } from '@/model/tree'
import { RepoModule } from './../index'
import { readPasswordTree } from '@/service/repo'

@Module({ name: 'passwords' })
export default class PasswordsVuexModule extends VuexModule {
    tree: PasswordFolder | null = null

    @Mutation
    changeTree(tree: PasswordFolder) {
        this.tree = tree 
    }

    @Action({ commit: 'changeTree' })
    async loadTree$() {
        try {
           return await readPasswordTree(RepoModule.location);
        } catch (e) {
            console.log(e)
        }
    }
}