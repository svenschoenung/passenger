<template>
    <q-input dense outlined 
        class="bg-1 flex-grow text-md password-input"
        debounce="300"
        :type="showPassword ? 'text' : 'password'"
        v-model="value">
        <template slot:append>
            <q-btn dense flat @click="showPassword = !showPassword">
                <q-icon :name="icons[showPassword ? 'hidePassword' : 'showPassword']"/>
                <q-tooltip :delay="1000">Reveal password</q-tooltip>
            </q-btn>
            <q-btn dense flat @click="copyToClipboard()" :disable="!value">
                <q-icon :name="icons.clipboard"/>
                <q-tooltip :delay="1000">Copy to clipboard</q-tooltip>
            </q-btn> 
      </template>
    </q-input>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit, Watch, Ref } from 'vue-property-decorator';

import { setNonReactiveProps } from '@/util/props';
import icons from '@/ui/icons';
import { copyToClipboard } from '../service/clipboard';
import { QTooltip, Notify } from 'quasar';

@Component({})
export default class PasswordInput extends Vue {
  @Prop({ type: String }) value!: string;
  showPassword = false

  created() {
    setNonReactiveProps(this, { icons })
  }

  get password() {
      return this.value
  }

  set password(password: string) {
      this.updatePassword(password)
  }

  @Emit('input')
  updatePassword(value: string) {
    return value;
  }

  async copyToClipboard() {
    await copyToClipboard(this.value, true)
    Notify.create({
      color: 'primary',
      classes: 'notification-above-status-bar',
      position: 'bottom-right',
      message: 'Password copied',
      timeout: 1500,
    })
  }
}
</script>

<style lang="scss">
@import "src/styles/style.variables.scss";
.password-input input[type="password"] {
    font-size: 300%;
}

body.body--light {
  .password-input  {
    svg {
      color: $primary;
    }
  }
}

body.body--dark {
  .password-input  {
    svg {
      color: $grey-5;
    }
  }
}
</style>