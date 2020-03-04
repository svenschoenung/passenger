<template>
  <q-layout id="config-page" container view="lhr Lpr lfr" :style="{ height: `calc(100vh - ${footerHeight}px`}">

    <q-drawer bordered show-if-above :breakpoint="0" :width="200" class="bg-grey-4">
      <q-list separator v-roving-tabindex-container>
        <q-item clickable v-ripple v-roving-tabindex
          :active="configPage === 'repo'"
          active-class="active-elem"
          @click="changeConfigPage('repo')">
          <q-item-section>
            <q-item-label>Repository</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable v-ripple v-roving-tabindex
          :active="configPage === 'keys'"
          active-class="active-elem"
          @click="changeConfigPage('keys')">
          <q-item-section>
            <q-item-label>GPG</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable v-ripple v-roving-tabindex
          :active="configPage === 'ui'"
          active-class="active-elem"
          @click="changeConfigPage('ui')">
          <q-item-section>
            <q-item-label>Appearance</q-item-label>
          </q-item-section>
        </q-item>
        <q-separator />
      </q-list>
    </q-drawer>

    <q-page-container>
      <component :is="configPageComponent"></component>
    </q-page-container>

  </q-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { RovingTabindexContainer, RovingTabindex } from '@4rk/vue-roving-tabindex'
import { FOOTER_HEIGHT } from '@/constants'
import { UIModule } from '@/store'
import ConfigRepoPage from '@/pages/config/ConfigRepoPage.vue'
import ConfigKeysPage from '@/pages/config/ConfigKeysPage.vue'
import ConfigUIPage from '@/pages/config/ConfigUIPage.vue'

@Component({
  name: 'config-page',
  components: {
    'config-repo-page': ConfigRepoPage,
    'config-keys-page': ConfigKeysPage,
    'config-ui-page': ConfigUIPage
  },
  directives: {
    RovingTabindexContainer,
    RovingTabindex
  }
})
export default class ConfigPage extends Vue {
  footerHeight = FOOTER_HEIGHT

  get configPage() {
    return UIModule.configPage
  }

  get configPageComponent() {
    return 'config-' + UIModule.configPage + '-page'
  }

  changeConfigPage(configPage: string) {
    UIModule.changeConfigPage$(configPage)
  }
}
</script>

<style lang="scss">
@import "src/styles/quasar.variables.scss";

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