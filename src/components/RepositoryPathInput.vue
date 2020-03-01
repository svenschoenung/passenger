<template>
  <q-input
    class="repository-path-input"
    outlined
    debounce="500"
    v-model="repoPath"
    label="Repository location:"
    stack-label
    auto-focus
    bottom-slots
    :rules="[validateRepository]"
  >
    <template v-slot:append>
      <q-avatar rounded>
        <q-btn @click="openRepository">
          <q-icon :name="icons.folder" />
        </q-btn>
      </q-avatar>
    </template>
  </q-input>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from "vue-property-decorator";
import electron from "electron";
import { QForm, Dark } from "quasar"; //eslint-disable-line no-unused-vars

import { validateRepository } from "@/service/repo";
import icons from "@/ui/icons";

@Component({
  components: {}
})
export default class RepositoryPathInput extends Vue {
  @Prop({ type: String }) value!: string;
  repoPath: string | null = null;

  created() {
    (this as any).icons = icons;
    this.repoPath = this.value;
  }

  async validateRepository(repoPath: string) {
    const result = await validateRepository(repoPath);
    if (result.valid) {
      this.updateValue(repoPath);
      return true;
    }
    return result.error;
  }

  async openRepository() {
    const folder = await electron.remote.dialog.showOpenDialog(
      electron.remote.getCurrentWindow(),
      {
        title: "Open repository",
        defaultPath: this.value,
        buttonLabel: "Open",
        properties: ["openDirectory", "showHiddenFiles", "createDirectory"]
      }
    );
    if (folder && folder.filePaths && folder.filePaths[0]) {
      this.repoPath = folder.filePaths[0];
    }
  }

  @Emit("input")
  updateValue(value: string) {
    console.log("value", value);
    return value;
  }
}
</script>

<style lang="scss">
@import "src/styles/quasar.variables.scss";

.repository-path-input .q-field__append.q-anchor--skip {
  display: none;
}
</style>