<template>
    <div class="column content-height">
        <vue-headful title="Passenger: Version Control" />
        <div class="row flex-grow q-pa-md">
            <q-list bordered class="flex flex-grow bg-1 commit-log">
                <centered-progress v-if="commits.resolving" class="flex-grow"/>
                <centered-error v-if="commits.error" :error="keys.error" class="flex-grow"/>
                <styled-scrollbar v-else-if="commits.success">
                    <template v-for="commit in commits.value">
                        <q-item clickable v-ripple :key="commit.oid" class="commit">
                            <q-item-section avatar>
                                <q-avatar color="primary">
                                    <q-icon v-if="commit.commit.parent.length > 1" :name="icons.mergeCommit" size="sm"/>
                                    <q-icon v-else :name="icons.commit" size="md" style="transform: rotate(90deg);"/>
                                </q-avatar>
                            </q-item-section>
                            <q-item-section>
                                <q-item-label class="commit-id">Commit {{commit.oid}}</q-item-label>
                                <q-item-label class="commit-metadata"><b>Author:</b> {{commit.commit.author.name}}&lt;{{commit.commit.author.email}}&gt;</q-item-label>
                                <q-item-label class="commit-metadata"><b>Date:</b> {{commit.commit.author.timestamp}}</q-item-label>
                                <q-item-label class="commit-message">{{commit.commit.message}}</q-item-label>
                            </q-item-section>
                        </q-item>
                        <q-separator :key="`separator-${commit.oid}`"/>
                    </template>
                </styled-scrollbar>
            </q-list>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { RepoModule } from '../store'
import { setNonReactiveProps } from '../util/props'
import icons from '@/ui/icons'

@Component({})
export default class RepoPage extends Vue {
    created() {
        setNonReactiveProps(this, { icons })
    }

    get commits() {
        return RepoModule.commits
    }
}
</script>

<style lang="scss">
.commit-log {
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
}
</style>