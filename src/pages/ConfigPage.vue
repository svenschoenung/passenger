<template>
  <q-layout id="config-page" container view="lhr Lpr lfr" :style="{ height: `calc(100vh - ${footerHeight}px`}">

    <q-drawer bordered show-if-above :breakpoint="0" :width="200" class="bg-grey-4">
      <q-list separator>
        <q-item clickable v-ripple
          :active="configPage === 'repo'"
          active-class="active-config-page"
          @click="changeConfigPage('repo')">
          <q-item-section>
            <q-item-label>Repository</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable v-ripple
          :active="configPage === 'ui'"
          active-class="active-config-page"
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
import { FOOTER_HEIGHT } from '@/constants'
import { UIModule } from '@/store'
import ConfigRepoPage from '@/pages/config/ConfigRepoPage.vue'
import ConfigUIPage from '@/pages/config/ConfigUIPage.vue'

@Component({
  name: 'config-page',
  components: {
    'config-repo-page': ConfigRepoPage,
    'config-ui-page': ConfigUIPage
  },
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

#config-page {
  .q-drawer__content {
    background: $grey-1;
  }

  .active-config-page {
    background: rgba($primary, $alpha: .2);
  }
}
</style>