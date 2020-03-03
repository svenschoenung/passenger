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
import FolderPicker from '@/components/FolderPicker.vue';
import { validateGPGHomedir } from '../../service/keys';

@Component({
  name: "config-keys-page",
  components: {
    FolderPicker
  }
})
export default class ConfigKeysPage extends Vue {
  gpgPath = ConfigModule.gpgPath as string;

  created() {
    (this as any).validateGPGHomedir = validateGPGHomedir
  }

  destroyed() {
    if (this.gpgPath !== ConfigModule.gpgPath) {
      ConfigModule.changeGPGPath$(this.gpgPath)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>