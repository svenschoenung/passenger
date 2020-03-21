<template>
<div id="password-overview" class="flex direction-column flex-grow bg-1">
    <q-input class="q-pa-sm" filled square v-model="filter" :dense="true" placeholder="Filter">
      <template v-slot:append>
        <q-icon v-if="filter" :name="icons.clear" class="cursor-pointer" @click="clearFilter" />
      </template>
      <template v-slot:after>
        <q-btn size="sm" flat class="menu-button"><q-icon :name="icons.menu" size="sm"/>
          <q-menu anchor="bottom right" self="top right">
          <q-list dense style="width: 200px" v-roving-tabindex-container>
            <template v-if="overviewType === 'list'">
              <q-separator/>
              <q-item clickable v-close-popup v-roving-tabindex>
                <q-item-section>
                  <q-radio dense size="xs" v-model="showItemType" val="files-and-folders" label="Show files and folders"/>
                </q-item-section>
              </q-item>
              <q-item clickable v-close-popup v-roving-tabindex>
                <q-item-section>
                  <q-radio dense size="xs" v-model="showItemType" val="files-only" label="Show files only"/>
                </q-item-section>
              </q-item>
            </template>
            <q-separator/>
            <q-item clickable v-close-popup v-roving-tabindex>
              <q-item-section>
                <q-checkbox dense size="xs" v-model="showNotDecryptable" label="Show inaccessible"/>
              </q-item-section>
            </q-item>
          </q-list>
        </q-menu>
        </q-btn>
      </template>
    </q-input>
    <q-toolbar dense class="toolbar bg-0">
      <q-btn flat dense size="xs" @click="overviewType = 'tree'" :class="{ 'active-elem': overviewType === 'tree' }">
        <q-icon :name="icons.tree" size="xs" />
        <q-tooltip :delay="1000">Tree view</q-tooltip>
      </q-btn>
      <q-btn flat dense size="xs" @click="overviewType = 'list'" :class="{ 'active-elem': overviewType === 'list' }">
        <q-icon :name="icons.list" size="xs" />
        <q-tooltip :delay="1000">List view</q-tooltip>
      </q-btn>
      <q-space/>
      <q-btn flat dense size="xs" @click="refresh">
        <q-icon :name="icons.refresh" size="xs" />
        <q-tooltip :delay="1000">Refresh</q-tooltip>
      </q-btn>
      <q-btn flat dense size="xs" :disable="!selectedPasswordPath" @click="linkUpWithEditor">
        <q-icon :name="icons.linkWithEditor" size="xs" />
        <q-tooltip :delay="1000">Link up with editor</q-tooltip>
      </q-btn>
    </q-toolbar>
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

import { UIModule, PasswordsModule, PreferencesModule } from "@/store";
import { setNonReactiveProps, getNonReactiveProp } from '@/util/props';
import { OverviewType, ItemType } from '@/store/modules/ui';
import { PasswordFolder } from '@/model/passwords';
import PasswordList from '@/components/PasswordList.vue';
import PasswordTree from '@/components/PasswordTree.vue';
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
    return PreferencesModule.overviewType
  }

  set overviewType(overviewType: OverviewType) {
    PreferencesModule.setOverviewType(overviewType)
  }

  get showItemType() {
    return PreferencesModule.showItemType
  }

  set showItemType(showItemType: ItemType) {
    PreferencesModule.setShowItemType(showItemType)
  }

  get showNotDecryptable() {
    return PreferencesModule.showNotDecryptable
  }

  set showNotDecryptable(showNotDecryptable: boolean) {
    PreferencesModule.setShowNotDecryptable(showNotDecryptable)
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

  get selectedPasswordPath() {
    return UIModule.selectedPasswordPath
  }

  clearFilter() {
      this.filter = ''
  }

  linkUpWithEditor() {
    if (UIModule.selectedPasswordPath) {
      UIModule.gotoPasswordPath(UIModule.selectedPasswordPath)
    }
  }

  async refresh() {
    await PasswordsModule.loadPasswordsFromFileSystem()
    
  }
}
</script>

<style lang="scss">
@import "src/styles/style.variables.scss";

#password-overview {
    .menu-button {
        height: 100%;
        .q-btn__wrapper {
            padding: 0px 0px;
        }
    }

    .toolbar {
        min-height: $overview-toolbar-height;
        height: $overview-toolbar-height;
    }
}

body.body--light {
  #password-overview {
    .toolbar {
        border-top: 1px solid $grey-4;
        border-bottom: 1px solid $grey-4;
    }
  }
}

body.body--dark {
  #password-overview {
    .toolbar {
        border-top: 1px solid $grey-8;
        border-bottom: 1px solid $grey-8;
    }
  }
}

</style>