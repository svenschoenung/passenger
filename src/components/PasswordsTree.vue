<template>
<div id="passwords-tree" class="flex direction-column flex-grow bg-1">
    <q-input class="q-pa-sm" filled square v-model="filter" :dense="true" placeholder="Filter">
      <template v-slot:append>
        <q-icon v-if="filter" :name="icons.clear" class="cursor-pointer" @click="clearFilter" />
      </template>
      <template v-slot:after>
        <q-btn size="xs" flat class="menu-button"><q-icon :name="icons.menu" /></q-btn>
      </template>
    </q-input>
    <q-scroll-area class="flex-grow" v-if="passwordsTree">
    <q-tree 
        class="q-pa-sm bg-1"
        :nodes="passwordsTree"
        :icon="icons.arrow"
        :filter="filter"
        default-expand-all
        node-key="absPath"
        label-key="name"
        :selected.sync="selected">
      <template v-slot:default-header="props">
        <span :class="[props.node.decryptable ? 'decryptable' : 'not-decryptable']">
          <q-icon v-if="props.node.folder" :name="props.expanded ? icons.folderOpen : icons.folder" size="xs" color="primary"/>
          <q-icon v-else :name="icons.password" color="primary"/>
          <span class="node-name" :data-abs-path="props.node.absPath">{{props.node.name}}</span>
          <q-icon v-if="props.node.folder && props.node.keys.length" :name="icons.key" class="node-marker" size="1.4em" color="grey-8"/>
          <q-icon v-if="!props.node.encryptable" :name="icons.error" class="node-marker" size="1.4em" color="negative"/>
        </span>
      </template> 
    </q-tree>
    </q-scroll-area>
    <q-circular-progress
        v-else
        indeterminate
        size="50px"
        :thickness="0.22"
        color="primary"
        track-color="grey-3"
        class="centered-progress"
    />
    </div>
</template>

<script lang="ts">
import { Component, Vue, Ref } from "vue-property-decorator";
import { scroll, Scroll } from 'quasar'
import { PasswordsModule, UIModule, KeysModule, AppState } from "@/store";
import { PasswordFolder, PasswordNode } from '@/model/tree';
import { PublicKey, PrivateKey } from 'gpg-promised';
import icons from "@/ui/icons";
import { findMatchingKey } from '@/service/keys';
import VueScrollTo from 'vue-scrollto';

@Component({
  name: "passwords-tree"
})
export default class PasswordsTree extends Vue {

  filter = ''

  created() {
    (this as any).icons = icons;
    (this as any).scrollWatcher = new ScrollWatcher(this)
  }

  scrollTo(absPath: string | null) {
    let elem: HTMLElement | null = null;
    if (absPath) {
      elem = document.querySelector(`[data-abs-path="${CSS.escape(absPath)}"]`)
    }
    if (elem) {
      elem = elem.closest('.q-tree__node-header')
    }
    if (elem) {
      VueScrollTo.scrollTo(elem, 1, {
        container: scroll.getScrollTarget(elem) as Element,
        x: false,
        y: true,
        cancelable: false
      })
    }
  }

  destroyed() {
    (this as any).scrollWatcher.unwatch()
  }

  set selected(absPath: string) {
    (this as any).scrollWatcher.selected = absPath
    UIModule.selectPasswordNode$(absPath);
  }

  get selected() {
    return UIModule.selectedPasswordNode as string;
  }

  get privateKeys() {
      return KeysModule.privateKeys
  }

  get passwordsTree() {
    const tree = PasswordsModule.loadTree;
    const privateKeys = KeysModule.loadPrivateKeys;
    const publicKeys = KeysModule.loadPublicKeys;

    if (!tree) {
      return null
    }

    let passwordsTree: PasswordFolder = tree

    if (privateKeys) {
      passwordsTree = this.markDecryptable(passwordsTree, privateKeys, false)
    }
    if (publicKeys) {
      passwordsTree = this.markEncryptable(passwordsTree, publicKeys, true)
    }

    return (passwordsTree as PasswordFolder).children 
  }

  markDecryptable<T extends PasswordNode>(node: T, privateKeys: PrivateKey[], inheritedDecryptable: boolean): T {
      if (node.folder) {
          const folder = node as PasswordFolder
          const decryptable = folder.keys && folder.keys.length > 0 ? 
            folder.keys.some(key => findMatchingKey(key, privateKeys)) : inheritedDecryptable
          return {
              ...node,
              decryptable,
              children: folder.children.map(child => this.markDecryptable(child, privateKeys, decryptable))
          }
      } else {
          return {
              ...node,
              decryptable: inheritedDecryptable
          }
      }
  }

  markEncryptable<T extends PasswordNode>(node: T, publicKeys: PublicKey[], inhertedEncryptable: boolean): T {
    if (node.folder) {
          const folder = node as PasswordFolder
          const encryptable = folder.keys && folder.keys.length > 0 ? 
            !folder.keys.find(key => !findMatchingKey(key, publicKeys)) : inhertedEncryptable
          return {
              ...node,
              encryptable,
              children: folder.children.map(child => this.markEncryptable(child, publicKeys, encryptable))
          }
    } else {
          return {
              ...node,
              encryptable: inhertedEncryptable
          }
    }
  }

  clearFilter() {
      this.filter = ''
  }
}

class ScrollWatcher {
  selected!: string | null
  unwatch: any;

  constructor(component: PasswordsTree) {
    this.selected = UIModule.selectedPasswordNode
    this.unwatch = component.$store.watch(
      (state: AppState) => state.ui.selectedPasswordNode,
      (selected: string | null) => {
        if (this.selected !== selected) {
          component.scrollTo(selected)
        }
        this.selected = selected;
      })
  }
}
</script>

<style lang="scss">
@import "src/styles/quasar.variables.scss";

#passwords-tree {
    .centered-progress {
        position: absolute;
        top: calc(50% - 25px);
        left: calc(50% - 25px);
    }

    .menu-button {
        height: 100%;
        .q-btn__wrapper {
            padding: 0px 5px;
        }
    }

    .not-decryptable {
        opacity: 0.2
    }

    .node-name {
        margin-left: 5px;
    }

    .node-marker {
        margin-left: 5px;
    }
}

body.body--light {
  #passwords-tree {
    .q-tree__node--selected {
      background: $bg-primary-light;
    }

    .node-name {
      color: $dark;
    }
  }
}

body.body--dark {
  #passwords-tree {
    .q-tree__node--selected {
      background: $bg-primary-dark;
    }

    .node-name {
      color: white;
    }
  }
}
</style>