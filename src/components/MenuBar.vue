<template>
    <q-scroll-area class="fit text-primary"
      :content-style="{ height: '100% !important' }">
        <q-list padding class="fit">
            <q-item clickable v-ripple
              :active="page === 'passwords'"
              active-class="active-page"
              @click="changePage('passwords')">
                <q-item-section avatar>
                    <q-icon :name="icons.passwords" />
                </q-item-section>
            </q-item>
            <q-item clickable v-ripple
              :active="page === 'keys'"
              active-class="active-page"
              @click="changePage('keys')">
                <q-item-section avatar>
                    <q-icon :name="icons.keys" />
                </q-item-section>
            </q-item>
            <q-item clickable v-ripple
              :active="page === 'repo'"
              active-class="active-page"
              @click="changePage('repo')">
                <q-item-section avatar>
                    <q-icon :name="icons.repo" />
                </q-item-section>
            </q-item>
            <q-space/>
            <q-item clickable v-ripple
              :active="page === 'config'"
              active-class="active-page"
              @click="changePage('config')"
              class="justify-end">
                <q-item-section avatar>
                    <q-icon :name="icons.config" />
                </q-item-section>
            </q-item>
        </q-list>
    </q-scroll-area>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import { UIModule } from '../store'
import icons from '@/ui/icons';

@Component({
  components: {
  },
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

.active-page {
    background: rgba($primary, $alpha: .2);
    border-right: 2px solid $primary;
}
</style>