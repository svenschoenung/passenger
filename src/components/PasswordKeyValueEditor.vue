<template>
  <div class="password-key-value-editor">
    <div class="row label-row">
      <div class="col col-1"></div>
      <div class="col col-10">
        <label>Password:</label>
      </div>
      <div class="col col-1">
      </div>
    </div>
    <div class="row">
      <div class="col col-1"></div>
      <div class="col col-10">
        <password-input :value="contents.password" @input="setPassword"/> 
      </div>
      <div class="col col-1"></div>
    </div>
    <div class="row label-row">
      <div class="col col-1"></div>
      <div class="col col-6">
        <label>Custom fields:</label>
      </div>
      <div class="col col-4 text-right">
        <q-btn-dropdown split rounded flat dense size="sm" @click="addField()"
          :icon="icons.add" :dropdown-icon="icons.expanded">
          <q-list dense>
            <q-item v-for="f in fieldTypeKeys" :key="f.type"
              clickable v-close-popup @click="addField(f.keys[0])">
              <q-item-section>
                 <q-item-label class="q-mr-sm">
                 <q-icon :name="icons[f.type]" size="xs" class="q-mr-sm"/>
                  {{f.keys[0]}}
                 </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>
      <div class="col col-1">
      </div>
    </div>
    <styled-scrollbar always="y" never="x">
      <template v-for="(field, i) in contents.fields"> 
        <div style="margin-right:-10px;"  :key="i">
        <password-field-row
          :field="field" @input="updateField(i, $event)"/>
          </div>
      </template>
    </styled-scrollbar>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit, Watch } from 'vue-property-decorator';
import electron from 'electron';

import { FolderValidator } from '@/model/validation';
import { setNonReactiveProps } from '@/util/props';
import { parseTextContents, parseKeyValueContents, serializeKeyValueContents, PasswordKeyValueContents, PasswordField } from '@/service/contents';
import { FieldType, DEFAULT_FIELDS, FieldTypeKeys } from './PasswordFieldRow.vue';
import icons from '@/ui/icons';

@Component({})
export default class PasswordKeyValueEditor extends Vue {
  @Prop({ type: String }) value!: string;
  contents: PasswordKeyValueContents | null = null

  created() {
    setNonReactiveProps(this, { icons })
    this.contents = parseKeyValueContents(this.value)
    this.ensureOneFieldExists()
  }

  get fieldTypeKeys(): FieldTypeKeys[] {
    return DEFAULT_FIELDS
  }

  setPassword(password: string) {
    this.contents!.password = password
    this.updateContents()
  }

  addField(key?: string) {
    this.contents!.fields.push({ key: key || '', value: '' })
    this.updateContents()
  }

  updateField(i: number, field: PasswordField | null) {
    if (field) {
      Vue.set(this.contents!, i, field)
    } else {
      this.contents!.fields.splice(i, 1)
      this.ensureOneFieldExists()
    }
    this.updateContents()
  }

  ensureOneFieldExists() {
    if (this.contents!.fields.length === 0) {
      this.contents!.fields.push({ key: '', value: '' })
    }
  }

  @Emit('input')
  updateContents() {
    return serializeKeyValueContents(this.contents!);
  }
}
</script>

<style lang="scss">
@import "src/styles/style.variables.scss";
.password-key-value-editor {

  > .row {
    align-items: center;
  }

  .label-row {
    height: 35px;

    &:not(:first-child) {
      margin-top: 20px;
    }
  }
}

body.body--dark {
  .password-key-value-editor {
    .q-btn-group {
      background-color: rgba(white, $alpha: 0.2)
    }
  }
}
</style>