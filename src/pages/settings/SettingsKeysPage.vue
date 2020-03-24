<template>
  <q-form
    ref="form"
    autocorrect="off"
    autocapitalize="off"
    autocomplete="off"
    spellcheck="false"
    class="q-pa-md"
  >
        <folder-picker
          label="GPG homedir location:"
          title="Open GPG homedir"
          :validator="validateGPGHomedir"
          v-model="gpgPath"/>
  </q-form>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { SettingsModule } from '@/store';
import { validateGPGHomedir } from '@/service/gpg';
import { setNonReactiveProps } from '@/util/props';

@Component({})
export default class SettingsKeysPage extends Vue {
  gpgPath = SettingsModule.gpgPath as string;

  created() {
    setNonReactiveProps(this, { validateGPGHomedir })
  }

  deactivated() {
    this.changeGPGPath()
  }

  destroyed() {
    this.changeGPGPath()
  }

  changeGPGPath() {
    if (this.gpgPath !== SettingsModule.gpgPath) {
      SettingsModule.setGPGPath(this.gpgPath)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>