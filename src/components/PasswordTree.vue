<template>
  <virtual-scroll ref="virtualScroll" id="password-tree"
    type="tree"
    :items="textFilteredList"
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
        }">
        <q-item-section v-for="i in depth(item) + (item.folder && item.children.length > 0 ? 0 : 2)" :key="i" avatar class="indent">
        </q-item-section>
        <template v-if="item.folder && item.children.length > 0">
          <q-item-section avatar>
            <q-icon size="xs"
              @click.stop="toggle(item.relPath)"
              :name="icons[expandedFolders[item.relPath]? 'expanded' : 'unexpanded']"
              />
          </q-item-section>
        </template>
        <q-item-section avatar>
          <q-icon size="xs" :name="icons[item.folder ? 'folder' : 'password']" :color="item.annotations.notEncryptable ? 'negative' : 'primary'"/>
        </q-item-section>
        <q-item-section class="item-name">
          <span>
          <span v-html="highlightTreeNode(item)"></span>
          <q-icon v-if="item.folder && item.keys.length > 0" size="xs" :name="icons.key" :color="item.annotations.notEncryptable ? 'negative' : 'grey-8'"/>
          </span>
        </q-item-section>
        <q-item-section v-if="item.annotations.notEncryptable" side>
          <q-icon size="1.4em" :name="icons.error" color="negative"/>
        </q-item-section>
        <q-menu dense context-menu touch-position anchor="top left" self="top left">
          <q-item dense clickable v-close-popup @click="expandAll(item)">
            <q-item-section>Expand all</q-item-section>
          </q-item>
          <q-item dense clickable v-close-popup @click="collapseAll(item)">
            <q-item-section>Collapse all</q-item-section>
          </q-item>
        </q-menu>
      </q-item>
    </template>
  </virtual-scroll>
</template>

<script lang="ts">
import { Component, Vue, Ref, Prop } from "vue-property-decorator";
import { scroll, QVirtualScroll } from 'quasar'
import scrollIntoView from 'scroll-into-view-if-needed'
import Fuse, { FuseResultWithMatches } from 'fuse.js'
import path from 'path'

import { PasswordsModule, UIModule, KeysModule, AppState, PreferencesModule } from "@/store";
import { PasswordFolder, PasswordNode, depth, traverseTree, getParents, traverseParents, getParent, SearchMatches } from '@/model/passwords';
import { findMatchingKey } from '@/service/gpg';
import { setNonReactiveProps, initNonReactiveProp, removeNonReactiveProp, getNonReactiveProp } from '@/util/props';
import { OverviewType } from '@/store/modules/ui';
import VirtualScroll from '@/components/VirtualScroll.vue';
import { highlightTreeNode } from '@/util/html'
import icons from "@/ui/icons";

@Component({ })
export default class PasswordTree extends Vue {
  @Prop({ type: Object }) tree!: PasswordNode
  @Prop({ type: String }) filter!: string

  created() {
    setNonReactiveProps(this, { icons, depth, highlightTreeNode })
  }

  select(relPath: string) {
    if (this.selected === relPath) {
      const selected = PasswordsModule.selectedPasswordNode;
      if (selected && selected.value && selected.value.folder) {
        this.toggle(relPath)
      }
    } else {
      UIModule.selectPasswordPath(relPath);
    }
  }

  toggle(relPath: string) {
    UIModule.toggleFolders([relPath])
  }

  expandAll(item: PasswordNode) {
    UIModule.expandFoldersRecursively({ from: item })
  }

  collapseAll(item: PasswordNode) {
    UIModule.collapseFoldersRecursively({ from: item })
  }

  expandForItem(relPath: string) {
    if (!PasswordsModule.map.value || !PasswordsModule.map.value[relPath]) {
      return false
    }
    UIModule.expandFolders(getParents(relPath).map(parent => parent.relPath))
    return true;
  }

  get expandedFolders() {
    return UIModule.expandedFolders
  }

  get selected() {
    return UIModule.selectedPasswordPath as string;
  }

  get showItemType() {
    return PreferencesModule.showItemType
  }

  get expansionFilteredList(): PasswordNode[] {
    const list: PasswordNode[] = []
    traverseTree(this.tree, (node, depth) => {
      list.push(node)
      if (!this.filter && !UIModule.expandedFolders[node.relPath]) {
        return { skipChildren: true }
      }
    })
    return list
  }

  get menuFilteredList(): PasswordNode[] {
    const list = this.expansionFilteredList
    return list && list.filter(item => {
      if (!PreferencesModule.showNotDecryptable && !(item.annotations.decryptable || item.annotations.decryptableChildren)) {
        return false
      }
      return true
    })
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
      if (item.folder && !UIModule.expandedFolders[item.relPath]) {
        hideBelowAbsPath = item.absPath + path.sep
      }
      expandedResults.push(item)
    })
    return expandedResults
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

</script>

<style lang="scss">
@import "src/styles/style.variables.scss";

#password-tree {
    .q-list--dense > .q-item, .q-item--dense {
        height: 32px;
        padding: 2px 6px;
    }

    .q-item__section--avatar {
      min-width: 24px;
    }

    .q-item__section--avatar.indent {
      min-width: 12px;
    }

    .q-item__section--side {
      padding-right: 5px;
    }

    .not-decryptable {
        opacity: 0.2
    }

    .item-name {
      white-space: nowrap;
      overflow:hidden;

      .q-icon {
        margin-left: 5px;
      }
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