<template>
  <div>
    <div>
      <q-input dense outlined 
          class="bg-1 flex-grow text-md password-input"
          debounce="300"
          :type="showPassword ? 'text' : 'password'"
          v-model="value">
          <template slot:append>
              <q-btn dense flat @click="toggleShowPassword">
                  <q-icon :name="icons[showPassword ? 'hidePassword' : 'showPassword']"/>
                  <q-tooltip :delay="1000">Reveal password</q-tooltip>
              </q-btn>
              <q-btn dense flat @click="showPasswordDialog">
                  <q-icon :name="icons.glasses"/>
                  <q-tooltip :delay="1000">Reveal large password</q-tooltip>
              </q-btn>
              <q-btn dense flat @click="toggleShowGeneratePassword">
                  <q-icon :name="icons.generatePassword"/>
                  <q-tooltip :delay="1000">Generate password</q-tooltip>
              </q-btn>
              <q-btn dense flat @click="copyToClipboard" :disable="!value">
                  <q-icon :name="icons.clipboard"/>
                  <q-tooltip :delay="1000">Copy to clipboard</q-tooltip>
              </q-btn> 
          </template>
      </q-input>
    </div>
    <div class="q-mt-sm text-right" v-if="showGeneratePassword">
      length:
      <number-input dense rounded :min="1" :max="99"
         standout="password-length-focus" class="password-length"
         v-model="options.length" />
      <q-toggle v-model="options.lowercase" size="xs" label="a-z"/>
      <q-toggle v-model="options.uppercase" size="xs" label="A-Z"/>
      <q-toggle v-model="options.numbers" size="xs" label="0-9"/>
      <q-toggle v-model="options.symbols" size="xs" label="symbols"/>
      <q-toggle v-model="options.excludeSimilarCharacters" size="xs" label="unambiguous"/>
      <q-btn @click="generatePassword" size="sm" color="primary" class="text-capitalize q-ml-md"
        :disable="!options.lowercase && !options.uppercase && !options.numbers && !options.symbols">Generate Password</q-btn>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit, Watch, Ref } from 'vue-property-decorator';
import { QTooltip, Notify } from 'quasar';
import { generate } from 'generate-password'

import PasswordPopup from '@/components/PasswordPopup.vue';
import { setNonReactiveProps, initNonReactiveProp, removeNonReactiveProp } from '@/util/props';
import { copyToClipboard } from '@/service/clipboard';
import { PreferencesModule, UIModule, SettingsModule } from '@/store';
import icons from '@/ui/icons';

@Component({})
export default class PasswordInput extends Vue {
  @Prop({ type: String }) value!: string;
  showPassword = false
  showGeneratePassword = false

  created() {
    setNonReactiveProps(this, { icons })
    this.subscribeEndCountdown()
  }
  
  activated() {
    this.subscribeEndCountdown()
  }

  deactivated() {
    this.unsubscribeEndCountdown()
  }

  destroyed() {
    this.unsubscribeEndCountdown()
  }

  subscribeEndCountdown() {
    initNonReactiveProp(this, 'endCountdown', () => this.$store.subscribeAction(action => {
      if (action.type === 'ui/endCountdown' && action.payload === 'passwordReveal') {
        this.showPassword = false
      }
    }))
  }

  unsubscribeEndCountdown() {
    removeNonReactiveProp(this, 'endCountdown', unsubscribe => unsubscribe())
    UIModule.endCountdown('passwordReveal')
  }

  get password() {
      return this.value
  }

  set password(password: string) {
      this.updatePassword(password)
  }

  get options() {
    return PreferencesModule.passwordGeneratorOptions
  }

  @Emit('input')
  updatePassword(value: string) {
    return value;
  }

  toggleShowPassword() {
    if (this.showPassword) {
      this.showPassword = false
      UIModule.endCountdown('passwordReveal')
    } else {
      this.showPassword = true
      if (SettingsModule.timeouts.passwordReveal.enable) {
        UIModule.startPasswordRevealCountdown()
      }
    }
  }

  showPasswordDialog() {
    this.$q.dialog({
      component: PasswordPopup,
      parent: this,
      password: this.value
    })
  }

  toggleShowGeneratePassword() {
    if (this.showGeneratePassword) {
      this.showPassword = false
    }
    this.showGeneratePassword = !this.showGeneratePassword
  }

  generatePassword() {
    this.showPassword = true
    const pass = generate({
      ...PreferencesModule.passwordGeneratorOptions,
      strict: true
    })
    this.updatePassword(pass)
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

.password-length {
  display: inline-block;
  width: 100px;
}

body.body--light {
  .password-input  {
    svg {
      color: $primary;
    }
  }
  .password-length-focus {
    background: rgba(0, 0, 0, 0.05) !important;
    * {
      color: black !important;
    }
  }
}

body.body--dark {
  .password-input  {
    svg {
      color: $grey-5;
    }
  }
  .password-length-focus {
    background: rgba(255, 255, 255, 0.07) !important;
    * {
      color: white !important;
    }
  }

}
</style>