declare module 'vuex-electron' {
    import * as vuex from 'vuex'

    export function createPersistedState<T>(): vuex.Plugin<T>;
    export function createSharedMutations<T>(): vuex.Plugin<T>;
}