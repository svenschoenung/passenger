<template>
  <q-splitter id="passwords-page" v-model="treePaneWidthInPercent" :style="{ height: `calc(100vh - ${footerHeight}px`}">
    <template v-slot:before>
      <passwords-tree/>
    </template>
    <template v-slot:after>
      <password-folder-details v-if="selectedPasswordNode && selectedPasswordNode.folder"
        :folder="selectedPasswordNode"
      />
    </template>
  </q-splitter>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { FOOTER_HEIGHT } from "@/constants";
import PasswordsTree from '@/components/PasswordsTree.vue'
import PasswordFolderDetails from '@/components/PasswordFolderDetails.vue'
import { PasswordsModule, UIModule } from '@/store';

@Component({
  name: "passwords-page",
  components: {
    PasswordsTree,
    PasswordFolderDetails,
  }
})
export default class PasswordsPage extends Vue {
  footerHeight = FOOTER_HEIGHT;
  treePaneWidthInPercent = 30;

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