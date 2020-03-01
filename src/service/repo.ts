import fs from 'fs'
import util from 'util'

const stat = util.promisify(fs.stat)

export async function validateRepository(repoPath: string) {
    let repoStats: fs.Stats | null;
    try {
        repoStats = await stat(repoPath)
    } catch (e) {
        repoStats = null;
    }
    if (!repoStats) {
        throw new Error('Path does not exist')
    }
    if (!repoStats.isDirectory()) {
        throw new Error('Path is not a directory')
    }
    return true
}