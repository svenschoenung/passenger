<template>
 <RecycleScroller
    class="styled-scrollbar"
    :style="{ visibility: visible ? 'visible' : 'hidden' }"
    :items="items"
    :item-size="ROW_HEIGHT"
    key-field="relPath"
    @visible="onVisible"
    @hidden="onHidden">
    <template v-slot="props">
      <slot v-bind="props"></slot>
    </template>
  </RecycleScroller>
</template>

<script lang="ts">
import { Component, Vue, Ref, Prop, Watch } from "vue-property-decorator";
import Fuse, { FuseResultWithMatches } from 'fuse.js'

import { PasswordsModule, UIModule, KeysModule, AppState, PreferencesModule } from "@/store";
import { PasswordFolder, PasswordNode, getParents } from '@/model/passwords';
import { findMatchingKey } from '@/service/gpg';
import { setNonReactiveProps, initNonReactiveProp, removeNonReactiveProp, getNonReactiveProp } from '@/util/props';
import { OverviewType } from '@/store/modules/ui';
import { debounce } from 'quasar';

const ROW_HEIGHT = 32

@Component({ })
export default class VirtualScroll extends Vue {
  @Prop({ type: String }) type!: OverviewType;
  @Prop({ type: Array }) items!: PasswordNode[];
  visible = false
  initialPath: string | null = null

  created() {
    setNonReactiveProps(this, { ROW_HEIGHT })
  }

  mounted() {
    this.scrollToInitial()
    this.registerWatcher()
  }

  activated() {
    this.scrollToInitial()
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
    removeNonReactiveProp(this, 'selectedWatcher', (selectedWatcher: SelectedWatcher) => selectedWatcher.unwatch())
    removeNonReactiveProp(this, 'scrollWatcher', (scrollWatcher: ScrollWatcher) => scrollWatcher.unwatch())
  }

  onVisible() {
    this.visible = true
    this.scrollToInitial()
  }

  onHidden() {
    this.visible = false 
  }

  scrollToInitial() {
    if (this.initialPath) {
      this.scrollToPath(this.initialPath)
      this.initialPath = null
    } else {
      this.scrollToPos(UIModule.scrollPos[this.type])
    }
  }

  scrollToPos(pos: number) {
    const virtualScroll = this.$el as HTMLElement
    virtualScroll.scrollTop = pos
  }

  scrollToPath(relPath: string | null) {
    const virtualScroll = this.$el as HTMLElement
    if (!relPath) {
      this.$el.scrollTop = 0
      return
    }
    const index = this.items.findIndex(item => item.relPath === relPath)
    if (index < 0) {
      return
    }
    const start = virtualScroll.scrollTop / ROW_HEIGHT
    const end = start + virtualScroll.offsetHeight / ROW_HEIGHT - 1
    if (index < Math.ceil(start) || index > Math.floor(end)) {
      console.log(this.visible)
      virtualScroll.scrollTop = (index + 1) * ROW_HEIGHT - virtualScroll.offsetHeight / 2
    }
  }

  get selected() {
    return UIModule.selectedPasswordPath as string;
  }
}

class SelectedWatcher {
  unwatch: () => any;

  constructor(virtualScroll: VirtualScroll) {
    this.unwatch = virtualScroll.$store.subscribeAction({
      after(action, state: AppState) {
        if (action.type === 'ui/gotoPasswordPath') {
          if (virtualScroll.visible) {
            virtualScroll.scrollToPath(state.ui.selectedPasswordPath)
          } else {
            virtualScroll.initialPath = state.ui.selectedPasswordPath
          }
        }
      }
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