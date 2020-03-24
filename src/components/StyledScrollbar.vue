<template> 
    <div class="scrollbar-container">
        <div :class="`scrollbar styled-scrollbar ${alwaysClasses} ${neverClasses}`">
            <slot></slot>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({})
export default class StyledScrollbar extends Vue {
    @Prop() always!: boolean | 'x' | 'y'
    @Prop() never!: boolean | 'x' | 'y'

    get alwaysClasses() {
        if (this.always) {
            if (this.always === true) {
                return 'always always-x always-y'
            }
            return `always always-${this.always}`
        }
        return ''
    }

    get neverClasses() {
        if (this.never) {
            if (this.never === true) {
                return 'never never-x never-y'
            }
            return `never never-${this.never}`
        }
        return ''
    }
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
.scrollbar.always-x {
    overflow-x: scroll;
}
.scrollbar.always-y {
    overflow-y: scroll;
}
.scrollbar.never-x {
    overflow-x: hidden;
}
.scrollbar.never-y {
    overflow-y: hidden;
}
</style>
