<template>
    <div class="row direction-column flex-grow position-relative">
        <folder-breadcrumbs :folders="breadcrumb"/>
        <h3 :class="{ 'folderName': true, 'q-pa-md': true, 'disabled': !decryptable[folder.relPath] }">
          <q-icon :name="icons.folderOpen" color="primary"/> {{folder.name}}
        </h3>
        <div class="row flex-grow">
            <key-list v-if="!assignedKeys.value || assignedKeys.value.length > 0"
               class="col q-pa-md"
               title="Assigned keys"
               :keys="assignedKeys"
               :disabled="!decryptable[folder.relPath]" />
            <key-list v-else
               class="col q-pa-md"
               title="Inherited keys"
               :ancestor="ancestorWithKeys"
               :keys="inheritedKeys"
               :disabled="true"/>
            <key-list
               class="col q-pa-md"
               title="Available keys"
               :keys="publicKeys"
               :disabled="!decryptable[folder.relPath]" />
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator';
import { PublicKey } from 'gpg-promised'

import { PasswordFolder, PasswordNode, getParents } from '@/model/passwords';
import { KeysModule, PasswordsModule, AnnotationsModule } from '@/store';
import { findMatchingPublicKeys } from '@/service/gpg';
import { setNonReactiveProps } from '@/util/props';
import icons from '@/ui/icons';
import { Resolvable, resolvable, resolved } from '@/store/resolvable';


@Component({})
export default class PasswordFolderDetails extends Vue {
  @Prop({ type: Object }) folder!: PasswordFolder;

  created() {
    setNonReactiveProps(this, { icons })
  }

  get decryptable() {
    return AnnotationsModule.decryptable
  }

  get assignedKeys(): Resolvable<PublicKey[]> {
    if (!this.publicKeys.value) {
      return resolvable(this.publicKeys)
    }
    return resolved(findMatchingPublicKeys(this.folder.keys, this.publicKeys.value))
  }

  get inheritedKeys(): Resolvable<PublicKey[]> {
    if (!this.publicKeys.value) {
      return resolvable(this.publicKeys)
    }
    const ancestor = this.ancestorWithKeys
    if (!ancestor) {
      return resolved([])
    }
    return resolved(findMatchingPublicKeys(ancestor.keys, this.publicKeys.value))
  }

  get publicKeys() {
    return KeysModule.publicKeys
  }

  get breadcrumb() {
    return getParents(this.folder.relPath) 
  }

  get ancestorWithKeys() {
    const breadcrumb = this.breadcrumb
    for (let i = breadcrumb.length - 1; i >= 0; i--) {
      if (breadcrumb[i].keys.length > 0) {
        return breadcrumb[i]
      }
    }
    return null
  }
}
</script>

<style lang="scss" scoped>
@import "src/styles/style.variables.scss";
.folderName {
    margin: 0px;
}
</style>