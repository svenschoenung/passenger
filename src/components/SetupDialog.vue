<template>
  <q-dialog :value="showDialog" :persistent="true">
    <q-layout view="hhh lpr fff" container class="bg-0 setup-dialog">
      <q-header>
        <q-toolbar>
          <q-toolbar-title>
            <q-icon :name="icons.config" />{{' '}}Setup
          </q-toolbar-title>
        </q-toolbar>
      </q-header>
      <q-page-container>
        <q-form
          ref="form"
          autocorrect="off"
          autocapitalize="off"
          autocomplete="off"
          spellcheck="false"
          class="q-pa-md"
          @submit="setup"
        >
          <q-input
            outlined
            debounce="500"
            v-model="repoPath"
            label="Repository"
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
          <q-list>
            <q-item tag="label" v-ripple>
              <q-item-section>
                <q-item-label>Enable Dark Mode</q-item-label>
              </q-item-section>
              <q-item-section avatar>
                <q-toggle color="blue" v-model="darkMode" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-form>
      </q-page-container>
      <q-footer class="bg-0 q-pa-md">
        <q-btn color="primary" class="float-right" @click="form.submit()">Start</q-btn>
      </q-footer>
    </q-layout>
  </q-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop, Ref } from "vue-property-decorator";
import os from "os";
import path from "path";
import electron from "electron";
import { QForm, Dark } from "quasar"; //eslint-disable-line no-unused-vars

import { ConfigModule } from "@/store";
import { validateRepository } from "@/service/repo";
import icons from "@/ui/icons";

@Component({
  components: {}
})
export default class SetupDialog extends Vue {
  @Prop() show!: boolean;
  @Ref() form!: QForm;

  repoPath = path.join(os.homedir(), ".password-store");
  darkModeState = false;

  created() {
    (this as any).icons = icons
  }

  get showDialog() {
    return this.show;
  }

  set darkMode(darkMode: boolean) {
    Dark.set(darkMode)
    this.darkModeState = darkMode
  }

  get darkMode() {
    return this.darkModeState
  }

  async validateRepository(repoPath: string) {
    try {
      return await validateRepository(repoPath);
    } catch (e) {
      return (e as Error).message;
    }
  }

  async openRepository() {
    const folder = await electron.remote.dialog.showOpenDialog(
      electron.remote.getCurrentWindow(),
      {
        title: "Open repository",
        defaultPath: this.repoPath,
        buttonLabel: "Open",
        properties: ["openDirectory", "showHiddenFiles", "createDirectory"]
      }
    );
    if (folder && folder.filePaths && folder.filePaths[0]) {
      this.repoPath = folder.filePaths[0];
    }
  }

  setup() {
    ConfigModule.setup$({ repoPath: this.repoPath, darkMode: this.darkMode });
  }
}
</script>

<style lang="scss">
@import "src/styles/quasar.variables.scss";

.setup-dialog .q-field__append.q-anchor--skip {
  display: none;
}
</style>