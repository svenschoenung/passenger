<template>
  <q-form>
      <q-list>
      <q-item tag="label" v-ripple>
        <q-item-section>
          <q-item-label>Enable Dark Mode</q-item-label>
        </q-item-section>
        <q-item-section avatar>
          <q-toggle color="blue" v-model="darkMode" />
        </q-item-section>
      </q-item>
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

@Component({})
export default class SettingsUIPage extends Vue {

  set darkMode(darkMode: boolean) {
    SettingsModule.setDarkMode(darkMode)
  }

  get darkMode() {
    return SettingsModule.darkMode
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