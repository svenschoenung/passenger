<template>
  <div class="flex direction-column key-list-container">
    <q-toolbar class="q-pa-none">
      <template v-for="item in toolbar">
        <span v-if="item === 'title'" :key="item" :class="{'disabled': disabled}">
          {{title}}
          <q-chip dense color="primary" class="text-white q-px-sm" >{{keys.value ? keys.value.length : 0}}</q-chip>
        </span>
        <q-btn v-else-if="item === 'refresh'" :key="item" @click="refresh" dense flat>
          <q-icon :name="icons.refresh" size="xs"/>
        </q-btn>
        <q-btn v-else-if="item === 'delete'" :key="item" @click="deleteKeys" dense flat :disable="deleteDisabled">
          <q-icon :name="icons.trash" size="xs"/>
        </q-btn>
        <folder-button v-else-if="item === 'ancestor'" :key="item" :folder="ancestor" icon="up"/>
        <q-space v-else-if="item === ' '" :key="item"/>
        <q-separator v-else-if="item === '|'" :key="item"/>
      </template>
    </q-toolbar>
    <q-list bordered class="flex flex-grow key-list" v-roving-tabindex-container :disabled="disabled">
      <centered-progress v-if="keys.resolving" class="flex-grow"/>
      <centered-error v-if="keys.error" :error="keys.error" class="flex-grow"/>
      <styled-scrollbar v-else-if="keys.success">
        <q-item v-for="(key, index) in keys.value" :key="key.keyid"
          class="q-my-sm" clickable v-ripple v-roving-tabindex
          @mousedown.exact="startSelection(index, false)"
          @mousedown.ctrl="startSelection(index, true)"
          @mousedown.meta="startSelection(index, true)"
          @mouseover="endSelection(index)"
          :class="selectedAndSelectingKeys[key.keyid] ? 'highlighted-key' : ''">
          <q-item-section avatar v-if="key.unknown">
            <q-avatar color="negative" text-color="white">
              <q-icon :name="icons.unknown" size="lg"/>
            </q-avatar>
          </q-item-section>
          <q-item-section avatar v-else>
            <q-avatar color="primary" text-color="white">
              <q-icon :name="icons.key" />
            </q-avatar>
          </q-item-section>

          <q-item-section :class="{ 'text-negative': key.unknown }">
            <q-item-label>{{ key.keyid }}</q-item-label>
            <q-item-label :class="{ 'text-negative': key.unknown, 'text-italic': key.unknown }"
              caption
              lines="1"
              v-for="uid in key.uid"
              :key="uid.user_id"
            >{{uid.user_id}}</q-item-label>
          </q-item-section>
        </q-item>
      </styled-scrollbar>
    </q-list>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from "vue-property-decorator";
import { GenericKey } from "gpg-promised";

import { setNonReactiveProps, initNonReactiveProp, removeNonReactiveProp } from '@/util/props';
import { PasswordFolder } from '@/model/passwords';
import { Resolvable } from '@/store/resolvable';
import icons from "@/ui/icons";

export type MouseEventListener = (this: Window, ev: MouseEvent) => any 

@Component({})
export default class KeyList extends Vue {
  @Prop() title!: string;
  @Prop() keys!: Resolvable<GenericKey[]>;
  @Prop() disabled!: boolean;
  @Prop() ancestor!: PasswordFolder
  @Prop() toolbar!: ('title' | 'refresh' | 'delete' | 'ancestor' | ' ' | '|')[]

  selectionStart = -1;
  selectionEnd = -1;
  selectedKeys: { [keyid: string]: boolean } = {};

  created() {
    setNonReactiveProps(this, { icons })
    this.registerListener()
  }

  activated() {
    this.registerListener()
  }

  deactivated() {
    this.unregisterListener()
  }

  destroyed() {
    this.unregisterListener()
  }

  registerListener() {
    initNonReactiveProp(this, 'mouseupListener', () => {
      const mouseupListener = (e: MouseEvent) => {
        if (this.isSelecting()) {
          this.finishSelecting();
        }
      };
      window.addEventListener("mouseup", mouseupListener);
      return mouseupListener
    })
  }
  
  unregisterListener() {
    removeNonReactiveProp(this, 'mouseupListener', (mouseupListener) => {
      window.removeEventListener("mouseup", mouseupListener);
    })
  }

  isSelecting() {
    return !this.disabled && this.selectionStart >= 0 && this.selectionEnd >= 0;
  }

  get selectedAndSelectingKeys() {
    if (this.disabled || !this.keys.value) {
      return {}
    }
    if (this.isSelecting()) {
      const start = Math.min(this.selectionStart, this.selectionEnd);
      const end = Math.max(this.selectionStart, this.selectionEnd);
      const selectedAndSelectingKeys = { ...this.selectedKeys };
      const selectingKeys = this.keys.value.slice(start, end + 1).map(k => k.keyid);
      selectingKeys.forEach(selectingKey => {
        const isSelected = selectedAndSelectingKeys[selectingKey];
        if (isSelected) {
          delete selectedAndSelectingKeys[selectingKey];
        } else {
          selectedAndSelectingKeys[selectingKey] = true;
        }
      });
      return selectedAndSelectingKeys;
    } else {
      return this.selectedKeys;
    }
  }

  startSelection(index: number, editSelection: boolean) {
    if (this.disabled) {
      return
    }
    if (!editSelection) {
      this.selectedKeys = {};
    }
    this.selectionStart = index;
    this.selectionEnd = index;
  }

  endSelection(index: number) {
    if (this.disabled) {
      return
    }
    if (this.isSelecting()) {
      this.selectionEnd = index;
    }
  }

  finishSelecting() {
    if (this.disabled) {
      return
    }
    this.selectedKeys = this.selectedAndSelectingKeys;
    this.selectionStart = -1;
    this.selectionEnd = -1;
    if (document.activeElement && (document.activeElement as HTMLElement).blur) {
      (document.activeElement as HTMLElement).blur()
    }
  }

  get deleteDisabled() {
    return !this.keys.value || Object.keys(this.selectedKeys).length === 0
  }

  @Emit('refresh')
  refresh() { }

  @Emit('delete')
  deleteKeys() {
    return this.keys.value!.filter(key => this.selectedKeys[key.keyid])
  }
}
</script>

<style lang="scss">
@import "src/styles/style.variables.scss";

.key-list-container {
  .q-my-sm {
    margin-top: 0px;
    margin-bottom: 0px;
  }

  &.disabled .q-toolbar {
    opacity: 0.4;
  }
}

.key-list {
  position: relative;
}

body.body--light {
  .key-list-container {
    .key-list {
      background: $bg-1-light;
    }

    .highlighted-key {
      background: $bg-primary-light;
    }
  }
}

body.body--dark {
  .key-list-container {
    .key-list {
      background: $bg-1-dark;
    }

    .highlighted-key {
      background: $bg-primary-dark;
    }
  }
}
</style>