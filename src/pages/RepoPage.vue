<template>
    <div class="column content-height repo-page">
        <vue-headful title="Passenger: Version Control" />
        <div class="flex direction-column flex-grow q-pa-md">
            <q-toolbar dense class="q-pa-none">
                Commit Log
                <q-chip dense color="primary">{{commits.value ? commits.value.length : 0}}</q-chip>
                <q-btn flat dense @click="refresh"><q-icon :name="icons.refresh" size="xs"/></q-btn>
                <q-space/>
                <q-btn size="sm" flat class="menu-button">
                    <q-icon :name="icons.menu" size="sm"/>
                    <q-menu anchor="bottom right" self="top right">
                        <q-list dense style="width: 200px" v-roving-tabindex-container>
                            <q-item clickable v-close-popup v-roving-tabindex>
                                <q-item-section>
                                    <q-checkbox dense size="xs" v-model="showAuthor" label="Show author"/>
                                </q-item-section>
                            </q-item>
                            <q-item clickable v-close-popup v-roving-tabindex>
                                <q-item-section>
                                    <q-checkbox dense size="xs" v-model="showAuthorDate" label="Show author date"/>
                                </q-item-section>
                            </q-item>
                            <q-item clickable v-close-popup v-roving-tabindex>
                                <q-item-section>
                                    <q-checkbox dense size="xs" v-model="showCommitter" label="Show committer"/>
                                </q-item-section>
                            </q-item>
                            <q-item clickable v-close-popup v-roving-tabindex>
                                <q-item-section>
                                    <q-checkbox dense size="xs" v-model="showCommitterDate" label="Show committer date"/>
                                </q-item-section>
                            </q-item>
                            <q-separator/>
                            <q-item clickable v-close-popup v-roving-tabindex>
                                <q-item-section>
                                    <q-checkbox dense size="xs" v-model="showMergeCommits" label="Show merge commits"/>
                                </q-item-section>
                            </q-item>
                            <q-separator/>
                        </q-list>
                    </q-menu>
                </q-btn>
            </q-toolbar>
            <q-list bordered class="flex flex-grow bg-1 commit-log">
                <centered-progress v-if="commits.resolving" class="flex-grow"/>
                <centered-error v-if="commits.error" :error="keys.error" class="flex-grow"/>
                <DynamicScroller v-else-if="commits.success"
                  :items="commits.value"
                  :min-item-size="150"
                  key-field="oid"
                  class="styled-scrollbar commit-log-scrollbar">
                    <template v-slot="{ item, index, active }">
                        <DynamicScrollerItem :item="item" :data-index="index" :active="active"
                            :size-dependencies="[ showAuthor, showAuthorDate, showCommitter, showCommitterDate ]">
                            <q-item clickable v-ripple :key="item.oid" class="commit">
                                <q-item-section avatar>
                                    <q-avatar color="primary">
                                        <q-icon v-if="item.commit.parent.length > 1" :name="icons.mergeCommit" size="sm" class="merge-commit-icon"/>
                                        <q-icon v-else :name="icons.commit" size="md" class="commit-icon"/>
                                    </q-avatar>
                                </q-item-section>
                                <q-item-section>
                                    <q-item-label class="commit-id">Commit {{item.oid}}</q-item-label>
                                    <q-item-label class="commit-metadata" v-if="showAuthor"><b>Author:</b> {{item.commit.author.name}} &lt;{{item.commit.author.email}}&gt;</q-item-label>
                                    <q-item-label class="commit-metadata" v-if="showAuthorDate"><b>Author date:</b> {{item.commit.author.timestamp | timestamp-to-iso-date}}</q-item-label>
                                    <q-item-label class="commit-metadata" v-if="showCommitter"><b>Committer:</b> {{item.commit.committer.name}} &lt;{{item.commit.committer.email}}&gt;</q-item-label>
                                    <q-item-label class="commit-metadata" v-if="showCommitterDate"><b>Comitter date:</b> {{item.commit.committer.timestamp | timestamp-to-iso-date}}</q-item-label>
    
                                    <q-item-label class="commit-message">{{item.commit.message}}</q-item-label>
                                </q-item-section>
                            </q-item>
                            <q-separator :key="`separator-${item.oid}`"/>
                        </DynamicScrollerItem>
                    </template>
                </DynamicScroller>
            </q-list>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { RepoModule, PreferencesModule } from '../store'
import { setNonReactiveProps } from '../util/props'
import icons from '@/ui/icons'
import { resolvable, Resolvable } from '@/store/resolvable'
import { ReadCommitResult } from 'isomorphic-git'

@Component({})
export default class RepoPage extends Vue {

    created() {
        setNonReactiveProps(this, { icons })
    }

    get showAuthor() {
        return PreferencesModule.showAuthor
    }

    set showAuthor(showAuthor: boolean) {
        PreferencesModule.setShowAuthor(showAuthor)
    }

    get showAuthorDate() {
        return PreferencesModule.showAuthorDate
    }

    set showAuthorDate(showAuthorDate: boolean) {
        PreferencesModule.setShowAuthorDate(showAuthorDate)
    }

    get showCommitter() {
        return PreferencesModule.showCommitter
    }

    set showCommitter(showCommitter: boolean) {
        PreferencesModule.setShowCommitter(showCommitter)
    }

    get showCommitterDate() {
        return PreferencesModule.showCommitterDate
    }

    set showCommitterDate(showCommitterDate: boolean) {
        PreferencesModule.setShowCommitterDate(showCommitterDate)
    }

    get showMergeCommits() {
        return PreferencesModule.showMergeCommits
    }

    set showMergeCommits(showMergeCommits: boolean) {
        PreferencesModule.setShowMergeCommits(showMergeCommits)
    }

    get commits(): Resolvable<ReadCommitResult[]> {
        if (this.showMergeCommits || !RepoModule.commits.value) {
            return RepoModule.commits
        } 
        const commits = RepoModule.commits.value.filter(c => c.commit.parent.length <= 1)
        return resolvable(RepoModule.commits, commits)
    }

    refresh() {
        RepoModule.loadCommitsFromRepo()
    }
}
</script>

<style lang="scss">
@import "src/styles/style.variables.scss";

.commit-log {
    position:relative; 

    .commit-log-scrollbar {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
    }

    .commit-id {
        font-weight: bold;
        margin-top: 10px;
    }

    .commit-metadata {
        font-size: 80%;
    }

    .commit-message {
        margin: 10px 0px;
    }

    .merge-commit-icon {
        margin-left:5px;
    }

    .commit-icon {
        transform: rotate(90deg);
    }
}
</style>