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
import { ConfigModule } from '@/store';
import { validateGPGHomedir } from '@/service/keys';
import { nonReactiveProps } from '@/util/props';

@Component({})
export default class ConfigKeysPage extends Vue {
  gpgPath = ConfigModule.gpgPath as string;

  created() {
    nonReactiveProps(this, { validateGPGHomedir })
  }

  deactivated() {
    this.changeGPGPath()
  }

  destroyed() {
    this.changeGPGPath()
  }

  changeGPGPath() {
    if (this.gpgPath !== ConfigModule.gpgPath) {
      ConfigModule.setGPGPath$(this.gpgPath)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>