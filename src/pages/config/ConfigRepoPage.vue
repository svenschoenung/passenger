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
          label="Repository location:"
          title="Open repository"
          :validator="validateRepository"
          v-model="repoPath"/>
  </q-form>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { ConfigModule } from '@/store';
import { validateRepository } from '@/service/repo';
import { setNonReactiveProps } from '@/util/props';

@Component({})
export default class ConfigRepoPage extends Vue {
  repoPath = ConfigModule.repoPath as string;

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
    if (this.repoPath !== ConfigModule.repoPath) {
      ConfigModule.setRepoPath(this.repoPath)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>