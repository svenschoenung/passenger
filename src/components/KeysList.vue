<template>
  <div class="flex direction-column keys-list">
    <q-toolbar>{{title}}</q-toolbar>
    <q-list bordered class="flex flex-grow" v-roving-tabindex-container>
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
import { RovingTabindexContainer, RovingTabindex } from '@4rk/vue-roving-tabindex'
import icons from "@/ui/icons";

@Component({
  name: "keys-page",
  components: {},
  directives: {
      RovingTabindexContainer,
      RovingTabindex
  }
})
export default class KeysList extends Vue {
  @Prop() title!: string;
  @Prop() keys!: GenericKey[];

  selectionStart = -1;
  selectionEnd = -1;
  selectedKeys: { [keyid: string]: boolean } = {};

  created() {
    (this as any).icons = icons;
    (this as any).mouseupListener = (e: MouseEvent) => {
      if (this.isSelecting()) {
        this.finishSelecting();
      }
    };
    window.addEventListener("mouseup", (this as any).mouseupListener);
  }

  destroyed() {
    window.removeEventListener("mouseup", (this as any).mouseupListener);
  }

  isSelecting() {
    return this.selectionStart >= 0 && this.selectionEnd >= 0;
  }

  get selectedAndSelectingKeys() {
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
    if (!editSelection) {
      this.selectedKeys = {};
    }
    this.selectionStart = index;
    this.selectionEnd = index;
  }

  endSelection(index: number) {
    if (this.isSelecting()) {
      this.selectionEnd = index;
    }
  }

  finishSelecting() {
    this.selectedKeys = this.selectedAndSelectingKeys;
    this.selectionStart = -1;
    this.selectionEnd = -1;
  }
}
</script>

<style lang="scss">
@import "src/styles/quasar.variables.scss";

.keys-list {
  .q-my-sm {
    margin-top: 0px;
    margin-bottom: 0px;
  }
}

body.body--light {
  .keys-list {
    .highlighted-key {
      background: $bg-primary-light;
    }
  }
}

body.body--dark {
  .keys-list {
    .highlighted-key {
      background: $bg-primary-dark;
    }
  }
}
</style>