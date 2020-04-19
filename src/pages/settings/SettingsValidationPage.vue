<template>
  <q-form>
    <q-list>
      <validation-toggle
        title="Highlight files and folders requiring unknown keys"
        :enable.sync="toBeEncryptedWithUnknownKeysEnable"
        :type.sync="toBeEncryptedWithUnknownKeysType" />
      <validation-toggle
        title="Highlight files encrypted with unknown keys"
        :enable.sync="encryptedWithUnknownKeysEnable"
        :type.sync="encryptedWithUnknownKeysType" />
      <validation-toggle
        title="Highlight files encrypted with unexpected keys"
        :enable.sync="encryptedWithUnexpectedKeysEnable"
        :type.sync="encryptedWithUnexpectedKeysType" />     
      <validation-toggle
        title="Highlight files encrypted without expected keys"
        :enable.sync="encryptedWithoutExpectedKeysEnable"
        :type.sync="encryptedWithoutExpectedKeysType" />  
    </q-list>
  </q-form>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { SettingsModule } from '@/store'
import { ColorTheme, ValidationSettings } from '@/store/modules/settings'
import { ProblemType } from '@/store/modules/problems'

@Component({})
export default class SettingsValidationPage extends Vue {

  get toBeEncryptedWithUnknownKeysEnable() {
    return SettingsModule.validation.toBeEncryptedWithUnknownKeys.enable
  }

  set toBeEncryptedWithUnknownKeysEnable(enable: boolean) {
    SettingsModule.setValidationEnabled({ name: 'toBeEncryptedWithUnknownKeys', enable })
  }

  get toBeEncryptedWithUnknownKeysType() {
    return SettingsModule.validation.toBeEncryptedWithUnknownKeys.type
  }

  set toBeEncryptedWithUnknownKeysType(type: ProblemType) {
    SettingsModule.setValidationType({ name: 'toBeEncryptedWithUnknownKeys', type })
  }

  get encryptedWithUnknownKeysEnable() {
    return SettingsModule.validation.encryptedWithUnknownKeys.enable
  }

  set encryptedWithUnknownKeysEnable(enable: boolean) {
    SettingsModule.setValidationEnabled({ name: 'encryptedWithUnknownKeys', enable })
  }

  get encryptedWithUnknownKeysType() {
    return SettingsModule.validation.encryptedWithUnknownKeys.type
  }

  set encryptedWithUnknownKeysType(type: ProblemType) {
    SettingsModule.setValidationType({ name: 'encryptedWithUnknownKeys', type })
  }

  get encryptedWithUnexpectedKeysEnable() {
    return SettingsModule.validation.encryptedWithUnexpectedKeys.enable
  }

  set encryptedWithUnexpectedKeysEnable(enable: boolean) {
    SettingsModule.setValidationEnabled({ name: 'encryptedWithUnexpectedKeys', enable })
  }

  get encryptedWithUnexpectedKeysType() {
    return SettingsModule.validation.encryptedWithUnexpectedKeys.type
  }

  set encryptedWithUnexpectedKeysType(type: ProblemType) {
    SettingsModule.setValidationType({ name: 'encryptedWithUnexpectedKeys', type })
  }

  get encryptedWithoutExpectedKeysEnable() {
    return SettingsModule.validation.encryptedWithoutExpectedKeys.enable
  }

  set encryptedWithoutExpectedKeysEnable(enable: boolean) {
    SettingsModule.setValidationEnabled({ name: 'encryptedWithoutExpectedKeys', enable })
  }

  get encryptedWithoutExpectedKeysType() {
    return SettingsModule.validation.encryptedWithoutExpectedKeys.type
  }

  set encryptedWithoutExpectedKeysType(type: ValidationSettings['type']) {
    SettingsModule.setValidationType({ name: 'encryptedWithoutExpectedKeys', type })
  }
}
</script>

<style lang="scss" scoped>
</style>