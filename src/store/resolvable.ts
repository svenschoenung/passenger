export interface Resolvable<T> {
    success: boolean,
    resolving: boolean,
    error: Error | null,
    value: T | null
}

export function unresolved<T>(): Resolvable<T> {
    return { success: false, resolving: false, error: null, value: null }
}
export function resolving<T>(value?: T): Resolvable<T> {
    return { success: false, resolving: true, error: null, value: value || null }
}
export function resolved<T>(value: T): Resolvable<T> {
    return { success: true, resolving: false, error: null, value: value }
}
export function failed<T>(error: Error): Resolvable<T> {
    return { success: false, resolving: false, error, value: null }
}
export function resolvable<T, R>(resolvable: Resolvable<T>, value?: R): Resolvable<R> {
    return { ...resolvable, value: value || null } 
}