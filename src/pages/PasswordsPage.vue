<template>
    <q-splitter v-model="treePaneWidthInPercent" v-bind:style="{ height: `calc(100vh - ${footerHeight}px`}">
        <template v-slot:before>
        Selected: {{selected}}
             <q-tree
                :nodes="passwordsTree"
                :icon="arrow"
                default-expand-all
                node-key="absPath"
                label-key="name"
                @update:selected="selectedInTree"
                :selected.sync="selected"
            />
        </template>
        <template v-slot:after>
            Passwords
        </template>
    </q-splitter>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { FOOTER_HEIGHT } from '@/constants'
import { PasswordsModule } from '../store'

import { ionIosPlay } from '@quasar/extras/ionicons-v4'

@Component({
  name: 'passwords-page',
  components: {
  },
})
export default class PasswordsPage extends Vue {
    footerHeight = FOOTER_HEIGHT
    treePaneWidthInPercent = 30

    set selected(key: string) {
        console.log('key', key)
    }

    get selected() {
        return '/Users/sven/.password-store/elexico'
    }

    created() {
        (this as any).arrow = ionIosPlay;
    }

    get passwordsTree() {
       return PasswordsModule.tree && PasswordsModule.tree.children
    }

    selectedInTree(key: string) {
        console.log(key)
    }
}
</script>

<style lang="scss" scoped>
</style>