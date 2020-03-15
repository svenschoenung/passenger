<template>
    <div class="field-row row items-center">
        <div class="col col-1 text-right">
            <q-icon v-if="type" :name="icons[type]" size="sm" color="primary" class="q-mr-xs"/>
        </div>
        <div class="col col-2">
            <q-input dense outlined 
                type="text"
                class="bg-1"
                :debounce="500"
                :value="field.key"
                @input="setKey($event)"/>
        </div>
        <div class="col col-8">
            <q-input dense outlined autogrow 
                type="textarea"
                class="bg-1"
                :debounce="500"
                :value="field.value"
                @input="setValue($event)">
                <template v-if="['url', 'email'].includes(type)" slot:append>
                    <template v-if="type === 'url'">
                        <q-btn dense flat @click="openUrl()" :disable="!isValidUrl">
                            <q-icon :name="icons.openUrl"/>
                            <q-tooltip>Open in browser</q-tooltip>
                        </q-btn>
                    </template>
                    <template v-else-if="type === 'email'">
                        <q-btn dense flat @click="sendEmail()" :disable="!isValidEmail">
                            <q-icon :name="icons.sendEmail"/>
                            <q-tooltip>Compose message</q-tooltip>
                        </q-btn>
                    </template>
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

import { FolderValidator } from '@/model/validation';
import { setNonReactiveProps } from '@/util/props';
import { parseTextContents, parseKeyValueContents, serializeKeyValueContents, PasswordKeyValueContents, PasswordField } from '@/service/contents';
import icons from '@/ui/icons';

export enum FieldType {
    user = 'user',
    email = 'email',
    url = 'url'
}

export interface FieldTypeKeys {
    type: FieldType,
    keys: string[]
}

export const DEFAULT_FIELDS: FieldTypeKeys[] = [
    {
        type: FieldType.user,
        keys: ['User', 'Username', 'Login', 'Account']
    },
    {
        type: FieldType.email,
        keys: ['Email', 'Mail', 'Email-Address']
    },
    {
        type: FieldType.url,
        keys: ['URL', 'Web', 'Website']
    }
]

@Component({})
export default class PasswordFieldRow extends Vue {
  @Prop({ type: Object }) field!: PasswordField;

  created() {
    setNonReactiveProps(this, { icons })
  }

  get type() {
    if (this.field.key) {
        const fieldKey = this.field.key.toLowerCase()
        const typeFromKey = DEFAULT_FIELDS.find(fieldTypeKeys => {
            return fieldTypeKeys.keys.find(key => key.toLowerCase() === fieldKey)
        })
        if (typeFromKey) {
            return typeFromKey.type
        }
    }
    const typeFromValidation = DEFAULT_FIELDS.find(fieldTypeKeys => {
        let valid: boolean = false
        switch (fieldTypeKeys.type) {
            case FieldType.url: valid = this.isValidUrl; break;
            case FieldType.email: valid = this.isValidEmail; break;
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
}
</script>

<style lang="scss" >
@import "src/styles/style.variables.scss";
.field-row {
    & > .col {
        padding: 3px;
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