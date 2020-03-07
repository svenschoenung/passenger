<template>
  <div :class="`flex direction-column key-list-container ${disabled ? 'disabled' : ''}`">
    <q-toolbar>{{title}} <q-chip dense color="primary">{{keys ? keys.length : 0}}</q-chip></q-toolbar>
    <q-list bordered class="flex flex-grow key-list" v-roving-tabindex-container :disabled="disabled">
      <q-scroll-area class="flex-grow">
        <q-item v-for="(key, index) in keys" :key="key.keyid"
          class="q-my-sm" clickable v-ripple v-roving-tabindex
          @mousedown.exact="startSelection(index, false)"
          @mousedown.ctrl="startSelection(index, true)"
          @mousedown.meta="startSelection(index, true)"
          @mouseover="endSelection(index)"
          :class="selectedAndSelectingKeys[key.keyid] ? 'highlighted-key' : ''"
        >
          <q-item-section avatar>
            <q-avatar color="primary" text-color="white">
              <q-icon :name="icons.key" />
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label>{{ key.keyid }}</q-item-label>
            <q-item-label
              caption
              lines="1"
              v-for="uid in key.uid"
              :key="uid.user_id"
            >{{uid.user_id}}</q-item-label>
          </q-item-section>
        </q-item>
      </q-scroll-area>
    </q-list>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { GenericKey } from "gpg-promised";
import { nonReactiveProps, nonReactiveProp } from '../util/props';
import icons from "@/ui/icons";

export type MouseEventListener = (this: Window, ev: MouseEvent) => any 

@Component({})
export default class KeyList extends Vue {
  @Prop() title!: string;
  @Prop() keys!: GenericKey[];
  @Prop() disabled!: boolean;

  selectionStart = -1;
  selectionEnd = -1;
  selectedKeys: { [keyid: string]: boolean } = {};

  created() {
    nonReactiveProps(this, { icons })
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
    const mouseupListener: MouseEventListener = nonReactiveProp(this, 'mouseupListener')
    if (!mouseupListener) {
      const mouseupListener = (e: MouseEvent) => {
        if (this.isSelecting()) {
          this.finishSelecting();
        }
      };
      nonReactiveProps(this, { mouseupListener })
      window.addEventListener("mouseup", mouseupListener);
    }
  }
  
  unregisterListener() {
    const mouseupListener: MouseEventListener = nonReactiveProp(this, 'mouseupListener')
    if (mouseupListener) {
      nonReactiveProps(this, { mouseupListener: null })
      window.removeEventListener("mouseup", mouseupListener);
    }
  }

  isSelecting() {
    return !this.disabled && this.selectionStart >= 0 && this.selectionEnd >= 0;
  }

  get selectedAndSelectingKeys() {
    if (this.disabled) {
      return {}
    }
    if (this.isSelecting()) {
      const start = Math.min(this.selectionStart, this.selectionEnd);
      const end = Math.max(this.selectionStart, this.selectionEnd);
      const selectedAndSelectingKeys = { ...this.selectedKeys };
      const selectingKeys = this.keys.slice(start, end + 1).map(k => k.keyid);
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
  }
}
</script>

<style lang="scss">
@import "src/styles/quasar.variables.scss";

.key-list-container {
  .q-my-sm {
    margin-top: 0px;
    margin-bottom: 0px;
  }

  &.disabled .q-toolbar {
    opacity: 0.4;
  }
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