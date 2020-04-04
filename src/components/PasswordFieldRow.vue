<template>
    <div class="field-row row items-center">
        <div class="col col-1 text-right">
            <q-icon v-if="type" :name="icons[type]" size="sm" color="primary" class="q-mr-xs"/>
        </div>
        <div class="col col-2 col-key">
            <q-input dense outlined 
                type="text"
                class="bg-1"
                :debounce="500"
                :value="field.key"
                @input="setKey($event)"/>
        </div>
        <div class="col col-8 col-val">
            <q-input dense outlined autogrow 
                type="textarea"
                class="bg-1"
                :debounce="500"
                :value="field.value"
                @input="setValue($event)">
                <template slot:append>
                    <template v-if="type === 'url'">
                        <q-btn dense flat @click="openUrl()" :disable="!isValidUrl">
                            <q-icon :name="icons.openUrl"/>
                            <q-tooltip :delay="1000">Open in browser</q-tooltip>
                        </q-btn>
                    </template>
                    <template v-else-if="type === 'email'">
                        <q-btn dense flat @click="sendEmail()" :disable="!isValidEmail">
                            <q-icon :name="icons.sendEmail"/>
                            <q-tooltip :delay="1000">Compose message</q-tooltip>
                        </q-btn>
                    </template>
                    <q-btn dense flat @click="copyToClipboard()" :disable="!field.value">
                        <q-icon :name="icons.clipboard"/>
                        <q-tooltip :delay="1000">Copy to clipboard</q-tooltip>
                    </q-btn> 
                </template>
            </q-input>
        </div>
        <div class="col col-1">
            <q-btn flat dense @click="deleteField()">
                <q-icon :name="icons.delete" size="sm"/>
            </q-btn>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit, Watch } from 'vue-property-decorator';
import { shell } from 'electron';
import { validate } from 'validate.js'
import { Notify } from 'quasar';

import { FolderValidator } from '@/model/validation';
import { setNonReactiveProps } from '@/util/props';
import { parseTextContents, parseKeyValueContents, serializeKeyValueContents, PasswordKeyValueContents, PasswordField } from '@/service/contents';
import { copyToClipboard } from '@/service/clipboard';
import { CustomFieldType } from '@/store/modules/settings';
import icons from '@/ui/icons';
import { SettingsModule } from '@/store';

@Component({})
export default class PasswordFieldRow extends Vue {
  @Prop({ type: Object }) field!: PasswordField;

  created() {
    setNonReactiveProps(this, { icons })
  }

  get type() {
    if (this.field.key) {
        const fieldKey = this.field.key.toLowerCase()
        const typeFromKey = SettingsModule.customFields.find(customField => {
            return customField.keys.find(key => key.toLowerCase() === fieldKey)
        })
        if (typeFromKey) {
            return typeFromKey.type
        }
    }
    const typeFromValidation = SettingsModule.customFields.find(customField => {
        let valid: boolean = false
        switch (customField.type) {
            case CustomFieldType.url: valid = this.isValidUrl; break;
            case CustomFieldType.email: valid = this.isValidEmail; break;
        }
        if (valid) {
            return true
        }
    }) 
    if (typeFromValidation) {
        return typeFromValidation.type
    }
    return undefined
  }

  setKey(key: string) {
    this.field.key = key
    this.updateField(this.field)
  }

  setValue(value: string) {
    this.field.value = value
    this.updateField(this.field)
  }

  deleteField() {
    this.updateField(null)
  }

  @Emit('input')
  updateField(field: PasswordField | null) {
    return field
  }

  get isValidUrl() {
      return !validate(this.field, {
          value: {
              presence: true,
              url: true
          }
      })
  }

  get isValidEmail() {
      return !validate(this.field, {
          value: {
              presence: true,
              email: true
          }
      })
  }

  openUrl() {
      shell.openExternal(this.field.value)
  }

  sendEmail() {
      shell.openExternal('mailto:' + this.field.value)
  }

  async copyToClipboard() {
    await copyToClipboard(this.field.value, false)
    Notify.create({
      color: 'primary',
      classes: 'notification-above-status-bar',
      position: 'bottom-right',
      message: 'Copied to clipboard',
      timeout: 1500,
    })
  }
}
</script>

<style lang="scss" >
@import "src/styles/style.variables.scss";
.field-row {
    & > .col {
        padding: 3px;
    }

    .col-key {
        padding-left: 0px;
    }

    .col-val {
        padding-right: 0px;
    }

}

body.body--light {
  .field-row  {
    svg {
      color: $primary;
    }
  }
}

body.body--dark {
  .field-row  {
    svg {
      color: $grey-5;
    }
  }
}
</style>