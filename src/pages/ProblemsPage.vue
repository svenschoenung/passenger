<template>
    <div class="q-pa-md column content-height">
      <vue-headful title="Passenger: Problems" />
        <problems-count :chip="true" class="q-mb-sm"/>
        <q-list bordered class="flex flex-grow bg-1">
            <q-scroll-area class="flex-grow">
                <template v-for="problem in problems" >
                <q-item :class="`problem-${problem.type}`" :key="`item-${problem.id}`">
                    <q-item-section avatar>
                        <q-icon :name="icons[problem.type]"/>
                    </q-item-section>
                    <q-item-section>
                        <div>{{problem.msg}}</div>
                        <div v-if="problem.node">
                            <b class="q-mr-xs">Location:</b> <a @click.stop="goto(problem.node.relPath)">{{problem.node.fullName}}</a>
                        </div>
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
        UIModule.setPage('passwords')
        Vue.nextTick(() => UIModule.selectPasswordPath(relPath))
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