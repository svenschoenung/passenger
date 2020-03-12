<template>
<div id="password-overview" class="flex direction-column flex-grow bg-1">
    <q-input class="q-pa-sm" filled square v-model="filter" :dense="true" placeholder="Filter">
      <template v-slot:append>
        <q-icon v-if="filter" :name="icons.clear" class="cursor-pointer" @click="clearFilter" />
      </template>
      <template v-slot:after>
        <q-btn size="sm" flat class="menu-button"><q-icon :name="icons.menu" />
          <q-menu anchor="bottom right" self="top right">
          <q-list dense style="width: 200px">
            <q-item clickable v-close-popup>
              <q-item-section>
                <q-radio dense size="xs" v-model="overviewType" val="tree" label="Tree view"/>
              </q-item-section>
            </q-item>
            <q-item clickable v-close-popup>
              <q-item-section>
                <q-radio dense size="xs" v-model="overviewType" val="list" label="List view"/>
              </q-item-section>
            </q-item>
            <template v-if="overviewType === 'tree'">
            </template>
            <template v-if="overviewType === 'list'">
              <q-separator/>
              <q-item clickable v-close-popup>
                <q-item-section>
                  <q-radio dense size="xs" v-model="showItemType" val="files-and-folders" label="Show files and folders"/>
                </q-item-section>
              </q-item>
              <q-item clickable v-close-popup>
                <q-item-section>
                  <q-radio dense size="xs" v-model="showItemType" val="files-only" label="Show files only"/>
                </q-item-section>
              </q-item>
            </template>
            <q-separator/>
            <q-item clickable v-close-popup>
              <q-item-section>
                <q-checkbox dense size="xs" v-model="showNotDecryptable" label="Show inaccessible"/>
              </q-item-section>
            </q-item>
          </q-list>
        </q-menu>
        </q-btn>
      </template>
    </q-input>
    <template v-if="overviewType === 'list' && list.value">
      <password-list :filter="filter" :list="list.value"/>
    </template>
    <template v-else-if="overviewType === 'tree' && tree.value">
      <password-tree :filter="filter" :tree="tree.value"/>
    </template>
    <template v-else-if="model.resolving">
      <centered-progress />
    </template>
    <template v-else-if="model.error">
      <centered-error :error="model.error"/>
    </template>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Ref } from "vue-property-decorator";
import { debounce } from 'quasar';

import { UIModule, PasswordsModule } from "@/store";
import { setNonReactiveProps, getNonReactiveProp } from '@/util/props';
import { OverviewType, ItemType } from '@/store/modules/ui';
import { PasswordFolder } from '@/model/passwords';
import icons from "@/ui/icons";

@Component({})
export default class PasswordOverview extends Vue {

  created() {
    setNonReactiveProps(this, { icons, debouncedFilter: debounce((filter: string) => {
      UIModule.setFilter(filter)
    }, 200)})
  }

  get filter() {
    return UIModule.filter
  }

  set filter(filter: string) {
    const debouncedFilter: (f: string) => void = getNonReactiveProp(this, 'debouncedFilter')
    debouncedFilter(filter)
  }

  get overviewType() {
    return UIModule.overviewType
  }

  set overviewType(overviewType: OverviewType) {
    UIModule.setOverviewType(overviewType)
  }

  get showItemType() {
    return UIModule.showItemType
  }

  set showItemType(showItemType: ItemType) {
    UIModule.setShowItemType(showItemType)
  }

  get showNotDecryptable() {
    return UIModule.showNotDecryptable
  }

  set showNotDecryptable(showNotDecryptable: boolean) {
    UIModule.setShowNotDecryptable(showNotDecryptable)
  }

  get model() {
    switch (this.overviewType) {
      case 'tree': return this.tree
      case 'list': return this.list
    }
    return null
  }

  get tree() {
    return PasswordsModule.tree
  }

  get list() {
    return PasswordsModule.list
  }

  clearFilter() {
      this.filter = ''
  }
}
</script>

<style lang="scss">
@import "src/styles/style.variables.scss";

#password-overview {
    .menu-button {
        height: 100%;
        .q-btn__wrapper {
            padding: 0px 2px;
        }
    }

}
</style>