import async from 'async'
import os from 'os'

export type AsyncFn<T, R> = (item: T) => Promise<R>

export async function asyncPool<T, R>(items: T[], fn: AsyncFn<T, R>): Promise<R[]>;
export async function asyncPool<T, R>(items: T[], poolSize: number, fn: AsyncFn<T, R>): Promise<R[]>;
export async function asyncPool<T, R>(items: T[], poolSizeOrFn: number | AsyncFn<T, R>, fn?: AsyncFn<T, R>): Promise<R[]> {

    let poolSize: number
    let asyncFn: AsyncFn<T, R>
    if (fn) {
        poolSize = poolSizeOrFn as number
        asyncFn = fn
    } else {
        poolSize = os.cpus().length
        asyncFn = poolSizeOrFn as AsyncFn<T, R>
    }

    const result: R[] = []
    await async.eachLimit(items, 20, async (item, cb) => {
        try {
            result.push(await asyncFn(item))
            cb()
        } catch (e) {
            cb(e)
        }
    })
    return result
}