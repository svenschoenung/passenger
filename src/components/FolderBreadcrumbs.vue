<template>
    <q-breadcrumbs v-if="folders.length > 0" gutter="xs" class="folder-breadcrumbs q-pa-md" v-roving-tabindex-container.horizontal>
        <q-breadcrumbs-el v-for="f in folders" :key="f.relPath">
            <folder-button :folder="f" v-roving-tabindex/>
        </q-breadcrumbs-el>
        <template v-slot:separator><q-icon :name="icons.separator"/></template>
    </q-breadcrumbs>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator';

import { PasswordFolder } from '@/model/passwords';
import { setNonReactiveProps } from '@/util/props';
import icons from '@/ui/icons';

@Component({})
export default class FolderBreadcrumbs extends Vue {
  @Prop({ type: Array }) folders!: PasswordFolder[];

  created() {
    setNonReactiveProps(this, { icons })
  }
}
</script>

<style lang="scss">
@import "src/styles/style.variables.scss";

body.body--light{
    .folder-breadcrumbs {
      .q-breadcrumbs__el {
        color: $dark;
      }
    }
}

body.body--dark {
    .folder-breadcrumbs {
      .q-breadcrumbs__el {
        color: white;
      }
    }
}
</style>