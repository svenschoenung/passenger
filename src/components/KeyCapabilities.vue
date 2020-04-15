<template>
    <q-field label="Capabilities" :dense="dense" stack-label outlined readonly class="capabilities bg-1">
    <template v-slot:control>
        <q-checkbox :dense="dense" disable label="Authentication"
            :class="authenticationCapability"
            :value="!!authenticationCapability">
            <key-capability-tooltip :capabilityType="authenticationCapability" capabilityName="authentication"/>
        </q-checkbox>
        <q-checkbox :dense="dense" disable label="Certification"
            :class="certificationCapability"
            :value="!!certificationCapability">
            <key-capability-tooltip :capabilityType="certificationCapability" capabilityName="certification"/>
        </q-checkbox>
        <q-checkbox :dense="dense" disable label="Encryption"
            :class="encryptionCapability"
            :value="!!encryptionCapability">
            <key-capability-tooltip :capabilityType="encryptionCapability" capabilityName="encryption"/>
        </q-checkbox>
        <q-checkbox :dense="dense" disable label="Signing"
            :class="signingCapability"
            :value="!!signingCapability">
            <key-capability-tooltip :capabilityType="signingCapability" capabilityName="signing"/>
        </q-checkbox>
    </template>
    </q-field>
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
import { exportArmoredKey } from "@/service/gpg";
import { Resolvable, unresolved, failed, resolved } from "@/store/resolvable";

type KeyDetailsTabType = "general" | "identities" | "subkey" | "key";

@Component({})
export default class KeyDetails extends Vue {
  @Prop({ type: Object }) gpgKey!: GenericKey;
  @Prop({ type: Boolean }) dense!: boolean;

  created() {
    setNonReactiveProps(this, { icons });
  }

  get authenticationCapability() {
    return this.capabilityClass('a')
  }

  get certificationCapability() {
    return this.capabilityClass('c')
  }

  get encryptionCapability() {
    return this.capabilityClass('e')
  }

  get signingCapability() {
    return this.capabilityClass('s')
  }

  capabilityClass(capability: 'a' | 'c' | 'e' | 's') {
    if (this.gpgKey.key_cap.includes(capability)) {
      return 'capable'
    } 
    if (this.gpgKey.key_cap.includes(capability.toUpperCase())) {
      return 'capable-via-subkey'
    }
    return ''
  }
}
</script>

<style lang="scss">
@import "src/styles/style.variables.scss";
.capabilities {
     &, * { cursor: default !important; }

    .q-checkbox {
        margin: 5px;
        margin-left: 0px;
    }
}

body.body--light {
  .capabilities {
    .capable-via-subkey .q-checkbox__inner--truthy {
      .q-checkbox__bg {
        border-color: $grey-7;
      }
      svg {
        color: $grey-7;
        background: $bg-0-light;
      }
    }
  }
}

body.body--dark {
  .capabilities {
    .capable-via-subkey .q-checkbox__inner--truthy {
      .q-checkbox__bg {
        border-color: $grey-5;
      }
      svg {
        background: $bg-0-dark;
      }
    }
  }
}
</style>