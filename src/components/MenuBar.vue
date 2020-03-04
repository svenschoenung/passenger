<template>
    <q-scroll-area class="fit text-primary"
      :content-style="{ height: '100% !important' }">
        <q-list padding class="fit" v-roving-tabindex-container>
            <q-item clickable v-ripple v-roving-tabindex
              :active="page === 'passwords'"
              active-class="active-elem"
              @click="changePage('passwords')">
                <q-item-section avatar>
                    <q-icon :name="icons.passwords" />
                </q-item-section>
                <q-tooltip anchor="center right" self="center left" :delay="1000">
                    Passwords
                </q-tooltip>
            </q-item>
            <q-item clickable v-ripple v-roving-tabindex
              :active="page === 'keys'"
              active-class="active-elem"
              @click="changePage('keys')">
                <q-item-section avatar>
                    <q-icon :name="icons.keys" />
                </q-item-section>
                <q-tooltip anchor="center right" self="center left" :delay="1000">
                    GPG-Keys
                </q-tooltip>
            </q-item>
            <q-item clickable v-ripple v-roving-tabindex
              :active="page === 'repo'"
              active-class="active-elem"
              @click="changePage('repo')">
                <q-item-section avatar>
                    <q-icon :name="icons.repo" />
                </q-item-section>
                <q-tooltip anchor="center right" self="center left" :delay="1000">
                    Version Control
                </q-tooltip>
            </q-item>
            <q-space/>
            <q-item clickable v-ripple v-roving-tabindex
              :active="page === 'config'"
              active-class="active-elem"
              @click="changePage('config')"
              class="justify-end">
                <q-item-section avatar>
                    <q-icon :name="icons.config" />
                </q-item-section>
                <q-tooltip anchor="center right" self="center left" :delay="1000">
                    Settings
                </q-tooltip>
            </q-item>
        </q-list>
    </q-scroll-area>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { RovingTabindexContainer, RovingTabindex } from '@4rk/vue-roving-tabindex'

import { UIModule } from '../store'
import icons from '@/ui/icons';

@Component({
  directives: {
      RovingTabindexContainer,
      RovingTabindex
  }
})
export default class MenuBar extends Vue {
    created() {
        (this as any).icons = icons
    }

    get page(): string {
        return UIModule.page;
    }

    changePage(page: string) {
        UIModule.changePage$(page)
    }
}
</script>

<style lang="scss" scoped>
@import "src/styles/quasar.variables.scss";
.q-list {
    display: flex;
    flex-direction: column;
}

.active-elem {
    border-right: 2px solid $primary;
}
</style>