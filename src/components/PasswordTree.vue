<template>
 <RecycleScroller
    id="password-tree"
    class="styled-scrollbar"
    :items="textFilteredList"
    :item-size="ROW_HEIGHT"
    key-field="relPath"
    v-roving-tabindex-container>
    <template v-slot="{ item }">
    <q-item dense :key="item.relPath"
       clickable v-ripple v-roving-tabindex
       @click="select(item.relPath)"
       @mouseenter.stop.prevent
       @mouseleave.stop.prevent
       :class="{
          'item-selected': item.relPath === selected,
          'not-decryptable': !item.annotations.decryptable,
          'not-encryptable': item.annotations.notEncryptable
       }"
       :style="`height: ${ROW_HEIGHT}`">
      <q-item-section v-for="i in depth(item) + 1" :key="i" avatar>
        <q-icon v-if="item.folder && i === depth(item) + 1" size="xs"
          @click.stop="toggle(item.relPath)"
          :name="icons[item.annotations.expanded ? 'expanded' : 'unexpanded']"
          />
      </q-item-section>
      <q-item-section avatar>
        <q-icon size="xs" :name="icons[item.folder ? 'folder' : 'password']" :color="item.annotations.notEncryptable ? 'negative' : 'primary'"/>
      </q-item-section>
      <q-item-section>
        <span class="item-name">
        <span v-html="highlightTreeNode(item)"></span>
        <q-icon v-if="item.folder && item.keys.length > 0" size="xs" :name="icons.key" :color="item.annotations.notEncryptable ? 'negative' : 'grey-8'"/>
        </span>
      </q-item-section>
      <q-item-section side>
        <q-icon v-if="item.annotations.notEncryptable" size="1.4em" 
          :name="icons.error" color="negative"/>
      </q-item-section>
    </q-item>
     </template>
 </RecycleScroller>
</template>

<script lang="ts">
import { Component, Vue, Ref, Prop } from "vue-property-decorator";
import { scroll, QVirtualScroll } from 'quasar'
import scrollIntoView from 'scroll-into-view-if-needed'
import Fuse, { FuseResultWithMatches } from 'fuse.js'
import path from 'path'

import { PasswordsModule, UIModule, KeysModule, AppState } from "@/store";
import { PasswordFolder, PasswordNode, depth, traverseTree, getParents, traverseParents, getParent, SearchMatches } from '@/model/passwords';
import { findMatchingKey } from '@/service/keys';
import { setNonReactiveProps, initNonReactiveProp, removeNonReactiveProp, getNonReactiveProp } from '@/util/props';
import { highlightTreeNode } from '@/util/html'
import icons from "@/ui/icons";
import { OverviewType } from '../store/modules/ui';

const ROW_HEIGHT = 32

@Component({ })
export default class PasswordTree extends Vue {
  @Prop({ type: Object }) tree!: PasswordNode
  @Prop({ type: String }) filter!: string
  @Ref() scroll!: QVirtualScroll

  created() {
    setNonReactiveProps(this, { icons, highlightTreeNode, depth, ROW_HEIGHT })
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
    let item = items[relPath]
    if (!item) {
      item = PasswordsModule.map.value![relPath]
      PasswordsModule.expandNodes(getParents(relPath).map(parent => parent.relPath))
    }
    const index = item.annotations.index as number
    const virtualScroll = document.getElementById('password-tree')
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
    if (scrollWatcher.selected !== relPath) {
      scrollWatcher.selected = relPath
      UIModule.selectPasswordPath(relPath);
    } else {
      this.toggle(relPath)
    }
  }

  toggle(relPath: string) {
    PasswordsModule.toggleNodes([relPath])
  }

  get selected() {
    return UIModule.selectedPasswordPath as string;
  }

  get showItemType() {
    return UIModule.showItemType
  }

  get expansionFilteredList(): PasswordNode[] {
    const list: PasswordNode[] = []
    traverseTree(this.tree, (node, depth) => {
      list.push(node)
      if (!this.filter && !node.annotations.expanded) {
        return { skipChildren: true }
      }
    })
    return list
  }

  get menuFilteredList(): PasswordNode[] {
    const list = this.expansionFilteredList
    return list && list.filter(item => {
      if (!UIModule.showNotDecryptable && !(item.annotations.decryptable || item.annotations.decryptableChildren)) {
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
      shouldSort: false,
      tokenize: true,
      matchAllTokens: true,
      includeMatches: true,
      threshold: 0.1,
      location: 0,
      distance: 1000,
      maxPatternLength: 128,
      minMatchCharLength: 2,
      keys: [ 'fullName' ]
    };
    const leafList = list.filter(item => {
      return !item.folder || item.children.length === 0
    })

    const results = new Fuse(leafList, options).search(this.filter.replace(new RegExp(path.sep, 'g'), ' ').trim()) as FuseResultWithMatches<PasswordNode>[];

    const filteredList: PasswordNode[] = []
    const included: { [relPath: string]: boolean } = {}

    results.forEach((result: FuseResultWithMatches<PasswordNode>) => {
      const unincludedParents: PasswordNode[] = []
      for (let node = getParent(result.item.relPath); node; node = getParent(node.relPath)) {
        if (!included[node.relPath]) {
          unincludedParents.unshift(node)
        } else {
          break;
        }
      }
      unincludedParents.forEach(unincludedParent => {
        filteredList.push(annotateResult({
          item: unincludedParent,
          matches: result.matches
        }))
        included[unincludedParent.relPath] = true
      })
      if (!included[result.item.relPath]) {
        filteredList.push(annotateResult(result))
        included[result.item.relPath] = true
      }
    });

    const expandedResults: PasswordNode[] = []
    let hideBelowAbsPath: string | null = null
    filteredList.forEach(item => {
      if (hideBelowAbsPath && item.absPath.startsWith(hideBelowAbsPath)) {
         return
      }
      if (item.folder && !item.annotations.expanded) {
        hideBelowAbsPath = item.absPath + path.sep
      }
      expandedResults.push(item)
    })
    console.log(expandedResults)

    return expandedResults
  }

  get textFilteredItems() {
    const items: { [relPath: string]: PasswordNode } = {}
    const list = this.textFilteredList
    list.forEach(item => items[item.relPath] = item)
    return items
  }
}

function annotateResult(result: FuseResultWithMatches<PasswordNode>) {
  return {
    ...result.item,
    annotations: {
      ...result.item.annotations, 
      matches: clipMatches((result.matches && result.matches[0] && result.matches[0].indices) || [], result.item.fullName)
    }
  }
}

function clipMatches(matches: SearchMatches, fullName: string): SearchMatches {
  return matches
    .filter(match => match[0] < fullName.length)
    .map(match => match[1] >= fullName.length ? [match[0], fullName.length - 1] : match)
}

class ScrollWatcher {
  selected!: string | null
  unwatch: any;

  constructor(component: PasswordTree) {
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

#password-tree {
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
  #password-tree {
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
  #password-tree {
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