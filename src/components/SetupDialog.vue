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
        <folder-picker
          label="Repository location:"
          title="Open repository"
          :validator="validateRepository"
          v-model="repoPath"/>
        <folder-picker
          label="GPG homedir location:"
          title="Open GPG homedir"
          :validator="validateGPGHomedir"
          v-model="gpgPath"/>
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
import { QForm, Dark } from "quasar";

import { ConfigModule } from "@/store";
import { validateRepository } from '@/service/repo'
import { validateGPGHomedir } from '@/service/keys'
import icons from "@/ui/icons";
import FolderPicker from '@/components/FolderPicker.vue'

@Component({
  components: {
    FolderPicker
  }
})
export default class SetupDialog extends Vue {
  @Prop() show!: boolean;
  @Ref() form!: QForm;

  repoPath = path.join(os.homedir(), ".password-store");
  gpgPath = path.join(os.homedir(), ".gnupg");
  darkModeState = false;

  created() {
    (this as any).icons = icons;
    (this as any).validateRepository = validateRepository;
    (this as any).validateGPGHomedir = validateGPGHomedir;
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

  setup() {
    ConfigModule.setup$({ 
      repoPath: this.repoPath, 
      gpgPath: this.gpgPath,
      darkMode: this.darkMode
    });
  }
}
</script>

<style lang="scss">
</style>