<template>
  <q-form>
    <q-list>
      <q-item>
        <q-item-section avatar>
          <q-toggle dense color="blue" v-model="enablePasswordInClipboardTimeout" />
        </q-item-section>
        <q-item-section :class="{ disabled: !enablePasswordInClipboardTimeout }">
          <q-item-label>Clear copied passwords after:</q-item-label>
        </q-item-section>
        <q-item-section side :class="{ disabled: !enablePasswordInClipboardTimeout }">
          <number-input outlined :min="1" class="bg-1"
            v-model="passwordInClipboardTimeout"
            :disable="!enablePasswordInClipboardTimeout" >
          </number-input>
        </q-item-section>
        <q-item-section side :class="{ disabled: !enablePasswordInClipboardTimeout }">
          <label class="seconds">seconds</label>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section avatar>
          <q-toggle dense color="blue" v-model="enablePasswordRevealTimeout" />
        </q-item-section>
        <q-item-section :class="{ disabled: !enablePasswordRevealTimeout }">
          <q-item-label>Hide revealed passwords after:</q-item-label>
        </q-item-section>
        <q-item-section side :class="{ disabled: !enablePasswordRevealTimeout }">
          <number-input outlined :min="1" class="bg-1"
            v-model="passwordRevealTimeout"
            :disable="!enablePasswordRevealTimeout" >
          </number-input>
        </q-item-section>
        <q-item-section side :class="{ disabled: !enablePasswordRevealTimeout }">
          <label class="seconds">seconds</label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-form>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { SettingsModule } from '@/store'
import { setNonReactiveProps } from '@/util/props'
import icons from '@/ui/icons'

@Component({})
export default class SettingsSecurityPage extends Vue {
  created() {
    setNonReactiveProps(this, { icons })
  }

  get enablePasswordInClipboardTimeout() {
    return SettingsModule.timeouts.passwordInClipboard.enable
  }

  set enablePasswordInClipboardTimeout(enable: boolean) {
    SettingsModule.setEnableTimeout({ type: 'passwordInClipboard', enable })
  }

  get passwordInClipboardTimeout() {
    return SettingsModule.timeouts.passwordInClipboard.seconds
  }

  set passwordInClipboardTimeout(seconds: number) {
    SettingsModule.setTimeoutSeconds({ type: 'passwordInClipboard', seconds })
  }

  get enablePasswordRevealTimeout() {
    return SettingsModule.timeouts.passwordReveal.enable
  }

  set enablePasswordRevealTimeout(enable: boolean) {
    SettingsModule.setEnableTimeout({ type: 'passwordReveal', enable })
  }

  get passwordRevealTimeout() {
    return SettingsModule.timeouts.passwordReveal.seconds
  }

  set passwordRevealTimeout(seconds: number) {
    SettingsModule.setTimeoutSeconds({ type: 'passwordReveal', seconds })
  }
}
</script>

<style lang="scss">
label.seconds {
  font-size: 14px;
}
</style>