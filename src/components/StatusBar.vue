<template> 
    <q-footer class="status-bar">
        <q-toolbar>
            <q-btn flat @click="gotoSettingsRepoPage()">
                <q-icon :name="icons.repoPath" size="xs" class="q-mr-xs"/> {{repoPath}}
            </q-btn>
            <q-btn flat @click="gotoPasswordsPage()">
                <q-icon :name="icons.folder" size="xs" class="q-mr-sm"/> {{folderCount}}
                <q-icon :name="icons.password" size="xs" class="q-mx-sm"/> {{fileCount}}
                <q-tooltip>
                    <div>Folders: {{folderCount}}</div>
                    <div>Files: {{fileCount}}</div>
                </q-tooltip>
            </q-btn>
            <q-btn flat @click="gotoProblemsPage()">
                <problems-count color="white"/>
            </q-btn>
            <q-btn flat @click="gotoKeysPage()">
                <q-icon :name="icons.keys" size="xs" class="q-mr-sm"/>
                {{publicKeysCount}} + {{privateKeysCount}}
                <q-tooltip>
                    <div>Public Keys: {{publicKeysCount}}</div>
                    <div>Private Keys: {{privateKeysCount}}</div>
                </q-tooltip>
            </q-btn>
            <q-btn flat v-if="runningOperation && runningOperation.name" class="q-ml-md">
               <q-spinner color="white" size="xs" :thickness="8" class="q-mr-sm"/> {{runningOperation.name}}
            </q-btn>
            <q-space/>
            <q-btn flat @click="clearPassword()" v-if="passwordInClipboardCountdown">
                <q-icon :name="icons.clipboard" size="xs" class="q-mr-sm"/> Password available for {{passwordInClipboardCountdown}}s
            </q-btn>
        </q-toolbar>
    </q-footer>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import electron, { BrowserWindow } from 'electron'
import { debounce, Notify } from 'quasar'

import { UIModule, SettingsModule, PasswordsModule, KeysModule, OperationsModule } from '@/store'
import { setNonReactiveProps } from '@/util/props';
import icons from '@/ui/icons'
import { tildify } from '@/util/fs';
import { removePasswordFromClipboard } from '../service/clipboard';

@Component({})
export default class StatusBar extends Vue {
  created() {
    setNonReactiveProps(this, { icons })
  }

  get repoPath() {
      return tildify(SettingsModule.repoPath as string)
  }

  get folderCount() {
      return PasswordsModule.folderCount
  }

  get fileCount() {
      return PasswordsModule.fileCount
  }

  get publicKeysCount() {
      return KeysModule.publicKeys.value ? KeysModule.publicKeys.value.length : 0
  }

  get privateKeysCount() {
      return KeysModule.privateKeys.value ? KeysModule.privateKeys.value.length : 0
  }

  get runningOperation() {
      if (OperationsModule.runningOperations.length > 0) {
          return OperationsModule.runningOperations[0]
      }
      return null
  }

  gotoSettingsRepoPage() {
      UIModule.setSettingsPage('repo')
      UIModule.setPage('settings')
  }

  gotoPasswordsPage() {
      UIModule.setPage('passwords')
  }

  gotoProblemsPage() {
      UIModule.setPage('problems')
  }

  gotoKeysPage() {
      UIModule.setPage('keys')
  }

  get passwordInClipboardCountdown() {
      return UIModule.countdowns.passwordInClipboard.seconds
  }

  async clearPassword() {
    await removePasswordFromClipboard()
    Notify.create({
      color: 'primary',
      classes: 'notification-above-status-bar',
      position: 'bottom-right',
      message: 'Password cleared',
      timeout: 1500,
    })
  }
}
</script>

<style lang="scss">
@import "src/styles/style.variables.scss";

.status-bar {
    padding: 0px 15px;
    height: $status-bar-height;

    * {
        line-height: 24px;
        font-size: 14px !important;
        font-weight: 500 !important;
        text-transform: none;
    }

    .q-toolbar {
        padding: 0px;
        margin: 0px;
        min-height: $status-bar-height;
    }

    .q-btn {
        margin: 0px 5px;
        border-radius: 0px;
    }
    .q-btn__wrapper {
        padding: 0px 5px !important;
    }
    .q-btn__content {
        height: $status-bar-height;
    }

    svg {
        font-size: 18px !important;
    }
}

</style>
