<template>
  <q-dialog :value="showDialog" :persistent="true">
    <q-layout view="hhh lpr fff" container class="bg-white setup-dialog">
      <q-header>
        <q-toolbar>
          <q-toolbar-title>
            <q-icon :name="iconSetup" />
            Setup
          </q-toolbar-title>
        </q-toolbar>
      </q-header>
      <q-page-container>
        <q-form
          ref="form"
          autocorrect="off"
          autocapitalize="off"
          autocomplete="off"
          spellcheck="false"
          class="q-pa-md"
          @submit="setup"
        >
          <q-input
            outlined
            debounce="500"
            v-model="repoPath"
            label="Repository"
            stack-label
            auto-focus
            bottom-slots
            :rules=[validateRepository]
          >
            <template v-slot:append>
              <q-avatar rounded>
                <q-btn @click="openRepository">
                  <q-icon :name="iconFolder" />
                </q-btn>
              </q-avatar>
            </template>
          </q-input>
        </q-form>
      </q-page-container>
      <q-footer class="bg-white q-pa-md">
        <q-btn color="primary" class="float-right" @click="form.submit()">Start</q-btn>
      </q-footer>
    </q-layout>
  </q-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop, Ref } from "vue-property-decorator"
import os from "os"
import path from "path"
import electron from 'electron'
import { QForm } from 'quasar' //eslint-disable-line no-unused-vars

import { ionIosFolder } from "@quasar/extras/ionicons-v4"
import { ionIosConstruct } from "@quasar/extras/ionicons-v4"

import { ConfigModule } from '@/store'
import { validateRepository } from '@/service/repo'

@Component({
  components: {}
})
export default class SetupDialog extends Vue {
  @Prop() show!: boolean
  @Ref() form!: QForm

  repoPath = path.join(os.homedir(), ".password-store")

  created() {
    (this as any).iconFolder = ionIosFolder;
    (this as any).iconSetup = ionIosConstruct;
  }

  get showDialog() {
    return this.show
  }

  async validateRepository(repoPath: string) {
      try {
        return await validateRepository(repoPath)
      } catch (e) {
          return (e as Error).message
      }
  }

  async openRepository() {
      const folder = await electron.remote.dialog.showOpenDialog(electron.remote.getCurrentWindow(), {
          title: 'Open repository',
          defaultPath: this.repoPath,
          buttonLabel: 'Open',
          properties: ['openDirectory', 'showHiddenFiles', 'createDirectory']
      })
      if (folder && folder.filePaths && folder.filePaths[0]) {
        this.repoPath = folder.filePaths[0]
      }
  }

  setup() {
      ConfigModule.setup$({repoPath: this.repoPath})
  }
}
</script>

<style lang="scss">
.setup-dialog .q-field__append.q-anchor--skip {
    display: none;
}
</style>