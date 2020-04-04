<template>
    <div class="q-pa-md column content-height">
      <vue-headful title="Passenger: Problems" />
        <problems-count :chip="true" class="q-mb-sm"/>
        <q-list bordered class="flex flex-grow bg-1">
            <q-scroll-area class="flex-grow">
                <template v-for="problem in problems" >
                <q-item :class="`problem-${problem.type}`" :key="`item-${problem.id}`">
                    <q-item-section avatar>
                        <q-icon :name="icons[problem.type]" size="md"/>
                    </q-item-section>
                    <q-item-section>
                        <q-item-label>{{problem.msg}}</q-item-label>
                        <q-item-label v-if="problem.error">
                            <i>{{problem.error.message}}</i>
                        </q-item-label>
                        <q-item-label v-for="key in problem.keys" :key="key.keyid">
                            <b class="q-mr-xs">Key:</b> {{key.keyid}}
                            <span v-if="key.uid && key.uid[0] && key.uid[0].user_id">
                                [{{key.uid[0].user_id}}<span v-if="key.uid.length > 1"> ...</span>]
                            </span>
                        </q-item-label>
                        <q-item-label v-if="problem.node">
                            <b class="q-mr-xs">{{problem.node.folder ? 'Folder' : 'File'}}:</b> <a @click.stop="goto(problem.node.relPath)">{{problem.node.fullName}}</a>
                        </q-item-label>
                        <q-item-label v-for="fix in problem.fixes" :key="fix.label">
                            <b class="q-mr-xs">Fix:</b> <a @click.stop="fix.action">{{fix.label}}</a>
                        </q-item-label>
                    </q-item-section>
                </q-item>
                <q-separator :key="`separator-${problem.id}`"/>
                </template>
            </q-scroll-area>
        </q-list>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import { ProblemsModule, UIModule } from '@/store'
import { setNonReactiveProps } from '@/util/props'
import icons from '@/ui/icons'

@Component({})
export default class ProblemsPage extends Vue {
    created() {
        setNonReactiveProps(this, { icons })
    } 

    get problems() {
        return ProblemsModule.problems
    }

    goto(relPath: string) {
        UIModule.gotoPasswordPath(relPath)
    }
}
</script>

<style lang="scss" scoped>
@import "src/styles/style.variables.scss";

.problem-error {
    background: $bg-neg;
    color: $negative;
}

.problem-warning {
    background: $bg-warn;
    color: $warning;
}

a {
    text-decoration: underline;
    cursor: pointer;
}
</style>