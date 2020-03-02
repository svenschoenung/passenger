<template>
<div id="passwords-tree" class="cover bg-1 q-pa-sm">
    <q-input filled square v-model="filter" :dense="true" placeholder="Filter">
      <template v-slot:append>
        <q-icon v-if="filter" :name="icons.clear" class="cursor-pointer" @click="clearFilter" />
      </template>
      <template v-slot:after>
        <q-btn size="xs" flat class="menu-button"><q-icon :name="icons.menu" /></q-btn>
      </template>
    </q-input>
    <q-tree
        v-if="passwordsTree"
        class="bg-1"
        :nodes="passwordsTree"
        :icon="icons.arrow"
        :filter="filter"
        default-expand-all
        node-key="absPath"
        label-key="name"
        :selected.sync="selected"
        selected-color="primary">
   
      <template v-slot:default-header="props">
          <span :class="[props.node.decryptable ? 'decryptable' : 'not-decryptable']">
          <q-icon v-if="props.node.folder" :name="icons.folder" size="xs"/>
          <q-icon v-else :name="icons.password" />
          <span class="node-name">{{props.node.name}}</span>
          </span>
      </template> 
    </q-tree>
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
import { Component, Vue } from "vue-property-decorator";
import { PasswordsModule, UIModule, KeysModule } from "../store";
import { PasswordFolder, PasswordNode } from '@/model/tree';
import icons from "@/ui/icons";

@Component({
  name: "passwords-tree",
  components: {}
})
export default class PasswordsTree extends Vue {
  filter = ''

  set selected(absPath: string) {
    UIModule.selectPasswordNode$(absPath);
  }

  get selected() {
    return UIModule.selectedPasswordNode as string;
  }

  get privateKeys() {
      return KeysModule.privateKeys
  }

  created() {
    (this as any).icons = icons;
  }

  get passwordsTree() {
    if (!(PasswordsModule.tree && PasswordsModule.tree.children)) {
        PasswordsModule.loadTree$()
        return null
    }
    let tree: PasswordFolder = PasswordsModule.tree
    tree = this.markDecryptable(tree, false)
    return (tree as PasswordFolder).children 
  }

  markDecryptable<T extends PasswordNode>(node: T, inheritedDecryptable: boolean): T {
      if (node.folder) {
          const folder = node as PasswordFolder
          const decryptable = folder.keys && folder.keys.length > 0 ? 
            folder.keys.some(key => KeysModule.privateKeys.includes(key)) : inheritedDecryptable
          return {
              ...node,
              decryptable,
              children: folder.children.map(child => this.markDecryptable(child, decryptable))
          }
      } else {
          return {
              ...node,
              decryptable: inheritedDecryptable
          }
      }
  }

  clearFilter() {
      this.filter = ''
  }
}
</script>

<style lang="scss">
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
}
</style>