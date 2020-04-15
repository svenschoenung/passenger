<template>
    <div class="q-gutter-y-sm">
        <div class="row">
            <div class="col-12">
                <q-input :dense="dense" label="Key ID" outlined readonly :value="gpgKey.keyid" class="bg-1" />
            </div>
        </div>
        <div class="row">
            <div class="col-6 q-pr-xs">
                <q-input :dense="dense" label="Created" outlined readonly class="bg-1"
                :value="creationDate" />
            </div>
            <div class="col-6 q-pl-xs">
                <q-input :dense="dense" label="Expires" outlined readonly class="bg-1"
                :value="expiryDate" />
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <key-capabilities :dense="dense" :gpgKey="gpgKey"/>
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <key-rating :dense="dense" type="validity" :value="gpgKey.validity"/>
            </div>
        </div>
        <div class="row" v-if="masterKey">
            <div class="col-12">
                <key-rating :dense="dense" type="owner-trust" :value="gpgKey.owner_trust"/>
            </div>
        </div>
    </div>
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
import { timestampToIsoDate } from '../util/date';

type KeyDetailsTabType = "general" | "identities" | "subkey" | "key";

@Component({})
export default class KeyDetails extends Vue {
  @Prop({ type: Object }) gpgKey!: MasterKey;
  @Prop({ type: Boolean }) dense!: boolean;

  get masterKey() {
      return this.gpgKey.type === 'pub' || this.gpgKey.type === 'sec';
  }

  get creationDate() {
      return timestampToIsoDate(this.gpgKey.creation_date) || 'Unknown'
  }

  get expiryDate() {
      return timestampToIsoDate(this.gpgKey.expiry_date) || 'Never'
  }
}
</script>

<style lang="scss">
@import "src/styles/style.variables.scss";
</style>