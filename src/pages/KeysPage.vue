<template>
  <div class="column" :style="{ height: `calc(100vh - ${footerHeight}px`}">
    <div class="row flex-grow">
      <key-list class="col q-pa-md" title="Public keys" :keys="publicKeys"/>
      <key-list class="col q-pa-md" title="Private keys" :keys="privateKeys"/>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { KeysModule } from '@/store'
import { FOOTER_HEIGHT } from "@/constants";

@Component({})
export default class KeysPage extends Vue {
  footerHeight = FOOTER_HEIGHT

  get publicKeys() {
    return KeysModule.loadPublicKeys
  }

  get privateKeys() {
    return KeysModule.loadPrivateKeys
  }
}
</script>

<style lang="scss" scoped>
</style>