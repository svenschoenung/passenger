<template> 
    <span>
        <template v-if="chip">
            <q-chip dense color="negative" class="q-px-sm text-white">
                <q-icon :name="icons.errors" class="q-mr-xs"/>{{errorCount}}
            </q-chip>
            <q-chip dense color="warning" class="q-px-sm text-white">
                <q-icon :name="icons.warning" class="q-mr-xs"/>{{warningCount}}
            </q-chip>
        </template>
        <template v-else>
            <q-icon :name="icons.errors" size="xs"/> {{errorCount}}
            <q-icon :name="icons.warning" size="xs"/> {{warningCount}}
        </template>
    </span>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { debounce } from 'quasar'

import { ProblemsModule } from '@/store'
import { setNonReactiveProps } from '@/util/props';
import icons from '@/ui/icons'

@Component({})
export default class ProblemsCount extends Vue {
  @Prop() chip!: boolean;

  created() {
    setNonReactiveProps(this, { icons })
  }

  get errorCount() {
      return ProblemsModule.errorCount
  }

  get warningCount() {
      return ProblemsModule.warningCount
  }
}
</script>

<style lang="scss" scoped>
</style>
