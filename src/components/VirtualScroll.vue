<template>
 <RecycleScroller
    class="styled-scrollbar"
    :items="items"
    :item-size="ROW_HEIGHT"
    key-field="relPath">
    <template v-slot="props">
      <slot v-bind="props"></slot>
    </template>
  </RecycleScroller>
</template>

<script lang="ts">
import { Component, Vue, Ref, Prop } from "vue-property-decorator";
import Fuse, { FuseResultWithMatches } from 'fuse.js'

import { PasswordsModule, UIModule, KeysModule, AppState, PreferencesModule } from "@/store";
import { PasswordFolder, PasswordNode, getParents } from '@/model/passwords';
import { findMatchingKey } from '@/service/keys';
import { setNonReactiveProps, initNonReactiveProp, removeNonReactiveProp, getNonReactiveProp } from '@/util/props';
import { OverviewType } from '@/store/modules/ui';
import { debounce } from 'quasar';

const ROW_HEIGHT = 32

@Component({ })
export default class VirtualScroll extends Vue {
  @Prop({ type: String }) type!: OverviewType;
  @Prop({ type: Array }) items!: PasswordNode[];
  @Prop({ type: Function }) includeItemOnNextTick!: (relPath: string) => boolean 

  created() {
    setNonReactiveProps(this, { ROW_HEIGHT })
  }

  mounted() {
    this.scrollToPos(UIModule.scrollPos[this.type])
    this.registerWatcher()
  }

  activated() {
    this.scrollToPos(UIModule.scrollPos[this.type])
    this.registerWatcher()
  }

  deactivated() {
    this.unregisterWatcher()
  }

  destroyed() {
    this.unregisterWatcher()
  }

  registerWatcher() {
    initNonReactiveProp(this, 'selectedWatcher', () => new SelectedWatcher(this))
    initNonReactiveProp(this, 'scrollWatcher', () => new ScrollWatcher(this))
  }

  unregisterWatcher() {
    removeNonReactiveProp(this, 'selectedWatcher', (scrollWatcher: SelectedWatcher) => scrollWatcher.unwatch())
    removeNonReactiveProp(this, 'scWatcher', (scrollWatcher: SelectedWatcher) => scrollWatcher.unwatch())
  }

  scrollToPos(pos: number) {
    const virtualScroll = this.$el as HTMLElement
    virtualScroll.scrollTop = pos
  }

  scrollTo(relPath: string | null, nextTick = false) {
    const virtualScroll = this.$el as HTMLElement
    if (!relPath) {
      this.$el.scrollTop = 0
      return
    }
    const index = this.items.findIndex(item => item.relPath === relPath)
    if (index < 0) {
      if (this.includeItemOnNextTick(relPath) && !nextTick) {
        Vue.nextTick(() => this.scrollTo(relPath, true))
      }
      return
    }
    const start = virtualScroll.scrollTop / ROW_HEIGHT
    const end = start + virtualScroll.offsetHeight / ROW_HEIGHT - 1
    if (index < Math.ceil(start) || index > Math.floor(end)) {
      virtualScroll.scrollTop = (index + 1) * ROW_HEIGHT - virtualScroll.offsetHeight / 2
    }
  }

  select(relPath: string) {
    const scrollWatcher: SelectedWatcher = getNonReactiveProp(this, 'selectedWatcher')
    scrollWatcher.selected = relPath
  }

  get selected() {
    return UIModule.selectedPasswordPath as string;
  }
}

class SelectedWatcher {
  selected!: string | null
  unwatch: () => any;

  constructor(virtualScroll: VirtualScroll) {
    this.selected = virtualScroll.selected
    this.unwatch = virtualScroll.$store.watch(
      (state: AppState) => state.ui.selectedPasswordPath,
      (selected: string | null) => {
        if (selected && selected !== this.selected) {
          virtualScroll.scrollTo(selected)
        }
        this.selected = selected;
      })
  }
}

class ScrollWatcher {
  private listener!: () => any

  constructor(private virtualScroll: VirtualScroll) {
    this.listener = debounce(() => {
       UIModule.setScrollPos({ [virtualScroll.type]: virtualScroll.$el.scrollTop })
    }, 200)
    virtualScroll.$el.addEventListener('scroll', this.listener)
  }

  unwatch() {
    this.virtualScroll.$el.removeEventListener('scroll', this.listener)
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