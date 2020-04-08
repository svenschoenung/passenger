<template>
  <q-dialog :value="true" :persistent="true">
    <q-layout view="hhh lpr fff" container class="bg-0 setup-dialog">
      <q-header>
        <q-toolbar>
          <q-toolbar-title>
            <q-icon :name="icons.settings" />{{' '}}Setup
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
        <path-picker
          label="Repository location:"
          title="Open repository"
          :folder="true"
          :validator="validateRepository"
          v-model="repoPath"/>
        <path-picker
          label="GPG homedir location:"
          title="Open GPG homedir"
          :folder="true"
          :validator="validateGPGHomedir"
          v-model="gpgPath"/>
        <q-list>
          <color-theme-picker v-model="colorTheme"/>  
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
import { QForm } from "quasar";

import { SettingsModule, UIModule } from "@/store";
import { setNonReactiveProps } from '@/util/props'
import { validateRepository } from '@/service/repo'
import { validateGPGHomedir } from '@/service/gpg'
import { ColorTheme } from '@/store/modules/settings';
import icons from "@/ui/icons";

@Component({})
export default class SetupDialog extends Vue {
  @Ref() form!: QForm;

  repoPath = path.join(os.homedir(), ".password-store");
  gpgPath = path.join(os.homedir(), ".gnupg");

  created() {
    setNonReactiveProps(this, { icons, validateRepository, validateGPGHomedir })
  }

  set colorTheme(colorTheme: ColorTheme) {
    SettingsModule.setColorTheme(colorTheme)
  }

  get colorTheme() {
    return SettingsModule.colorTheme
  }

  setup() {
    SettingsModule.setup({ 
      repoPath: this.repoPath, 
      gpgPath: this.gpgPath,
      colorTheme: this.colorTheme
    });
  }
}
</script>

<style lang="scss">
</style>