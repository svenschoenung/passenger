<template>
    <div class="row direction-column flex-grow">
        <folder-breadcrumbs :folders="breadcrumb"/>
        <h3 class="folderName q-pa-md"><q-icon :name="icons.folderOpen" color="primary"/> {{folder.name}}</h3>
        <div class="row flex-grow">
            <keys-list v-if="!assignedKeys || assignedKeys.length > 0"
               class="col q-pa-md"
               title="Assigned Keys"
               :keys="assignedKeys" />
            <keys-list v-else
               class="col q-pa-md"
               title="Inherited Keys"
               :keys="inheritedKeys"
               :disabled="true"/>
            <keys-list
               class="col q-pa-md"
               title="Available keys"
               :keys="publicKeys"/>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator';

import { PasswordFolder, PasswordNode } from '@/model/tree';
import FolderBreadcrumbs from '@/components/FolderBreadcrumbs.vue';
import KeysList from '@/components/KeysList.vue';
import { KeysModule, PasswordsModule } from '@/store';
import { findMatchingKey } from '@/service/keys';
import { PublicKey } from 'gpg-promised'
import icons from '@/ui/icons';

@Component({
  components: {
    FolderBreadcrumbs,
    KeysList,
  }
})
export default class PasswordFolderDetails extends Vue {
  @Prop({ type: Object }) folder!: PasswordFolder;

  created() {
    (this as any).icons = icons;
  }

  get assignedKeys(): PublicKey[] | null {
    if (!this.folder) {
        return null
    }
    return this.findMatchingPublicKeys(this.folder.keys)
  }

  get inheritedKeys(): PublicKey[] | null {
      const parents = this.breadcrumb
      if (!parents) {
          return null
      }
      for (let i = parents.length - 1; i >= 0; i--) {
          if (parents[i].keys.length > 0) {
              return this.findMatchingPublicKeys(parents[i].keys)
          }
      }
      return []
  }

  findMatchingPublicKeys(keys: string[]): PublicKey[] | null {
    const publicKeys = KeysModule.loadPublicKeys
    if (!publicKeys) {
      return null
    }
    const matchingPublicKeys = keys
      .map(key => findMatchingKey(key, publicKeys) || key)
      .map(key => typeof key === 'string' ? { keyid: key, uid: [{ user_id: 'Missing' }] } as PublicKey: key)
    return matchingPublicKeys
  }

  get publicKeys() {
    return KeysModule.loadPublicKeys
  }

  get breadcrumb() {
    const parents = PasswordsModule.loadParents
    if (!parents) {
      return []
    }
    const breadcrumb: PasswordFolder[] = []
    let node: PasswordNode = this.folder
    while (node) {
        node = parents[node.absPath]
        if (node && node.name && node.folder) {
            breadcrumb.unshift(node)
        }
    }
    return breadcrumb
  }
}
</script>

<style lang="scss" scoped>
@import "src/styles/quasar.variables.scss";
.folderName {
    margin: 0px;
}
</style>