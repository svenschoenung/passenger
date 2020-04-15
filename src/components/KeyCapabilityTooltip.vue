<template>
    <q-tooltip :delay="500">
        <span v-if="capabilityType === 'capable'">
            This key supports {{capabilityName}}
        </span>
        <span v-else-if="capabilityType === 'capable-via-subkey'">
            This key has a subkey that supports {{capabilityName}}
        </span>
        <span v-else>
            This key does not support {{capabilityName}}
        </span>
    </q-tooltip>
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
import { exportArmoredKey } from "@/service/gpg";
import { Resolvable, unresolved, failed, resolved } from "@/store/resolvable";
import icons from "@/ui/icons";

@Component({})
export default class KeyCapabilityTooltip extends Vue {
  @Prop({ type: String }) capabilityType!: 'capable' | 'capable-via-subkey' | '';
  @Prop({ type: String }) capabilityName!: string;
}
</script>

<style lang="scss">
@import "src/styles/style.variables.scss";
</style>