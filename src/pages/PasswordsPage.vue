<template>
    <q-splitter v-model="treePaneWidthInPercent" v-bind:style="{ height: `calc(100vh - ${footerHeight}px`}">
        <template v-slot:before>
            Tree
        </template>
        <template v-slot:after>
            Passwords
        </template>
    </q-splitter>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { FOOTER_HEIGHT } from '@/constants'

@Component({
  name: 'passwords-page',
  components: {
  },
})
export default class PasswordsPage extends Vue {
    footerHeight = FOOTER_HEIGHT
    treePaneWidthInPercent = 30
}
</script>

<style lang="scss" scoped>
</style>