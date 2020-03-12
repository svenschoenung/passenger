<template>
  <q-splitter id="passwords-page" class="content-height"
     v-model="overviewWidthInPx" unit="px">
    <template v-slot:before>
      <password-overview/>
    </template>
    <template v-slot:after>
      <centered-progress v-if="selectedPasswordNode.resolving"/>
      <password-folder-details v-else-if="selectedPasswordNode.value && selectedPasswordNode.value.folder"
        :folder="selectedPasswordNode.value" :key="selectedPasswordNode.value.relPath"
      />
    </template>
  </q-splitter>
</template>

<script lang="ts">
import { Component, Vue, Ref } from "vue-property-decorator";

import { PasswordsModule, UIModule } from '@/store';
import { setNonReactiveProps, initNonReactiveProp, removeNonReactiveProp } from '@/util/props';

@Component({})
export default class PasswordsPage extends Vue {

  get selectedPasswordNode() {
    return PasswordsModule.selectedPasswordNode
  }

  get overviewWidthInPx() {
    return UIModule.passwordOverviewWidthInPx
  }

  set overviewWidthInPx(overviewWidthInPx: number) {
    UIModule.setPasswordOverviewWidthInPx(overviewWidthInPx)
  }
}
</script>

<style lang="scss">
#passwords-page {
  .q-splitter__panel.q-splitter__before {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }

  .q-splitter__panel.q-splitter__after {
    display: flex;
  }
}
</style>