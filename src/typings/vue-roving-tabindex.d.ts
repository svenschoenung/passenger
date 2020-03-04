declare module "@4rk/vue-roving-tabindex" {
    import { DirectiveOptions, PluginObject } from 'vue'
    export const RovingTabindexContainer: DirectiveOptions
    export const RovingTabindex: DirectiveOptions
    let VueRovingTabindex: PluginObject<any>
    export default VueRovingTabindex
}