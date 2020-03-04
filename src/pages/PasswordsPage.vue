<template>
  <q-splitter id="passwords-page" v-model="treePaneWidthInPercent" :style="{ height: `calc(100vh - ${footerHeight}px`}">
    <template v-slot:before>
      <passwords-tree/>
    </template>
    <template v-slot:after>Passwords</template>
  </q-splitter>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { FOOTER_HEIGHT } from "@/constants";
import PasswordsTree from '@/components/PasswordsTree.vue'

@Component({
  name: "passwords-page",
  components: {
    PasswordsTree
  }
})
export default class PasswordsPage extends Vue {
  footerHeight = FOOTER_HEIGHT;
  treePaneWidthInPercent = 30;
}
</script>

<style lang="scss">
#passwords-page {
  .q-splitter__panel.q-splitter__before {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }
}
</style>