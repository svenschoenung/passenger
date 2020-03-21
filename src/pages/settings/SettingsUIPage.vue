<template>
  <q-form>
    <q-list>
      <color-theme-picker v-model="colorTheme"/> 
      <q-item tag="label" v-ripple>
        <q-item-section>
          <q-item-label>Show status bar</q-item-label>
        </q-item-section>
        <q-item-section avatar>
          <q-toggle color="blue" v-model="showStatusBar" />
        </q-item-section>
      </q-item>
    </q-list>
  </q-form>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { SettingsModule } from '@/store'
import { ColorTheme } from '@/store/modules/settings'

const colorThemes: ColorTheme[] = ['light', 'dark', 'system']

@Component({})
export default class SettingsUIPage extends Vue {

  set colorTheme(colorTheme: ColorTheme) {
    SettingsModule.setColorTheme(colorTheme)
  }

  get colorTheme() {
    return SettingsModule.colorTheme
  }

  set showStatusBar(showStatusBar: boolean) {
    SettingsModule.setShowStatusBar(showStatusBar)
  }

  get showStatusBar() {
    return SettingsModule.showStatusBar
  }
}
</script>

<style lang="scss" scoped>
</style>