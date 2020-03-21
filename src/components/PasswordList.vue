<template>
<div>
 <virtual-scroll ref="virtualScroll" id="password-list" 
   type="list"
   :items="textFilteredList" 
   v-roving-tabindex-container>
    <template v-slot="{ item }">
      <div :class="{
            'item-selected': item.relPath === selected
        }">
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
        <q-item-section avatar>
          <q-icon size="xs" :name="icons[item.folder ? 'folder' : 'password']" :color="item.annotations.notEncryptable ? 'negative' : 'primary'"/>
        </q-item-section>
        <q-item-section avatar v-if="showItemType === 'files-and-folders'">
          <q-icon v-if="item.folder && item.keys.length > 0" size="xs" :name="icons.key" :color="item.annotations.notEncryptable ? 'negative' : 'grey-8'"/>
        </q-item-section>
        <q-item-section class="item-name">
          <span v-html="highlight(item)"></span>
        </q-item-section>
        <q-item-section  v-if="item.annotations.notEncryptable" side>
          <q-icon size="1.4em" :name="icons.error" color="negative"/>
        </q-item-section>
      </q-item>
      </div>
    </template>
 </virtual-scroll>

 </div>
</template>

<script lang="ts">
import { Component, Vue, Ref, Prop } from "vue-property-decorator";
import Fuse, { FuseResultWithMatches } from 'fuse.js'

import { PasswordsModule, UIModule, KeysModule, AppState, PreferencesModule } from "@/store";
import { PasswordFolder, PasswordNode } from '@/model/passwords';
import { findMatchingKey } from '@/service/keys';
import { setNonReactiveProps, initNonReactiveProp, removeNonReactiveProp, getNonReactiveProp } from '@/util/props';
import { OverviewType } from '@/store/modules/ui';
import { highlight } from '@/util/html'
import VirtualScroll from '@/components/VirtualScroll.vue';
import icons from "@/ui/icons";

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

  get selected() {
    return UIModule.selectedPasswordPath as string;
  }

  get showItemType() {
    return PreferencesModule.showItemType
  }

  get menuFilteredList() {
    return (this.list || []).filter(item => {
      if (PreferencesModule.showItemType === 'files-only' && item.folder) {
        return false
      }
      if (!PreferencesModule.showNotDecryptable && !item.annotations.decryptable) {
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

    .not-decryptable {
        opacity: 0.2
    }

    .item-name {
      white-space: nowrap;
      overflow: hidden;
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