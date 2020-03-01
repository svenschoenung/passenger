
declare module 'vuex-electron' {
    import * as vuex from 'vuex'
    import ElectronStore from 'electron-store';

    export interface CreatePersistedStateOptions {
        whitelist?: string[];
        blacklist?: string[];
        storage?: ElectronStore
    }

    export function createPersistedState<T>(options?: CreatePersistedStateOptions): vuex.Plugin<T>;
    export function createSharedMutations<T>(): vuex.Plugin<T>;
}