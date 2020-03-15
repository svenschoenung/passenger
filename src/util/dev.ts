function delayInMs() {
    // if (process.env.NODE_ENV === 'development') {
    //     return Math.random() * 3000 + 2000
    // } 
    return 0
}

export const sleep = (ms: number) => new Promise(resolve => {
    setTimeout(() => {
        resolve()
    }, ms)
})

export async function delay<T>(fn: () => Promise<T>, ms?: number): Promise<T> {
    if (ms === undefined) {
        ms = delayInMs()
    }
    if (ms > 0) {
        await sleep(ms)
        return fn()
    }
    return fn()
}