<template>
  <q-dialog ref="dialog" @hide="hideDialog">
      <q-card class="key-details">
        <div>
        <q-tabs v-model="tab" inline-label class="key-details-tabs shadow-4">
          <q-tab name="general" label="General" :icon="icons.info " :class="{'active-elem': tab === 'general'}"/>
          <q-tab name="identities" label="Identities" :icon="icons.identities" :class="{'active-elem': tab === 'identities'}" />
          <q-tab name="subkeys" label="Subkeys" :icon="icons.key" :class="{'active-elem': tab === 'subkeys'}" />
          <q-tab name="key" label="Key" :icon="icons.key" :class="{'active-elem': tab === 'key'}"/>
        </q-tabs>
        <q-tab-panels v-model="tab" class="key-details-tab-panels">
          <q-tab-panel name="general">
            <key-info :gpgKey="gpgKey"/>
          </q-tab-panel>
          <q-tab-panel name="identities" class="q-gutter-y-md">
            <div v-if="!gpgKey.uid || gpgKey.uid.length === 0">
              This key does not have any identities.
            </div>
            <q-expansion-item group="identities" v-for="(uid, index) in gpgKey.uid"
              class="shadow-4"
              :key="uid.user_id"
              :default-opened="index === 0"
              :expand-icon="icons.down"
              :expanded-icon="icons.up"
              :icon="icons.user"
              :label="uid.user_id">
              <q-card class="q-gutter-y-sm q-mt-md q-pb-md q-pl-md q-pr-md">
                <div class="row" v-if="uid.name">
                  <div class="col-12">
                    <q-input label="Name" dense outlined readonly :value="uid.name" class="bg-1" />
                  </div>
                </div>
                <div class="row" v-if="uid.email">
                  <div class="col-12">
                    <q-input label="Email" dense outlined readonly :value="uid.email" class="bg-1" />
                  </div>
                </div>
                <div class="row">
                  <div class="col-12">
                    <q-input label="Created" dense outlined readonly class="bg-1"
                      :value="gpgKey.creation_date | timestamp-to-iso-date" />
                  </div>
                </div>
                <div class="row">
                  <div class="col-12">
                    <key-rating type="validity" :value="uid.validity"/>
                  </div>
                </div>
            </q-card>
            </q-expansion-item>
          </q-tab-panel>
          <q-tab-panel name="subkeys" class="q-gutter-y-md">
            <div v-if="!gpgKey.sub || gpgKey.sub.length === 0">
              This key does not have any subkeys. 
            </div>
            <q-expansion-item group="subkeys" v-for="(sub, index) in gpgKey.sub"
              class="shadow-4"
              :key="sub.keyid"
              :default-opened="index === 0"
              :expand-icon="icons.down"
              :expanded-icon="icons.up"
              :icon="icons.key"
              :label="sub.keyid">
              <q-card class="q-pa-md">
                <key-info dense :gpgKey="sub"/>
              </q-card>
            </q-expansion-item>
          </q-tab-panel>
          <q-tab-panel name="key" class="flex direction-column flex-grow q-gutter-y-sm">
            <div class="row">
              <div class="col-6 q-pr-xs">
                <q-input label="Algorithm" dense outlined readonly
                  :value="PublicKeyAlgo[gpgKey.public_key_algo]" class="bg-1" />
              </div>
              <div class="col-6 q-pl-xs">
                <q-input label="Key length" dense outlined readonly
                  :value="gpgKey.key_length" class="bg-1" />
              </div>
            </div>
            <div class="row flex flex-grow">
              <div class="col-12">
                <q-input label="Armored key" dense outlined readonly
                  autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"
                  type="textarea" class="armored-key bg-1" v-model="armoredKey.value" />
              </div>
            </div>
            <div class="row flex flex-grow">
              <div class="col text-right">
                <q-btn flat dense @click="copyKeyToClipboard" :disable="!armoredKey.value" class="q-mx-xs">
                  <q-icon :name="icons.clipboard" class="q-mr-xs"/> Copy to clipboard
                </q-btn>
              </div>
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </div>
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
import { exportArmoredKey, PublicKeyAlgo } from "@/service/gpg";
import { Resolvable, unresolved, failed, resolved } from "@/store/resolvable";
import { copyToClipboard } from '../service/clipboard';

type KeyDetailsTabType = "general" | "identities" | "subkey" | "key";

@Component({})
export default class KeyDetails extends Vue {
  @Prop({ type: Object }) gpgKey!: MasterKey;
  @Ref() dialog!: QDialog;
  currentTab: KeyDetailsTabType = "general";
  armoredKey: Resolvable<string | null> = unresolved();

  created() {
    setNonReactiveProps(this, { icons, PublicKeyAlgo });
  }

  show() {
    this.dialog.show();
  }

  hide() {
    this.dialog.hide();
  }

  get tab() {
    return this.currentTab;
  }

  set tab(tab: KeyDetailsTabType) {
    if (tab === "key") {
      this.exportArmoredKey(this.gpgKey.keyid);
    } else {
      this.armoredKey = unresolved();
    }
    this.currentTab = tab;
  }

  @Emit("hide")
  hideDialog() {}

  async exportArmoredKey(keyid: string) {
    console.log(this.gpgKey.type)
    try {
      const armoredKey = await exportArmoredKey(keyid, {
        secret: this.gpgKey.type === 'sec',
        homedir: SettingsModule.gpgPath
      });
      if (this.tab === "key") {
        this.armoredKey = resolved(armoredKey);
      }
    } catch (e) {
      this.armoredKey = failed(e);
    }
  }

  copyKeyToClipboard() {
    if (this.armoredKey.value) {
      copyToClipboard(this.armoredKey.value, this.gpgKey.type === 'sec')
    }
  }
}
</script>

<style lang="scss">
@import "src/styles/style.variables.scss";
@import "src/styles/style.mixins.scss";

.key-details {
  min-width: 640px;

  .key-details-tabs {
    height: 48px;
    margin-bottom: 8px;
  }

  .key-details-tab-panels {
    max-height: calc(100vh - 48px - 56px);
    @include styled-scrollbar;
    overflow-y: auto;
  }

  .armored-key {
    textarea {
      min-height: 400px !important;
      font-family: monospace;
    }
  }

  .q-field--outlined.q-field--readonly .q-field__control:before {
    border-style: solid;
  }

  .q-btn {
    text-transform: none;
  }
}

body.body--light {
  .key-details {
    .q-expansion-item .q-item {
        background: $grey-3;
        .q-item__section--avatar {
          color: $primary;
        }
    }

    .key-details-tabs {
      color: $primary;
    }
  }
}

body.body--dark {
  .key-details {
    .q-expansion-item .q-item {
        background: $grey-9;
    }
  }
}



</style>