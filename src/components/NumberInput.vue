<template>
  <q-input type="number" dense :outlined="outlined" :rounded="rounded" :standout="standout" 
    :class="{ 'number-input': true, 'number-input-dense': dense }"
    input-class="text-right"
    v-model.number="num"
    :disable="disable"
    @keydown.up="increase"
    @keydown.down="decrease">
    <template v-slot:append>
      <div v-if="dense" class="dense-buttons">
        <q-btn flat dense size="xs" @click="increase" class="button-up">
          <q-icon :name="icons.increase" size="xs"/>
        </q-btn>
        <q-btn flat dense size="xs" @click="decrease" class="button-down">
          <q-icon :name="icons.decrease" size="xs"/>
        </q-btn>
      </div>
      <div v-else class="flex direction-column buttons">
        <q-btn flat dense size="xs" @click="increase" class="button-up">
          <q-icon :name="icons.increase" size="xs"/>
        </q-btn>
        <q-btn flat dense size="xs" @click="decrease" class="button-down">
          <q-icon :name="icons.decrease" size="xs"/>
        </q-btn>
     </div>
   </template>
 </q-input>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator'
import { setNonReactiveProps } from '@/util/props'
import icons from '@/ui/icons'

@Component({})
export default class NumberInput extends Vue {
  @Prop({ type: Number }) value!: number;
  @Prop({ type: Boolean }) disable!: boolean;
  @Prop({ type: Number }) min!: number;
  @Prop({ type: Number }) max!: number;
  @Prop({ type: Boolean }) dense!: boolean;
  @Prop({ type: Boolean }) rounded!: boolean;
  @Prop({ type: String }) standout!: string;
  @Prop({ type: Boolean }) outlined!: boolean;

  created() {
      setNonReactiveProps(this, { icons })
  }

  get num() {
      return this.value;
  }
  
  set num(n: number) {
      this.changeValue(n)
  }

  increase() {
      this.changeValue(this.value + 1)
  }

  decrease() {
      this.changeValue(this.value - 1)
  }

  @Emit('input')
  changeValue(n: number) {
      if (this.min !== undefined && n < this.min) {
          n = this.min
      }
      if (this.max !== undefined && n > this.max) {
          n = this.max
      }
      return n
  }
}
</script>

<style lang="scss">
.number-input {
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    .buttons {
        height: 100%;

        .q-btn {
            height: 50%;
            border-radius: 0px;
        }

        .button-down svg {
            margin-top: -2px;
        }
    }

    &.number-input-dense {
        &.q-field--dense .q-field__control, &.q-field--dense .q-field__marginal {
            height: 30px
        }
        .q-btn {
            margin-top: -5px;
        }
    }
}
</style>