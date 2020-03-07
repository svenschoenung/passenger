<template> 
    <div>
      <setup-dialog :show="!isSetup"/>
      <q-layout v-if="isSetup" view="lHh lpR fFf">
          <q-drawer elevated
            :value="true" 
            :mini="true"
            :breakpoint="0">
              <menu-bar/> 
          </q-drawer> 

          <q-page-container>
            <keep-alive>
              <component :is="pageComponent"></component>
            </keep-alive>
          </q-page-container>

          <q-footer class="status-bar" :style="{ height: `${footerHeight}px` }">
          </q-footer>
      </q-layout>
    </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator';

import { UIModule, ConfigModule } from '@/store'
import { FOOTER_HEIGHT } from '@/constants'


@Component({})
export default class App extends Vue {
  footerHeight = FOOTER_HEIGHT

  created() {
    this.$q.dark.set(ConfigModule.darkMode)
  }

  get pageComponent() {
    return UIModule.page + '-page'
  }

  get isSetup() {
    return !!ConfigModule.repoPath
  }
}

</script>

<style lang="scss" scoped>
.status-bar {
    padding: 5px;
    font-weight: bold;
}
</style>
