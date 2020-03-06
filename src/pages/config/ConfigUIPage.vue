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
import { ConfigModule } from '../../store'

@Component({
  name: 'config-ui-page'
})
export default class ConfigUIPage extends Vue {

  set darkMode(darkMode: boolean) {
    ConfigModule.changeDarkMode$(darkMode)
  }

  get darkMode() {
    return ConfigModule.darkMode
  }
}
</script>

<style lang="scss" scoped>
</style>