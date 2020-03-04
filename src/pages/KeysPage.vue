<template>
  <div class="column" :style="{ height: `calc(100vh - ${footerHeight}px`}">
    <div class="row flex-grow">
      <keys-list class="col q-pa-md" title="Public keys" :keys="publicKeys"/>
      <keys-list class="col q-pa-md" title="Private keys" :keys="privateKeys"/>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { KeysModule } from '@/store'
import KeysList from '@/components/KeysList.vue'
import { FOOTER_HEIGHT } from "@/constants";

@Component({
  name: 'keys-page',
  components: {
    KeysList
  },
})
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