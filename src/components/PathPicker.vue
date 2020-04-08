<template>
  <q-input
    class="path-picker"
    outlined
    debounce="500"
    v-model="path"
    :label="label"
    stack-label
    auto-focus
    bottom-slots
    :rules="[validateSelection]"
  >
    <template v-slot:append>
      <q-avatar rounded>
        <q-btn @click="openFileDialog">
          <q-icon :name="icons.folder" />
        </q-btn>
      </q-avatar>
    </template>
  </q-input>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator';
import electron from 'electron';

import { PathValidator } from '@/model/validation';
import { setNonReactiveProps } from '@/util/props';
import icons from '@/ui/icons';

@Component({})
export default class PathPicker extends Vue {
  @Prop({ type: String }) label!: string;
  @Prop({ type: String }) title!: string;
  @Prop({ type: String }) value!: string;
  @Prop({ type: Boolean }) folder!: boolean;
  @Prop({ type: Function }) validator!: PathValidator;
  path: string | null = null;

  created() {
    setNonReactiveProps(this, { icons })
    this.path = this.value;
  }

  async validateSelection(repoPath: string) {
    const result = await this.validator(repoPath);
    if (result.valid) {
      this.updateValue(repoPath);
      return true;
    }
    return result.error;
  }

  async openFileDialog() {
    const file = await electron.remote.dialog.showOpenDialog(
      electron.remote.getCurrentWindow(),
      {
        title: this.title,
        defaultPath: this.value,
        buttonLabel: "Open",
        properties: [this.folder ? "openDirectory" : "openFile", "showHiddenFiles", "createDirectory"]
      }
    );
    if (file && file.filePaths && file.filePaths[0]) {
      this.path = file.filePaths[0];
    }
  }

  @Emit("input")
  updateValue(value: string) {
    return value;
  }
}
</script>

<style lang="scss">
@import "src/styles/style.variables.scss";

.path-picker .q-field__append.q-anchor--skip {
  display: none;
}
</style>