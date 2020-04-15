<template>
  <q-item tag="label" @click.prevent="toggleColorTheme" class="color-theme-picker">
    <q-item-section>
        <q-item-label>Color theme</q-item-label>
    </q-item-section>
    <q-item-section side>
        <q-btn-toggle rounded flat @click.stop
            v-model="colorTheme"
            toggle-color="primary"
            toggle-text-color="white"
            :options="[
                {label: 'Light', value: 'light'},
                {label: 'System', value: 'system'},
                {label: 'Dark', value: 'dark'}
            ]"/>
    </q-item-section>
  </q-item>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator'
import { SettingsModule } from '@/store'
import { ColorTheme } from '@/store/modules/settings'

const colorThemes: ColorTheme[] = ['light', 'system', 'dark']

@Component({})
export default class ColorThemePicker extends Vue {
  @Prop({ type: String }) value!: ColorTheme

  get colorTheme() {
    return this.value
  }

  set colorTheme(colorTheme: ColorTheme) {
    this.changeColorTheme(colorTheme)
  }

  toggleColorTheme() {
    this.changeColorTheme(colorThemes[(colorThemes.indexOf(this.colorTheme) + 1) % colorThemes.length])
  }

  @Emit('input')
  changeColorTheme(colorTheme: ColorTheme) {
      return colorTheme
  }
}
</script>

<style lang="scss">
@import "src/styles/style.variables.scss";

.color-theme-picker {
  .q-btn-group button.text-white {
        background: $primary !important;
  }
}

body.body--light {
  .color-theme-picker {
    .q-btn-group button {
        background: $grey-4;
    }
    &:hover .q-btn-group button {
        background: $grey-1; 
    }
  }
}

body.body--dark {
  .color-theme-picker {
    .q-btn-group button {
        background: $grey-8;
    }
  }
}
</style>