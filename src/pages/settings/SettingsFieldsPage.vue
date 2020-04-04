<template>
  <q-form
    autocorrect="off"
    autocapitalize="off"
    autocomplete="off"
    spellcheck="false"
    class="settings-fields-page flex direction-column content-height q-pa-md"
  >
  <div class="row items-center q-pb-sm" style="height:40px">
    <div>
      <q-btn class="invisible" flat dense><q-icon :name="icons.add"/></q-btn>
    </div>
    <div class="col-md-2 col-sm-3 q-pl-sm">
      Field type
      <q-icon color="primary" :name="icons.help" size="xs">
        <q-tooltip>
          Defines the data type for custom fields that<br/>
          match the list of field names on the right.
        </q-tooltip>
      </q-icon>
    </div>
    <div class="col-grow q-px-sm">
      Field names
      <q-icon color="primary" :name="icons.help" size="xs">
        <q-tooltip>
          <p class="q-mb-xs">
          A comma-separated list of field names that<br/>
          should be recognized as the data type on the left.<br/>
          </p>
          <p class="q-mb-none">
          The first field name is presumed to be the preferred<br/>
          field name when creating new custom fields.
          </p>
        </q-tooltip>
      </q-icon>
    </div>
    <div>
      <q-btn class="invisible" flat dense><q-icon :name="icons.delete"/></q-btn>
    </div>
  </div>
  <styled-scrollbar always="y">
  <div class="row items-center q-pb-sm" v-for="(customField, i) in customFields" :key="i">
    <div>
      <q-btn flat dense @click="addCustomField(i)"><q-icon :name="icons.add"/></q-btn>
    </div>
    <div class="col-md-2 col-sm-3 q-pl-sm">
      <q-select outlined dense
        v-model="customField.type"
        :dropdown-icon="icons.down"
        :options="types"
        emit-value>
        <template v-slot:selected-item="scope">
          <q-item dense>
            <q-item-section avatar><q-icon :name="typesByValue[scope.opt].icon" size="sm"/></q-item-section>
            <q-item-section>{{typesByValue[scope.opt].label}}</q-item-section>
          </q-item>
        </template>
        <template v-slot:option="scope">
           <q-item dense v-bind="scope.itemProps" v-on="scope.itemEvents" :class="{'active-elem': scope.selected}">
            <q-item-section avatar><q-icon :name="scope.opt.icon" size="sm"/></q-item-section>
            <q-item-section>{{scope.opt.label}}</q-item-section>
          </q-item>
        </template>
      </q-select>
    </div>
    <div class="col-grow q-px-sm">
      <q-input outlined dense v-model="customField.keys" type="text" class="bg-1"/>
    </div>
    <div>
      <q-btn flat dense @click="deleteCustomField(i)"><q-icon :name="icons.delete"/></q-btn>
    </div>
  </div>
  </styled-scrollbar>
  <div class="text-right q-pt-md">
    <q-btn @click="loadCustomFields" class="q-mx-xs btn-secondary">
      Undo changes
    </q-btn>
    <q-btn  @click="loadDefaultCustomFields" class="q-mx-xs btn-secondary">
      Revert to defaults
    </q-btn>
  </div>
  </q-form>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { SettingsModule } from '@/store';
import icons from '@/ui/icons';
import { setNonReactiveProps } from '@/util/props';
import { CustomFieldType, CustomField, DEFAULT_CUSTOM_FIELDS } from '../../store/modules/settings';

@Component({})
export default class SettingsFieldsPage extends Vue {
  customFields: { type: CustomFieldType, keys: string }[] = []

  created() {
    setNonReactiveProps(this, { icons })
    this.loadCustomFields()
  }

  activated() {
    this.loadCustomFields()
  }

  deactivated() {
    this.saveCustomFields()
  }

  destroyed() {
    this.saveCustomFields()
  }

  load(customFields: CustomField[]) {
    this.customFields = customFields.map(customField => ({
      type: customField.type,
      keys: customField.keys.join(', ')
    }))
  }

  loadCustomFields() {
    this.load(SettingsModule.customFields)
  }

  loadDefaultCustomFields() {
    this.load(DEFAULT_CUSTOM_FIELDS)
  }

  saveCustomFields() {
    SettingsModule.setCustomFields(this.customFields.map(customField => ({
      type: customField.type,
      keys: customField.keys.split(/\s*,\s*/)
    })))
  }

  addCustomField(i: number) {
    this.customFields.splice(i + 1, 0, {
      type: this.customFields[i].type,
      keys: ''
    })
  }

  deleteCustomField(i: number) {
    this.customFields.splice(i, 1)
    if (this.customFields.length === 0) {
      this.customFields.push({
        type: CustomFieldType.user,
        keys: ''
      })
    }
  }


  get typesByValue() {
    return this.types.reduce((typesByValue, type) => ({ ...typesByValue, [type.value]: type}), {})
  }

  get types() {
      return Object.freeze([
          { label: 'User', icon: icons.user, value: CustomFieldType.user },
          { label: 'URL', icon: icons.url, value: CustomFieldType.url },
          { label: 'Email', icon: icons.email, value: CustomFieldType.email }
      ])
  }
}
</script>

<style lang="scss">
.settings-fields-page {
  .q-select {
    .q-field__native {
      padding: 0px;
    }
    .q-field__control {
      padding-left: 0px;
    }
    .q-item__section--avatar {
      min-width: auto;
    }
  }
}
</style>