import { Module, VuexModule, Mutation, Action } from '@/store/decorators'
import { PasswordFolder, traverseTree, PasswordNode } from '@/model/tree'
import { readPasswordTree } from '@/service/passwords'
import { ConfigModule, PasswordsModule } from '@/store'

@Module({ name: 'passwords' })
export default class PasswordsVuexModule extends VuexModule {
    tree: PasswordFolder | null = null

    @Mutation({ name: 'config|setRepoPath' })
    repoPathChanged() {
        this.tree = null
    }

    @Mutation({ name: 'passwords|setTree' })
    setTree(tree: PasswordFolder | null) {
        this.tree = tree 
    }

    @Action({ commit: 'passwords|setTree' })
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

    get loadNodes() {
        const tree = this.loadTree
        if (!tree) {
            return null
        }
        const nodes: { [absPath: string]: PasswordNode } = {}
        traverseTree(tree, node => { nodes[node.absPath] = node })
        return nodes;
    }

    get loadParents() {
        const tree = this.loadTree
        if (!tree) {
            return null
        }
        const parents: { [absPath: string]: PasswordNode } = {}
        traverseTree(tree, node => { 
          if (node.folder) {
            node.children.forEach(child => parents[child.absPath] = node)
          }
        })
        return parents; 
    }
}