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

          <status-bar/>
      </q-layout>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import electron, { BrowserWindow } from 'electron'
import { debounce } from 'quasar'

import { UIModule, SettingsModule, PreferencesModule } from '@/store'

@Component({})
export default class App extends Vue {
  created() {
    const win = electron.remote.getCurrentWindow()
    this.initWindowState(win)
    this.watchWindowState(win)
    this.$q.dark.set(SettingsModule.darkMode)
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

  get pageComponent() {
    return UIModule.page + '-page'
  }

  get needsSetup() {
    return !SettingsModule.repoPath || !SettingsModule.gpgPath
  }
}

</script>

<style lang="scss" scoped>
</style>
