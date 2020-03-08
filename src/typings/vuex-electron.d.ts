
declare module 'vuex-electron' {
    import * as vuex from 'vuex'
    import ElectronStore from 'electron-store';

    export interface Mutation {
        type: string,
        payload: any
    }

    export interface CreatePersistedStateOptions {
        whitelist?: string[] | ((mutation: Mutation) => boolean)
        blacklist?: string[] | ((mutation: Mutation) => boolean)
        storage?: ElectronStore
    }

    export function createPersistedState<T>(options?: CreatePersistedStateOptions): vuex.Plugin<T>;
    export function createSharedMutations<T>(): vuex.Plugin<T>;
}