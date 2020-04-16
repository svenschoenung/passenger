<template>
  <q-dialog ref="dialog" @hide="hideDialog">
      <q-card class="key-add">
        <q-card-section>
            <q-input label="Copy armored key here" dense outlined
                autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"
                type="textarea" class="armored-key bg-1" v-model="armoredKey" />
        </q-card-section>
        <q-separator />
        <q-card-actions class="float-right q-pa-md">
            <q-btn color="primary" :disable="!armoredKey" @click="add">Add</q-btn>
            <q-btn class="btn-secondary" @click="hide">Cancel</q-btn>
        </q-card-actions>
      </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit, Watch, Ref } from "vue-property-decorator";
import { QTooltip, Notify, QDialog } from "quasar";
import { GenericKey, GPGUser, MasterKey } from "gpg-promised";

import {
  initNonReactiveProp,
  removeNonReactiveProp,
  setNonReactiveProps
} from "@/util/props";
import { UIModule, SettingsModule } from "@/store";
import icons from "@/ui/icons";

@Component({})
export default class KeyAdd extends Vue {
  @Ref() dialog!: QDialog;
  armoredKey: string = ''

  created() {
    setNonReactiveProps(this, { icons });
  }

  show() {
    this.dialog.show();
  }

  hide() {
    this.dialog.hide();
  }

  @Emit('ok')
  add() {
      this.hide()
      return this.armoredKey
  }

  @Emit('hide')
  hideDialog() {}
}
</script>

<style lang="scss">
@import "src/styles/style.variables.scss";
@import "src/styles/style.mixins.scss";

.key-add {
    .armored-key textarea {
        width: 800px;
        height: 400px;
        font-family: monospace;
    }

    .q-btn {
        text-transform: uppercase !important;
    }
}
</style>