<template>
  <div class="column content-height">
    <div class="row flex-grow">
      <key-list class="col q-pa-md" title="Public keys" :keys="publicKeys"/>
      <key-list class="col q-pa-md" title="Private keys" :keys="privateKeys"/>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { KeysModule } from '@/store'

@Component({})
export default class KeysPage extends Vue {

  get publicKeys() {
    return KeysModule.publicKeys
  }

  get privateKeys() {
    return KeysModule.privateKeys
  }
}
</script>

<style lang="scss" scoped>
</style>