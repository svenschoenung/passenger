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
              <component :is="pageComponent"></component>
          </q-page-container>

          <q-footer class="status-bar" :style="{ height: `${footerHeight}px` }">
          </q-footer>
      </q-layout>
    </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator';

import PasswordsPage from './pages/PasswordsPage'
import KeysPage from './pages/KeysPage'
import RepoPage from './pages/RepoPage'
import ConfigPage from './pages/ConfigPage'

import MenuBar from './components/MenuBar'
import SetupDialog from './components/SetupDialog'

import { UIModule } from './store'
import { ConfigModule } from './store'

import { FOOTER_HEIGHT } from '@/constants'

@Component({
  components: {
    PasswordsPage,
    KeysPage,
    RepoPage,
    ConfigPage,
    MenuBar,
    SetupDialog
  },
})
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
