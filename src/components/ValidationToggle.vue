<template>
  <q-item tag="label" @click.prevent="toggleEnable" class="settings-btn-toggle validation-toggle">
    <q-item-section avatar>
      <q-toggle dense v-model="validationEnable"/>
    </q-item-section>
    <q-item-section :class="{ disabled: !validationEnable, 'cursor-pointer': true }">
      <q-item-label>{{title}}</q-item-label>
    </q-item-section>
    <q-item-section side>
        <q-btn-toggle rounded flat @click.stop
            :class="{ disabled: !validationEnable }"
            v-model="validationType"
            toggle-color="primary"
            toggle-text-color="white"
            :disable="!validationEnable"
            :options="[
                {label: 'Warning', value: 'warning', icon: icons.warning },
                {label: 'Error', value: 'error', icon: icons.error }
            ]"/>
    </q-item-section>
  </q-item>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit, PropSync } from 'vue-property-decorator'
import { SettingsModule } from '@/store'
import { ColorTheme, ValidationSettings } from '@/store/modules/settings'
import { ProblemType } from '@/store/modules/problems'
import { setNonReactiveProps } from '../util/props'
import icons from '@/ui/icons'

const colorThemes: ColorTheme[] = ['light', 'system', 'dark']

@Component({})
export default class Validation extends Vue {
  @Prop({ type: String }) title!: string
  @PropSync('enable', { type: Boolean }) validationEnable!: boolean
  @PropSync('type', { type: String }) validationType!: ProblemType

  created() {
    setNonReactiveProps(this, { icons })
  }

  toggleEnable() {
    this.$emit('update:enable', !this.validationEnable)
  }
}
</script>

<style lang="scss">
@import "src/styles/style.variables.scss";
.validation-toggle {
  .disabled.cursor-pointer, .disabled.cursor-pointer * {
    cursor: pointer !important;
  }

  svg {
    margin: 0px;
    margin-left: -8px;
    margin-right: 5px;
    padding: 0px;
    height: 0.8em;
  }
}
</style>