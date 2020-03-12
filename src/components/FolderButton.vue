<template>
  <q-btn class="folder-button q-pa-none" flat @click="folderClicked">
    <q-icon class="folder-icon" :name="icons.folder" size="xs" color="primary"/>{{folder.name}}
  </q-btn>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator';

import { PasswordFolder } from '@/model/passwords';
import { UIModule } from '@/store';
import { setNonReactiveProps } from '@/util/props';
import icons from '@/ui/icons';

@Component({})
export default class FolderButton extends Vue {
  @Prop({ type: Object }) folder!: PasswordFolder;
  @Prop({ type: String }) icon!: string

  created() {
    setNonReactiveProps(this, { icons })
  }

  folderClicked() {
    UIModule.selectPasswordPath(this.folder.relPath)
  }
}
</script>

<style lang="scss">
@import "src/styles/style.variables.scss";

.folder-button {
    text-transform: none;
    font-weight: normal;

    svg.folder-icon {
      margin-right:5px;
    }

    .q-btn__wrapper {
       padding: 0px 4px;
       min-height: 2em;
    }
}
</style>