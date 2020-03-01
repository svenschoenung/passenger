<template>
  <q-form
    ref="form"
    autocorrect="off"
    autocapitalize="off"
    autocomplete="off"
    spellcheck="false"
    class="q-pa-md"
  >
    <repository-path-input v-model="repoPath"/>
  </q-form>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { ConfigModule } from '@/store';
import RepositoryPathInput from '@/components/RepositoryPathInput.vue';

@Component({
  name: "config-repo-page",
  components: {
    RepositoryPathInput
  }
})
export default class ConfigRepoPage extends Vue {
  repoPath = ConfigModule.repoPath as string;

  destroyed() {
    if (this.repoPath !== ConfigModule.repoPath) {
      ConfigModule.changeRepoPath$(this.repoPath)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>