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
}
</script>

<style lang="scss" scoped>
</style>