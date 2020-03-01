<template>
  <q-splitter v-model="treePaneWidthInPercent" :style="{ height: `calc(100vh - ${footerHeight}px`}">
    <template v-slot:before>
      <div class="cover bg-1">
        <q-tree
          v-if="passwordsTree"
          :nodes="passwordsTree"
          :icon="icons.arrow"
          default-expand-all
          node-key="absPath"
          label-key="name"
          :selected.sync="selected"
          selected-color="primary"
        />
        <q-circular-progress
          v-else
          indeterminate
          size="50px"
          :thickness="0.22"
          color="primary"
          track-color="grey-3"
          class="centered-progress"
        />
      </div>
    </template>
    <template v-slot:after>Passwords</template>
  </q-splitter>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { FOOTER_HEIGHT } from "@/constants";
import { PasswordsModule, UIModule } from "../store";
import icons from "@/ui/icons";

@Component({
  name: "passwords-page",
  components: {}
})
export default class PasswordsPage extends Vue {
  footerHeight = FOOTER_HEIGHT;
  treePaneWidthInPercent = 30;

  set selected(absPath: string) {
    UIModule.selectPasswordNode$(absPath);
  }

  get selected() {
    return UIModule.selectedPasswordNode as string;
  }

  created() {
    (this as any).icons = icons;
  }

  get passwordsTree() {
    if (!(PasswordsModule.tree && PasswordsModule.tree.children)) {
        PasswordsModule.loadTree$()
        return null
    }
    return PasswordsModule.tree.children
  }
}
</script>

<style lang="scss" scoped>
.centered-progress {
  position: absolute;
  top: calc(50% - 25px);
  left: calc(50% - 25px);
}
</style>