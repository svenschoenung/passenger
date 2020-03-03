import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { PasswordFolder } from '@/model/tree'
import { readPasswordTree } from '@/service/passwords'
import { ConfigModule, PasswordsModule } from '@/store'

@Module({ name: 'passwords' })
export default class PasswordsVuexModule extends VuexModule {
  loadKeys$() {
    throw new Error("Method not implemented.")
  }
    tree: PasswordFolder | null = null

    @Mutation
    changeTree(tree: PasswordFolder | null) {
        this.tree = tree 
    }

    @Mutation
    changeRepoPath() {
        this.tree = null
    }

    @Action({ commit: 'changeTree' })
    async loadTree$() {
        try {
           return await readPasswordTree(ConfigModule.repoPath as string);
        } catch (e) {
            console.log(e)
        }
    }

    get loadTree() {
        if (this.tree && this.tree.children) {
            return this.tree;
        }
        PasswordsModule.loadTree$()
        return null
    }
}