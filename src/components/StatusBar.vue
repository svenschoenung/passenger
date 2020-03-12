<template> 
    <q-footer class="status-bar footer-height">
        <div class="clickable" @click="gotoConfigRepoPage()">
            <q-icon :name="icons.repoPath" size="xs"/> {{repoPath}}
        </div>
        <div class="clickable" @click="gotoPasswordsPage()">
            <q-icon :name="icons.folder" size="xs"/> {{folderCount}}
            <q-icon :name="icons.password" size="xs"/> {{fileCount}}
        </div>
        <div class="clickable" @click="gotoProblemsPage()">
            <problems-count color="white"/>
        </div>
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

  gotoConfigRepoPage() {
      UIModule.setConfigPage('repo')
      UIModule.setPage('config')
  }

  gotoPasswordsPage() {
      UIModule.setPage('passwords')
  }

  gotoProblemsPage() {
      UIModule.setPage('problems')
  }
}
</script>

<style lang="scss" scoped>
@import "src/styles/style.variables.scss";

.status-bar {
    padding: 0px 15px;
    font-weight: 500;
    font-size: 14px;
    line-height: 24px;
}
.clickable {
    margin: 0px 5px;
    display: inline-block;
    padding: 0px 5px;
    box-sizing: border-box;
    height: $footer-height;
}
.clickable:hover {
    cursor: pointer;
    background: rgba(white, $alpha: 0.3); 
}
</style>
