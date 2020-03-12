<template>
    <q-circular-progress
      indeterminate
      :style="{
        position: 'absolute',
        top: `calc(50% - ${sizeInPx / 2}px)`,
        left: `calc(50% - ${sizeInPx / 2}px)`,
      }"
      :size="`${sizeInPx}px`"
      :thickness="0.22"
      color="primary"
      track-color="grey-3"/>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({})
export default class CenteredProgress extends Vue {
  @Prop({ type: Number }) size!: number
  @Prop({ type: String }) icon!: string

  get sizeInPx() {
    return this.size || 50
  }
}
</script>

<style lang="scss">
</style>