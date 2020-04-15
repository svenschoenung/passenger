<template>
    <q-field :label="fieldLabel" :dense="dense" stack-label outlined readonly class="key-rating bg-1">
      <q-linear-progress stripe :color="color" :value="progress" size="25px">
         <div class="absolute-full flex flex-center">
            <q-badge color="white" :text-color="color" :label="`${label} (${value})`" />
         </div>
      </q-linear-progress>
    </q-field>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit, Watch, Ref } from "vue-property-decorator";

import { Validities, OwnerTrust } from "@/service/gpg";

const validityColors = {
    o: 'grey-8',
    i: 'negative', 
    d: 'negative', 
    r: 'negative',
    e: 'negative',
    '-': 'grey-8',
    q: 'grey-8',
    n: 'negative',
    m: 'positive',
    f: 'positive',
    u: 'positive',
    w: 'positive',
    s: 'grey-8'
}

const validityProgress = {
    o: 100,
    i: 100, 
    d: 100, 
    r: 100,
    e: 100,
    '-': 100,
    q: 100,
    n: 100,
    m: 33,
    f: 66,
    u: 100,
    w: 33,
    s: 100
}

export const ownerTrustColors = {
    '-': 'grey-8',
    e: 'negative',
    q: 'grey-8',
    n: 'negative',
    m: 'positive',
    f: 'positive',
    u: 'positive',
    r: 'negative',
    '?': 'grey-8',
}

export const ownerTrustProgress = {
    '-': 100,
    e: 100,
    q: 100,
    n: 100,
    m: 33,
    f: 66,
    u: 100,
    r: 100,
    '?': 100,
}


@Component({})
export default class KeyRating extends Vue {
  @Prop({ type: String, required: true }) type!: 'validity' | 'owner-trust';
  @Prop({ type: String, required: true }) value!: keyof typeof Validities | keyof typeof OwnerTrust;
  @Prop({ type: Boolean }) dense!: boolean;

  get progress() {
    if (this.type === 'validity') {
      return validityProgress[this.value as keyof typeof Validities]
    } else {
      return ownerTrustProgress[this.value as keyof typeof OwnerTrust]
    }
  }

  get color() {
    if (this.type === 'validity') {
      return validityColors[this.value as keyof typeof Validities]
    } else {
      return ownerTrustColors[this.value as keyof typeof OwnerTrust]
    }
  }

  get label() {
    if (this.type === 'validity') {
      return Validities[this.value as keyof typeof Validities]
    } else {
      return OwnerTrust[this.value as keyof typeof OwnerTrust]
    }
  }

  get fieldLabel() {
    return (this.type === 'validity') ? 'Validity' : 'Owner trust'
  }
}
</script>

<style lang="scss">
@import "src/styles/style.variables.scss";
.key-rating {
    .q-linear-progress {
        margin-top: 5px;
        margin-bottom: 12px;
        color: white;
    }
}
</style>