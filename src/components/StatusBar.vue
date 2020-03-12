<template> 
    <q-footer class="status-bar footer-height">
        <q-icon :name="icons.repoPath"/> {{repoPath}}
        <q-icon :name="icons.folder"/> {{folderCount}}
        <q-icon :name="icons.password"/> {{fileCount}}
        <div class="float-right">
        </div>
    </q-footer>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import electron, { BrowserWindow } from 'electron'
import { debounce } from 'quasar'

import { UIModule, ConfigModule, PasswordsModule } from '@/store'
import { setNonReactiveProps } from '@/util/props';
import icons from '@/ui/icons'
import { tildify } from '@/util/fs';

@Component({})
export default class App extends Vue {
  created() {
    setNonReactiveProps(this, { icons })
  }

  get repoPath() {
      return tildify(ConfigModule.repoPath as string)
  }

  get folderCount() {
      return PasswordsModule.folderCount
  }

  get fileCount() {
      return PasswordsModule.fileCount
  }
}
</script>

<style lang="scss" scoped>
.status-bar {
    padding-left: 20px;
    padding-right: 20px;
    font-weight: 500;
    font-size: 14px;
}
</style>
