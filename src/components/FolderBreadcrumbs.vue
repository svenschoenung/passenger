<template>
    <q-breadcrumbs gutter="xs" class="folder-breadcrumbs q-pa-md" v-roving-tabindex-container.horizontal>
        <q-breadcrumbs-el v-for="f in folders" :key="f.absPath">
            <q-btn class="q-pa-none" flat @click="folderClicked(f)" v-roving-tabindex>
              <q-icon :name="icons.folder" size="xs" color="primary"/>{{f.name}}
            </q-btn>
        </q-breadcrumbs-el>
        <template v-slot:separator><q-icon :name="icons.separator"/></template>
    </q-breadcrumbs>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator';
import { RovingTabindexContainer, RovingTabindex } from '@4rk/vue-roving-tabindex'
import { PasswordFolder } from '@/model/tree';
import icons from '@/ui/icons';
import { PasswordsModule, UIModule } from '../store';

@Component({
  name: 'folder-breadcrumbs',
  directives: {
    RovingTabindexContainer,
    RovingTabindex
  }
})
export default class FolderBreadcrumbs extends Vue {
  @Prop({ type: Array }) folders!: PasswordFolder[];

  created() {
    (this as any).icons = icons;
  }

  folderClicked(folder: PasswordFolder) {
    UIModule.selectPasswordNode$(folder.absPath)
  }
}
</script>

<style lang="scss">
@import "src/styles/quasar.variables.scss";
.folder-breadcrumbs {
    svg {
      margin-right:5px;
    }

    .q-btn {
      text-transform: none;
      font-weight: normal;
    }

    .q-btn__wrapper {
       padding: 0px 4px;
       min-height: 2em;
    }
}

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