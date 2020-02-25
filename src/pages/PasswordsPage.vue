<template>
    <q-splitter v-model="treePaneWidthInPercent" style="height: calc(100vh - 30px)">
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

@Component({
  name: 'passwords-page',
  components: {
  },
})
export default class PasswordsPage extends Vue {
    treePaneWidthInPercent = 30
}
</script>

<style lang="scss" scoped>
</style>