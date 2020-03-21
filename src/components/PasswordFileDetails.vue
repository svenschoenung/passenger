<template>
    <div class="flex direction-column flex-grow position-relative">
        <folder-breadcrumbs :folders="breadcrumb"/>
        <h3 :class="`fileName q-pt-md q-pl-md q-pr-md ${!file.annotations.decryptable && 'disabled'}`">
          <q-icon :name="icons[contents.value ? 'passwordOpen' : 'password']" color="primary"/> {{file.name}}
        </h3>
        <div v-if="!file.annotations.decryptable" class="q-pa-md column flex-grow justify-center text-center disabled">
          <div><q-icon :name="icons.warning" color="primary" size="5em"/></div>
          <div>You cannot decrypt this file</div>
        </div>
        <centered-progress v-else-if="contents.resolving"/>
        <centered-error v-else-if="contents.error"/>
        <div v-else-if="contents.value" class="flex direction-column flex-grow q-pb-md q-pl-md q-br-md">
          <div class="row">
            <div class="col col-1"></div>
            <div class="col col-10">
              <q-toolbar class="q-pa-none">
                <q-space/>
                <q-btn flat dense :class="{ 'active-elem': contentView === 'text' }" @click="contentView = 'text'">
                  <q-icon :name="icons.text" size="sm"/>
                  <q-tooltip :delay="1000">Edit as text</q-tooltip>
                </q-btn>
                <q-btn flat dense :class="{ 'active-elem': contentView === 'key-value' }" @click="contentView = 'key-value'">
                  <q-icon :name="icons.keyValue" size="sm"/>
                  <q-tooltip :delay="1000">Edit as structured data</q-tooltip>
                </q-btn>
              </q-toolbar>
            </div>
            <div class="col col-1"></div>
          </div>
          <component :is="`password-${contentView}-editor`" v-model="contents.value" class="flex direction-column flex-grow"/>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit, Watch } from 'vue-property-decorator';
import { PublicKey } from 'gpg-promised'
import path from 'path'

import { PasswordFolder, PasswordNode, getParents, PasswordFile } from '@/model/passwords';
import { KeysModule, PasswordsModule, UIModule, SettingsModule, PreferencesModule } from '@/store';
import { findMatchingPublicKeys } from '@/service/keys';
import { setNonReactiveProps } from '@/util/props';
import { Resolvable, resolvable, resolved, unresolved, resolving, failed } from '@/store/resolvable';
import { ContentViewType } from '@/store/modules/ui';
import { decryptPasswordFile } from '@/service/passwords';
import { delay } from '@/util/dev';
import icons from '@/ui/icons';

@Component({ })
export default class PasswordFileDetails extends Vue {
  @Prop({ type: Object }) file!: PasswordFile;
  contents: Resolvable<string> = unresolved()

  created() {
    setNonReactiveProps(this, { icons })
    this.loadPasswordContents()
  }

  activated() {
    this.loadPasswordContents()
  }

  deactivated() {
    this.unloadPasswordContents()
  }

  destroyed() {
    this.unloadPasswordContents()
  }

  async loadPasswordContents() {
    if (this.file.annotations.decryptable) {
      try {
        this.contents = resolving()
        const gpgPath = SettingsModule.gpgPath as string
        const repoPath = SettingsModule.repoPath as string
        const absPath = path.join(repoPath, this.file.relPath)
        this.contents = resolved(await delay(() => decryptPasswordFile(gpgPath, absPath)))
      } catch (error) {
        this.contents = failed(error)
      }
    }
  }

  unloadPasswordContents() {
    this.contents = unresolved()
  }

  get breadcrumb() {
    return getParents(this.file.relPath) 
  }

  get contentView() {
    return PreferencesModule.contentViewType
  }

  set contentView(contentView: ContentViewType) {
    PreferencesModule.setContentViewType(contentView)
  }
}
</script>

<style lang="scss" scoped>
@import "src/styles/style.variables.scss";
.fileName {
    margin: 0px;
}

.content-editor {
    min-width: 300px;
    width: 100%;
    max-width: 800px;
    align-self: center;
}
</style>