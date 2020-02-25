<template>
    <q-layout view="lHh lpR fFf">
        <q-drawer elevated
          :value="true" 
          :mini="true"
          :breakpoint="0">
            <menu-bar/> 
        </q-drawer> 

        <q-page-container>
            <component v-bind:is="pageComponent"></component>
        </q-page-container>

        <q-footer class="status-bar">
        </q-footer>
    </q-layout>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator';

import PasswordsPage from './pages/PasswordsPage'
import KeysPage from './pages/KeysPage'
import RepoPage from './pages/RepoPage'
import ConfigPage from './pages/ConfigPage'

import MenuBar from './components/MenuBar'

import { UIModule } from './store'

@Component({
  components: {
    PasswordsPage,
    KeysPage,
    RepoPage,
    ConfigPage,
    MenuBar
  },
})
export default class App extends Vue {
  get pageComponent() {
    return UIModule.page + '-page'
  }
}
</script>

<style lang="scss" scoped>
.status-bar {
    height: 30px;
    padding: 5px;
    font-weight: bold;
}
</style>
