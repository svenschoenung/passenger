<template>
    <q-scroll-area class="fit text-primary"
      :content-style="{ height: '100% !important' }">
        <q-list padding class="fit">
            <q-item clickable v-ripple
              :active="page === 'passwords'"
              active-class="active-page"
              @click="changePage('passwords')">
                <q-item-section avatar>
                    <q-icon :name="iconPasswords" />
                </q-item-section>
            </q-item>
            <q-item clickable v-ripple
              :active="page === 'keys'"
              active-class="active-page"
              @click="changePage('keys')">
                <q-item-section avatar>
                    <q-icon :name="iconKeys" />
                </q-item-section>
            </q-item>
            <q-item clickable v-ripple
              :active="page === 'repo'"
              active-class="active-page"
              @click="changePage('repo')">
                <q-item-section avatar>
                    <q-icon :name="iconRepo" />
                </q-item-section>
            </q-item>
            <q-space/>
            <q-item clickable v-ripple
              :active="page === 'config'"
              active-class="active-page"
              @click="changePage('config')"
              class="justify-end">
                <q-item-section avatar>
                    <q-icon :name="iconConfig" />
                </q-item-section>
            </q-item>
        </q-list>
    </q-scroll-area>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import { ionIosLock } from '@quasar/extras/ionicons-v4'
import { ionIosKey } from '@quasar/extras/ionicons-v4'
import { ionIosGitCompare } from '@quasar/extras/ionicons-v4'
import { ionIosConstruct } from '@quasar/extras/ionicons-v4'

import { UIModule } from '../store'

@Component({
  components: {
  },
})
export default class MenuBar extends Vue {
    created() {
        (this as any).iconPasswords = ionIosLock;
        (this as any).iconKeys = ionIosKey;
        (this as any).iconRepo = ionIosGitCompare;
        (this as any).iconConfig = ionIosConstruct;
    }

    get page(): string {
        return UIModule.page;
    }

    changePage(page: string) {
        UIModule.changePageAction(page)
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