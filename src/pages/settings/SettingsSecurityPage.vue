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
          <number-input :min="1" 
            v-model="passwordInClipboardTimeout"
            :disable="!enablePasswordInClipboardTimeout" >
            <template v-slot:after>
              <label class="seconds">seconds</label>
            </template>
          </number-input>
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
    return SettingsModule.enablePasswordInClipboardTimeout
  }

  set enablePasswordInClipboardTimeout(enablePasswordInClipboardTimeout: boolean) {
    SettingsModule.setEnablePasswordInClipboardTimeout(enablePasswordInClipboardTimeout)
  }

  get passwordInClipboardTimeout() {
    return SettingsModule.passwordInClipboardTimeout
  }

  set passwordInClipboardTimeout(passwordInClipboardTimeout: number) {
    SettingsModule.setPasswordInClipboardTimeout(passwordInClipboardTimeout)
  }
}
</script>

<style lang="scss">
label.seconds {
  font-size: 14px;
}
</style>