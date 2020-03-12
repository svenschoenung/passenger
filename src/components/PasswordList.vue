<template>
  <q-virtual-scroll ref="scroll" id="password-list" class="styled-scrollbar"
   :items="textFilteredList"
   :virtual-scroll-item-size="ROW_HEIGHT" >
     <template v-slot="{ item }">
    <q-item dense :key="item.relPath"
       clickable v-ripple
       @click="select(item.relPath)"
       :class="{
          'item-selected': item.relPath === selected,
          'not-decryptable': !item.annotations.decryptable,
          'not-encryptable': item.annotations.notEncryptable
       }"
       :style="`height: ${ROW_HEIGHT}`">
      <q-item-section avatar>
        <q-icon size="xs" :name="icons[item.folder ? 'folder' : 'password']" :color="item.annotations.notEncryptable ? 'negative' : 'primary'"/>
      </q-item-section>
      <q-item-section avatar v-if="showItemType === 'files-and-folders'">
        <q-icon v-if="item.folder && item.keys.length > 0" size="xs" :name="icons.key" :color="item.annotations.notEncryptable ? 'negative' : 'grey-8'"/>
      </q-item-section>
      <q-item-section class="item-name">
        <span v-html="highlight(item)"></span>
      </q-item-section>
      <q-item-section side>
        <q-icon v-if="item.annotations.notEncryptable" size="1.4em" 
          :name="icons.error" color="negative"/>
      </q-item-section>
    </q-item>
     </template>
  </q-virtual-scroll>
</template>

<script lang="ts">
import { Component, Vue, Ref, Prop } from "vue-property-decorator";
import { scroll, QVirtualScroll } from 'quasar'
import scrollIntoView from 'scroll-into-view-if-needed'
import Fuse, { FuseResultWithMatches } from 'fuse.js'

import { PasswordsModule, UIModule, KeysModule, AppState } from "@/store";
import { PasswordFolder, PasswordNode } from '@/model/passwords';
import { findMatchingKey } from '@/service/keys';
import { setNonReactiveProps, initNonReactiveProp, removeNonReactiveProp, getNonReactiveProp } from '@/util/props';
import { highlight } from '@/util/html'
import icons from "@/ui/icons";
import { OverviewType } from '../store/modules/ui';

const ROW_HEIGHT = 32

@Component({ })
export default class PasswordList extends Vue {
  @Prop({ type: Array }) list!: PasswordNode[]
  @Prop({ type: String }) filter!: string
  @Ref() scroll!: QVirtualScroll

  created() {
    setNonReactiveProps(this, { icons, highlight, ROW_HEIGHT })
    this.registerWatcher()
  }

  mounted() {
    this.scroll.refresh()
    this.scrollTo(this.selected)
    this.registerWatcher()
  }

  activated() {
    this.scroll.refresh()
    this.scrollTo(this.selected)
    this.registerWatcher()
  }

  deactivated() {
    this.unregisterWatcher()
  }

  destroyed() {
    this.unregisterWatcher()
  }

  registerWatcher() {
    initNonReactiveProp(this, 'scrollWatcher', () => new ScrollWatcher(this))
  }

  unregisterWatcher() {
    removeNonReactiveProp(this, 'scrollWatcher', (scrollWatcher: ScrollWatcher) => scrollWatcher.unwatch())
  }

  scrollTo(relPath: string) {
    const items = this.textFilteredItems
    if (!items) {
      return;
    }
    const item = items[relPath]
    if (!item) {
      return;
    }
    const index = item.annotations.index as number
    const virtualScroll = document.getElementById('password-list')
    if (virtualScroll) {
      const start = virtualScroll.scrollTop / ROW_HEIGHT
      const end = start + virtualScroll.offsetHeight / ROW_HEIGHT - 1
      if (index < Math.ceil(start) || index > Math.floor(end)) {
        virtualScroll.scrollTop = (index + 1) * ROW_HEIGHT - virtualScroll.offsetHeight / 2
      }
    }
  }

  select(relPath: string) {
    const scrollWatcher: ScrollWatcher = getNonReactiveProp(this, 'scrollWatcher')
    scrollWatcher.selected = relPath
    UIModule.selectPasswordPath(relPath);
  }

  get selected() {
    return UIModule.selectedPasswordPath as string;
  }

  get showItemType() {
    return UIModule.showItemType
  }

  get menuFilteredList() {
    return this.list && this.list.filter(item => {
      if (UIModule.showItemType === 'files-only' && item.folder) {
        return false
      }
      if (!UIModule.showNotDecryptable && !item.annotations.decryptable) {
        return false
      }
      return true
    }).map((item, index) => ({
      ...item,
      annotations: { ...item.annotations, index }
    }))
  }

  get textFilteredList(): PasswordNode[] {
    const list = this.menuFilteredList
    if (!list || !this.filter) {
      return list
    }
    var options = {
      tokenize: true,
      matchAllTokens: true,
      includeMatches: true,
      threshold: 0.7,
      location: 0,
      distance: 100,
      maxPatternLength: 128,
      minMatchCharLength: 2,
      keys: [ 'fullName' ]
    };
    var fuse = new Fuse(list, options);
    const results = fuse.search(this.filter.trim()) as FuseResultWithMatches<PasswordNode>[];
    return results.map((result: FuseResultWithMatches<PasswordNode>, index) => {
      return {
        ...result.item,
        annotations: {
          ...result.item.annotations, index,
          matches: result.matches && result.matches[0] && result.matches[0].indices,
        }
      }
    });
  }

  get textFilteredItems() {
    const items: { [relPath: string]: PasswordNode } = {}
    const list = this.textFilteredList
    list.forEach(item => items[item.relPath] = item)
    return items
  }
}


class ScrollWatcher {
  selected!: string | null
  unwatch: any;

  constructor(component: PasswordList) {
    this.selected = component.selected
    this.unwatch = component.$store.watch(
      (state: AppState) => state.ui.selectedPasswordPath,
      (selected: string | null) => {
        if (selected && selected !== this.selected) {
          component.scrollTo(selected)
        }
        this.selected = selected;
      })
  }
}

</script>

<style lang="scss">
@import "src/styles/style.variables.scss";

#password-list {
    .q-item__section--avatar {
      min-width: 24px;
    }

    .q-item__section--side {
      padding-right: 5px;
    }

    .not-decryptable {
        opacity: 0.2
    }

    .item-name {
      white-space: nowrap;
    }
}


body.body--light {
  #password-list {
    .item-selected {
      background: $bg-primary-light;
    }

    .item-name {
      color: $dark;

      b {
        color: $primary;
      }
    }

    .not-encryptable .item-name {
      color: $negative;
    }
  }
}

body.body--dark {
  #password-list {
    .item-selected {
      background: $bg-primary-dark;
    }

    .item-name {
      color: white;

      b {
        color: $primary;
      }
    }

    .not-encryptable .item-name {
      color: $negative;
    }
  }
}
</style>