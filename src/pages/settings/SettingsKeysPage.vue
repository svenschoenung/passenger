<template>
  <q-form
    ref="form"
    autocorrect="off"
    autocapitalize="off"
    autocomplete="off"
    spellcheck="false"
    class="q-pa-md"
  >
        <path-picker
          label="GPG homedir location:"
          title="Open GPG homedir"
          :folder="true"
          :validator="validateGPGHomedir"
          v-model="gpgPath"/>
        <path-picker
          label="GPG Binary location:"
          title="Open GPG homedir"
          :folder="false"
          :validator="validateExecutable"
          v-model="gpgBinaryPath"/>
  </q-form>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { SettingsModule } from '@/store';
import { validateGPGHomedir } from '@/service/gpg';
import { validateExecutable } from '@/model/validation';
import { setNonReactiveProps } from '@/util/props';

@Component({})
export default class SettingsKeysPage extends Vue {
  gpgPath = SettingsModule.gpgPath as string;
  gpgBinaryPath = SettingsModule.gpgBinaryPath as string;

  created() {
    setNonReactiveProps(this, { validateGPGHomedir, validateExecutable })
  }

  deactivated() {
    this.changeSettings()
  }

  destroyed() {
    this.changeSettings()
  }

  changeSettings() {
    if (this.gpgPath !== SettingsModule.gpgPath) {
      SettingsModule.setGPGPath(this.gpgPath)
    }
    if (this.gpgBinaryPath !== SettingsModule.gpgBinaryPath) {
      SettingsModule.setGPGBinaryPath(this.gpgBinaryPath)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>