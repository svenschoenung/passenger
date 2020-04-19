<template>
<div>
 <virtual-scroll ref="virtualScroll" id="password-list" 
   type="list"
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
            'item-not-decryptable': !decryptable[item.relPath],
            'item-has-errors': !!errorsByPath[item.relPath],
            'item-has-warnings': !!warningsByPath[item.relPath]
        }">
        <q-item-section avatar>
          <q-icon size="xs" :name="icons[item.folder ? 'folder' : 'password']" class="item-icon"/>
        </q-item-section>
        <q-item-section avatar v-if="showItemType === 'files-and-folders'">
          <q-icon v-if="item.folder && item.keys.length > 0" size="xs" :name="icons.key" class="key-icon"/>
        </q-item-section>
        <q-item-section class="item-name">
          <span v-html="highlight(item)"></span>
        </q-item-section>
        <q-item-section  v-if="!!errorsByPath[item.relPath]" side>
          <q-icon size="1.4em" :name="icons.error" color="negative"/>
        </q-item-section>
        <q-item-section  v-else-if="!!warningsByPath[item.relPath]" side>
          <q-icon size="1.4em" :name="icons.warning" color="warning"/>
        </q-item-section>
        <q-menu dense context-menu touch-position anchor="top left" self="top left">
          <q-item dense clickable v-close-popup @click="copy(item.fullName)" v-if="item.fullName !== '/'">
            <q-item-section>Copy location</q-item-section>
          </q-item>
          <q-item dense clickable v-close-popup @click="copy(item.absPath)">
            <q-item-section>Copy absolute path</q-item-section>
          </q-item>
        </q-menu>
      </q-item>
    </template>
 </virtual-scroll>

 </div>
</template>

<script lang="ts">
import { Component, Vue, Ref, Prop } from "vue-property-decorator";
import Fuse, { FuseResultWithMatches } from 'fuse.js'

import { PasswordsModule, UIModule, KeysModule, AppState, PreferencesModule, AnnotationsModule, ProblemsModule } from "@/store";
import { PasswordFolder, PasswordNode } from '@/model/passwords';
import { findMatchingKey } from '@/service/gpg';
import { setNonReactiveProps, initNonReactiveProp, removeNonReactiveProp, getNonReactiveProp } from '@/util/props';
import { OverviewType } from '@/store/modules/ui';
import { highlight } from '@/util/html'
import VirtualScroll from '@/components/VirtualScroll.vue';
import icons from "@/ui/icons";
import { copyToClipboard } from '@/service/clipboard';

@Component({ })
export default class PasswordList extends Vue {
  @Prop({ type: Array }) list!: PasswordNode[]
  @Prop({ type: String }) filter!: string
  @Ref() virtualScroll!: VirtualScroll

  created() {
    setNonReactiveProps(this, { icons, highlight })
  }

  select(relPath: string) {
    UIModule.selectPasswordPath(relPath);
  }

  copy(path: string) {
    copyToClipboard(path, false)
  }

  get decryptable() {
    return AnnotationsModule.decryptable
  }

  get toBeEncryptedWithUnknownKeys() {
    return AnnotationsModule.toBeEncryptedWithUnknownKeys
  }

  get selected() {
    return UIModule.selectedPasswordPath as string;
  }

  get showItemType() {
    return PreferencesModule.showItemType
  }

  get errorsByPath() {
    console.log(ProblemsModule.errorsByPath)
    return ProblemsModule.errorsByPath
  }

  get warningsByPath() {
    return ProblemsModule.warningsByPath
  }

  get menuFilteredList() {
    return (this.list || []).filter(item => {
      if (PreferencesModule.showItemType === 'files-only' && item.folder) {
        return false
      }
      if (!PreferencesModule.showNotDecryptable && !this.decryptable[item.relPath]) {
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
    var fuse = new Fuse(list, options);
    const results = fuse.search(this.filter.trim()) as FuseResultWithMatches<PasswordNode>[];
    return results
      .filter((result: FuseResultWithMatches<PasswordNode>) => {
        return result.matches && result.matches.length > 0
      })
      .map((result: FuseResultWithMatches<PasswordNode>, index) => {
      return {
        ...result.item,
        annotations: {
          ...result.item.annotations, index,
          matches: result.matches && result.matches[0] && result.matches[0].indices,
        }
      }
    });
  }
}
</script>

<style lang="scss">
@import "src/styles/style.variables.scss";

#password-list {
    .q-list--dense > .q-item, .q-item--dense {
        height: 32px;
        padding-right: 6px;
    }

    .q-item__section--avatar {
      min-width: 24px;
    }

    .q-item__section--side {
      padding-right: 5px;
    }
}
</style>