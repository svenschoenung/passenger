import async from 'async'

export async function asyncPool<T, R>(items: T[], poolSize: number, fn: (item: T) => Promise<R>): Promise<R[]> {
    const result: R[] = []
    await async.eachLimit(items, 20, async (item, cb) => {
        try {
            result.push(await fn(item))
            cb()
        } catch (e) {
            cb(e)
        }
    })
    return result
}