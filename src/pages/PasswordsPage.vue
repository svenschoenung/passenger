<template>
  <q-splitter id="passwords-page" class="content-height"
     v-model="overviewWidth" unit="px"
     :limits="[0, Infinity]" >
    <vue-headful :title="`Passenger: Passwords ${selectedPasswordNodeName}`" />
    <template v-slot:before>
      <password-overview/>
    </template>
    <template v-slot:separator>
      <div 
          class="toggle"
          @click.stop="toggleSplitter"
          @dragstart="dragging = true"
          @dragend="dragging = false">
      </div>
    </template>
    <template v-slot:after>
      <centered-progress v-if="selectedPasswordNode.resolving"/>
      <centered-error v-if="selectedPasswordNode.error" :error="selectedPasswordNode.error"/>
      <password-folder-details v-else-if="selectedPasswordNode.value && selectedPasswordNode.value.folder"
        :folder="selectedPasswordNode.value" :key="selectedPasswordNode.value.relPath"
      />
      <password-file-details v-else-if="selectedPasswordNode.value && !selectedPasswordNode.value.folder"
        :file="selectedPasswordNode.value" :key="selectedPasswordNode.value.relPath"
      />
    </template>
  </q-splitter>
</template>

<script lang="ts">
import { Component, Vue, Ref } from "vue-property-decorator";

import { PasswordsModule, UIModule, PreferencesModule } from '@/store';
import { setNonReactiveProps, initNonReactiveProp, removeNonReactiveProp } from '@/util/props';

const MIN_WIDTH = 100

@Component({})
export default class PasswordsPage extends Vue {
  dragging = false

  get selectedPasswordNode() {
    return PasswordsModule.selectedPasswordNode
  }

  get selectedPasswordNodeName() {
    if (this.selectedPasswordNode.value) {
      return '- ' + this.selectedPasswordNode.value.fullName
    }
    return ''
  }

  get overviewCollapsed() {
    return PreferencesModule.overviewCollapsed
  }

  get overviewWidth() {
    if (this.overviewCollapsed) {
      return 0
    }
    return PreferencesModule.overviewWidth
  }

  set overviewWidth(overviewWidth: number) {
    if (!this.overviewCollapsed && overviewWidth < MIN_WIDTH) {
      PreferencesModule.setOverviewCollapsed(true)
      return
    }
    if (this.overviewCollapsed) {
      PreferencesModule.setOverviewCollapsed(false)
      if (overviewWidth < MIN_WIDTH) {
        PreferencesModule.setOverviewWidth(MIN_WIDTH)
        return
      }
    } 
    PreferencesModule.setOverviewWidth(overviewWidth)
  }

  toggleSplitter() {
    if (!this.dragging) {
      PreferencesModule.toggleOverviewCollapsed()
    }
  }
}
</script>

<style lang="scss">
#passwords-page {
  .q-splitter__panel.q-splitter__before {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }

  .q-splitter__panel.q-splitter__after {
    display: flex;
  }

  .toggle {
    width: 10px;
    height: 50px;
    background: gray;
    opacity: 0.8;
    margin-left: 5px;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
  }
}
</style>