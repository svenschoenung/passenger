<template>
  <q-splitter id="passwords-page" class="content-height"
     v-model="overviewWidthInPx" unit="px">
    <template v-slot:before>
      <password-tree/>
    </template>
    <template v-slot:after>
      <password-folder-details v-if="selectedPasswordNode && selectedPasswordNode.folder"
        :folder="selectedPasswordNode" :key="selectedPasswordNode.absPath"
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
    const selectedPasswordNode = UIModule.selectedPasswordNode
    if (!selectedPasswordNode) {
      return null
    }
    const nodes = PasswordsModule.loadNodes
    if (!nodes) {
      return null
    }
    return nodes[selectedPasswordNode]
  }

  get overviewWidthInPx() {
    return UIModule.passwordOverviewWidthInPx
  }

  set overviewWidthInPx(overviewWidthInPx: number) {
    UIModule.setPasswordOverviewWidthInPx$(overviewWidthInPx)
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