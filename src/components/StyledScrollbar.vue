<template> 
    <div class="scrollbar-container">
        <div :class="`scrollbar styled-scrollbar ${always && 'always'}`">
            <slot></slot>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({})
export default class StyledScrollbar extends Vue {
    @Prop({ type: Boolean }) always!: boolean
}
</script>

<style lang="scss" scoped>
@import "src/styles/style.variables.scss";
@import "src/styles/style.mixins.scss";

.scrollbar-container {
    position:relative;
    display:flex;
    flex-direction: column;
    flex-grow: 1;
}
.scrollbar {
    position: absolute;
    left: 0px;
    right: 0px;
    top: 0px;
    bottom: 0px;
    overflow: auto;
}
.scrollbar.always {
    overflow-y: scroll;
}
</style>
