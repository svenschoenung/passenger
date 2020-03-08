<template> 
    <div>
      <setup-dialog v-if="needsSetup"/>
      <q-layout v-else view="lHh lpR fFf">
          <q-drawer elevated
            :value="true" 
            :mini="true"
            :breakpoint="0">
              <menu-bar/> 
          </q-drawer> 

          <q-page-container>
            <keep-alive>
              <component :is="pageComponent"></component>
            </keep-alive>
          </q-page-container>

          <q-footer class="status-bar footer-height">
          </q-footer>
      </q-layout>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import electron, { BrowserWindow } from 'electron'
import { debounce } from 'quasar'

import { UIModule, ConfigModule } from '@/store'

@Component({})
export default class App extends Vue {
  created() {
    const win = electron.remote.getCurrentWindow()
    this.initWindowState(win)
    this.watchWindowState(win)
    this.$q.dark.set(ConfigModule.darkMode)
  }

  initWindowState(win: BrowserWindow) {
    if (UIModule.windowState.maximized) {
      win.maximize()
    }
    win.setBounds(UIModule.windowState.bounds);
  }

  watchWindowState(win: BrowserWindow) {
    const windowStateChanged = (e: Event) => {
      UIModule.setWindowState$({
        maximized: win.isMaximized(),
        bounds: win.getBounds()
      })
    }
    const windowStateChangedDebounced = debounce(windowStateChanged, 250);
    [ 'close' ].forEach(e => {
      win.on(e as any, windowStateChanged)
    }); 
    [ 'resize', 'move', 'moved', 'maximize', 'unmaximize' ].forEach(e => {
      win.on(e as any, windowStateChangedDebounced)
    }); 
  }

  get pageComponent() {
    return UIModule.page + '-page'
  }

  get needsSetup() {
    return !ConfigModule.repoPath || !ConfigModule.gpgPath
  }
}

</script>

<style lang="scss" scoped>
.status-bar {
    padding: 5px;
    font-weight: bold;
}
</style>
