<template>
  <q-input
    class="folder-picker"
    outlined
    debounce="500"
    v-model="folderPath"
    :label="label"
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
import { Component, Vue, Prop, Emit } from 'vue-property-decorator';
import electron from 'electron';

import { FolderValidator } from '@/model/validation';
import { nonReactiveProps } from '../util/props';
import icons from '@/ui/icons';

@Component({})
export default class FolderPicker extends Vue {
  @Prop({ type: String }) label!: string;
  @Prop({ type: String }) title!: string;
  @Prop({ type: String }) value!: string;
  @Prop({ type: Function }) validator!: FolderValidator;
  folderPath: string | null = null;

  created() {
    nonReactiveProps(this, { icons })
    this.folderPath = this.value;
  }

  async validateRepository(repoPath: string) {
    const result = await this.validator(repoPath);
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
        title: this.title,
        defaultPath: this.value,
        buttonLabel: "Open",
        properties: ["openDirectory", "showHiddenFiles", "createDirectory"]
      }
    );
    if (folder && folder.filePaths && folder.filePaths[0]) {
      this.folderPath = folder.filePaths[0];
    }
  }

  @Emit("input")
  updateValue(value: string) {
    return value;
  }
}
</script>

<style lang="scss">
@import "src/styles/quasar.variables.scss";

.folder-picker .q-field__append.q-anchor--skip {
  display: none;
}
</style>