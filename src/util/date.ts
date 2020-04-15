import { formatISO } from 'date-fns'

export function timestampToIsoDate(timestamp: number | string | undefined) {
    if (!timestamp) {
      return null
    }
    const seconds = typeof timestamp === 'string' ? parseInt(timestamp, 10) : timestamp
    return formatISO(new Date(seconds * 1000))
}