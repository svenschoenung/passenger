<template>
  <div class="error">
    <q-icon :name="icons.error" color="negative" size="lg"/>
    <span class="text-negative">{{message}}</span>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { setNonReactiveProps } from '@/util/props';
import icons from '@/ui/icons';

@Component({})
export default class CenteredError extends Vue {
  @Prop({ type: Error }) error!: Error
  @Prop({ type: String }) msg!: string

  created() {
    setNonReactiveProps(this, { icons })
  }

  get message() {
    if (this.msg) {
      return this.msg
    }
    if (this.error && this.error.message) {
      return this.error.message
    }
    return 'An error occurred'
  }
}
</script>

<style lang="scss" scoped>
.error {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: center;
  align-items: center;
  text-align: center;
}
</style>