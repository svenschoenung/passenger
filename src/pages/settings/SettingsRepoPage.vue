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
          label="Repository location:"
          title="Open repository"
          :folder="true"
          :validator="validateRepository"
          v-model="repoPath"/>
  </q-form>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { SettingsModule } from '@/store';
import { validateRepository } from '@/service/repo';
import { setNonReactiveProps } from '@/util/props';
import { tildify, untildify } from '@/util/fs';

@Component({})
export default class SettingsRepoPage extends Vue {
  repoPath = tildify(SettingsModule.repoPath as string);

  created() {
    setNonReactiveProps(this, { validateRepository })
  }

  deactivated() {
    this.changeRepoPath()
  }

  destroyed() {
    this.changeRepoPath()
  }

  changeRepoPath() {
    if (this.repoPath !== SettingsModule.repoPath) {
      SettingsModule.setRepoPath(untildify(this.repoPath))
    }
  }
}
</script>

<style lang="scss" scoped>
</style>