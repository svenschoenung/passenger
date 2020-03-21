<template>
  <q-layout id="config-page" class="content-height" container view="lhr Lpr lfr">
    <vue-headful title="Passenger: Settings" />
    <q-drawer bordered show-if-above :breakpoint="0" :width="200" class="bg-grey-4">
      <q-list separator v-roving-tabindex-container>
        <q-item clickable v-ripple v-roving-tabindex
          :active="settingsPage === 'repo'"
          active-class="active-elem"
          @click="changeSettingsPage('repo')">
          <q-item-section>
            <q-item-label>Repository</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable v-ripple v-roving-tabindex
          :active="settingsPage === 'keys'"
          active-class="active-elem"
          @click="changeSettingsPage('keys')">
          <q-item-section>
            <q-item-label>GPG</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable v-ripple v-roving-tabindex
          :active="settingsPage === 'ui'"
          active-class="active-elem"
          @click="changeSettingsPage('ui')">
          <q-item-section>
            <q-item-label>Appearance</q-item-label>
          </q-item-section>
        </q-item>
        <q-separator />
      </q-list>
    </q-drawer>

    <q-page-container>
      <component :is="settingsPageComponent"></component>
    </q-page-container>

  </q-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import { UIModule } from '@/store'
import { SettingsPageType } from '@/store/modules/ui'

@Component({ })
export default class SettingsPage extends Vue {
  get settingsPage() {
    return UIModule.settingsPage
  }

  get settingsPageComponent() {
    return 'settings-' + UIModule.settingsPage + '-page'
  }

  changeSettingsPage(settingsPage: SettingsPageType) {
    UIModule.setSettingsPage(settingsPage)
  }
}
</script>

<style lang="scss">
@import "src/styles/style.variables.scss";

.body--light {
  #config-page {
    .q-drawer__content {
      background: $bg-1-light;
    }
  }
}

.body--dark {
  #config-page {
    .q-drawer__content {
      background: $bg-1-dark;
    }
  }
}
</style>