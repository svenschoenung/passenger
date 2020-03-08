import { Mutation as MutationDecorator } from 'vuex-module-decorators'
export { Module, VuexModule, Action } from 'vuex-module-decorators'

export interface MutationDecoratorParams {
    name?: string
}

export function Mutation<T, R>(
    target: T,
    key: string | symbol,
    descriptor: TypedPropertyDescriptor<(...args: any[]) => R>
  ): void
export function Mutation<T>(
    params: MutationDecoratorParams
  ): MethodDecorator

export function Mutation<T, R>(
    targetOrParams: T | MutationDecoratorParams,
    key?: string | symbol,
    descriptor?: TypedPropertyDescriptor<(...args: any[]) => R>
) {
    if (!key && !descriptor) {
        const params: MutationDecoratorParams = targetOrParams || {}
        return function (target: Object, key: string | symbol, descriptor: TypedPropertyDescriptor<any>) {
            MutationDecorator(target, params.name || key, descriptor)
        }
    } 
    const target: T = targetOrParams as T
    MutationDecorator(target, key!, descriptor!);
}