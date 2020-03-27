import fs from 'fs'
import git, { ReadCommitResult } from 'isomorphic-git'
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { SettingsModule, RepoModule } from '@/store'
import { Resolvable, resolving, unresolved, resolved, failed } from '@/store/resolvable'
import { delay } from '@/util/dev'

export interface RepoState {
}

@Module({ name: 'repo', namespaced: true })
export default class RepoVuexModule extends VuexModule implements RepoState {
    commits: Resolvable<ReadCommitResult[]> = unresolved()

    @Mutation
    loadingCommitsFromRepo() {
        this.commits = resolving()
    }

    @Mutation
    loadedCommitsFromRepo(commits: Resolvable<ReadCommitResult[]> ) {
        this.commits = commits
    }

    @Action
    async loadCommitsFromRepo() {
        try {
            if (!SettingsModule.repoPath) {
                return
            }
            RepoModule.loadingCommitsFromRepo()
            const commits = await delay(() => git.log({ fs, dir: SettingsModule.repoPath! }))
            RepoModule.loadedCommitsFromRepo(resolved(commits))
        } catch (e) {
            this.loadedCommitsFromRepo(failed(e))
        }
    }
}