<template>
  <q-dialog ref="dialog" @hide="hideDialog" @click="hide">
    <div class="password-popup">
      <div class="bg-0 shadow-grey-8 password-char" v-for="(char, i) in password" :key="i">
        <div class="type">{{type(char)}}</div>
        <div class="char">{{char}}</div>
        <div class="index">{{i+1}}</div>
      </div>
    </div>
  </q-dialog> 
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit, Watch, Ref } from 'vue-property-decorator';
import { QTooltip, Notify, QDialog } from 'quasar';

import icons from '@/ui/icons';

@Component({})
export default class PasswordInput extends Vue {
  @Prop({ type: String }) password!: string;
  @Ref() dialog!: QDialog;

  show () {
    this.dialog.show()
  }

  hide () {
    this.dialog.hide()
  }

  type(char: string) {
    if (char.match(/[a-z]/)) {
        return 'lowercase'
    }
    if (char.match(/[A-Z]/)) {
        return 'uppercase'
    }
    if (char.match(/[0-9]/)) {
        return 'number'
    }
    return 'symbol'
 }

  @Emit('hide')
  hideDialog() { }
}
</script>

<style lang="scss">
@import "src/styles/style.variables.scss";

.password-popup {
    padding-top: 1px;
    padding-left: 1px;

    .password-char {
        display: inline-block;
        text-align: center;
        margin:-1px 0 0 -1px;
        padding-top: 0.5em;
        padding-bottom: 0.5em;

        .char {
            width: 1.5em;
            font-size: 5em;
            font-weight: bold;
            margin-bottom: 0.2em;
        }

        .type, .index {
            opacity: 0.6;
        }
    }
}
.q-dialog__inner--minimized > div.password-popup {
    max-width: inherit;
    border-radius: 0px;
    box-shadow: none;
}

body.body--light {
    .password-popup {
        .password-char {
            border: 1px solid $grey-5;
        }
    }
}

body.body--dark {
    .password-popup {
        .password-char {
            border: 1px solid $grey-8;
        }
    }
}
</style>