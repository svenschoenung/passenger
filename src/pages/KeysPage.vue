<template>
  <div class="column content-height">
    <vue-headful title="Passenger: GPG-Keys" />
    <div class="row flex-grow">
      <key-list class="col q-pa-md" title="Public keys" :keys="publicKeys" @refresh="refreshPublicKeys"/>
      <key-list class="col q-pa-md" title="Private keys" :keys="privateKeys" @refresh="refreshPrivateKeys"/>
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

  refreshPublicKeys() {
    KeysModule.loadPublicKeys()
  }

  refreshPrivateKeys() {
    KeysModule.loadPrivateKeys()
  }
}
</script>

<style lang="scss" scoped>
</style>