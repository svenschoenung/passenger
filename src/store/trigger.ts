import 'reflect-metadata'
import Vue, { WatchOptions } from 'vue';
import { Store } from 'vuex';
import { VuexModule, getModule } from 'vuex-module-decorators';
import { get, every, isEqual } from 'lodash';

import { AppState } from '@/store';

const triggers: TriggerDefinition[] = []

export interface TriggerOptions extends WatchOptions {
    whenChanged: ((state: AppState) => any)
    timeout?: number
}

export interface TriggerDefinition extends TriggerOptions {
    method: string
    module?: VuexModule
}

const triggersKey = Symbol('triggers')

export function Trigger(opts: TriggerOptions) {
    return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        let triggers: TriggerDefinition[] = Reflect.getOwnMetadata(triggersKey, target) || [];
        triggers.push({ ...opts, method: propertyKey, })
        Reflect.defineMetadata(triggersKey, triggers, target);
    };
}

declare type ConstructorOf<C> = {
    new (...args: any[]): C;
};

export function getModuleWithTriggers<M extends VuexModule>(moduleClass: ConstructorOf<M>, store: Store<AppState>) {
    const module = getModule(moduleClass, store)
    let moduleTriggers: TriggerDefinition[] = Reflect.getOwnMetadata(triggersKey, moduleClass.prototype) || [];
    moduleTriggers.forEach(trigger => triggers.push({...trigger, module}))
    return module
}

export function initTriggers(store: Store<AppState>) {
    triggers.forEach(trigger => {
        const watchOpts = {
            deep: trigger.deep !== undefined ? trigger.deep : true,
            immediate: trigger.immediate !== undefined ? trigger.immediate : false,
        }
        store.watch(
            state => trigger.whenChanged(state),
            (oldVal, newVal) => {
                if (!isEqual(oldVal, newVal)) {
                    setTimeout(() => (trigger.module as any)[trigger.method](), trigger.timeout || 0)
                }
            },
            watchOpts
        )
    })
}