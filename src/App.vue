<template> 
    <div :class="{ 'no-status-bar': !showStatusBar }">
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

          <status-bar v-if="showStatusBar"/>
      </q-layout>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import electron, { BrowserWindow } from 'electron'
import { debounce } from 'quasar'
import { darkMode } from 'electron-util'

import { UIModule, SettingsModule, PreferencesModule } from '@/store'

@Component({})
export default class App extends Vue {
  created() {
    const win = electron.remote.getCurrentWindow()
    this.initWindowState(win)
    this.watchWindowState(win)
    this.watchDarkMode()
  }

  initWindowState(win: BrowserWindow) {
    if (PreferencesModule.windowState.maximized) {
      win.maximize()
    }
    win.setBounds(PreferencesModule.windowState.bounds);
  }

  watchWindowState(win: BrowserWindow) {
    const windowStateChanged = (e: Event) => {
      PreferencesModule.setWindowState({
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

  watchDarkMode() {
    this.$q.dark.set(UIModule.darkMode)
    darkMode.onChange(() => {
      UIModule.setSystemDarkMode(darkMode.isEnabled)
    });
  }

  get pageComponent() {
    return UIModule.page + '-page'
  }

  get needsSetup() {
    return !SettingsModule.repoPath || !SettingsModule.gpgPath
  }

  get showStatusBar() {
    return SettingsModule.showStatusBar
  }
}

</script>

<style lang="scss" scoped>
</style>
