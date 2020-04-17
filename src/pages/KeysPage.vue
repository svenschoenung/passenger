<template>
  <div class="column content-height">
    <vue-headful title="Passenger: GPG-Keys" />
    <div class="row flex-grow">
      <key-list class="col q-pa-md"
         title="Public keys"
         :keys="publicKeys"
         :toolbar="['title', 'refresh', ' ', 'add', 'import', 'delete']"
         @add="addPublicKey"
         @import="importPublicKeys"
         @refresh="refreshPublicKeys"
         @delete="deletePublicKeys" />
      <key-list class="col q-pa-md"
         title="Private keys"
         :keys="privateKeys"
         :toolbar="['title', 'refresh']"
         @refresh="refreshPrivateKeys"/>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { KeysModule, SettingsModule } from '@/store'
import { GenericKey, PublicKey } from 'gpg-promised'
import electron from 'electron'
import KeyAdd from '@/components/KeyAdd.vue'
import { importArmoredKey } from '@/service/gpg'
import { arMA } from 'date-fns/locale'

@Component({})
export default class KeysPage extends Vue {

  get publicKeys() {
    return KeysModule.publicKeys
  }

  get privateKeys() {
    return KeysModule.privateKeys
  }

  refreshPublicKeys() {
    KeysModule.loadPublicKeys()
  }

  refreshPrivateKeys() {
    KeysModule.loadPrivateKeys()
  }

  addPublicKey() {
    const dialog = this.$q.dialog({
      component: KeyAdd,
      parent: this,
    })
    dialog.onOk((armoredKey: string) => {
      KeysModule.addPublicKey(armoredKey);
    })
  }

  async importPublicKeys() {
    const result = await electron.remote.dialog.showOpenDialog(
      electron.remote.getCurrentWindow(),
      {
        title: 'Import keys',
        buttonLabel: 'Import',
        properties: ['openFile', 'multiSelections']
      }
    );
    if (result && result.filePaths) {
      KeysModule.importPublicKeys(result.filePaths)
    }
  }

  async deletePublicKeys(keys: GenericKey[]) {
    KeysModule.deletePublicKeys(keys as PublicKey[])
  }
}
</script>

<style lang="scss" scoped>
</style>