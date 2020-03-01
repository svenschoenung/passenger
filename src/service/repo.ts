import fs from 'fs'
import util from 'util'

export type RepositoryValidationResult = { valid: true } | { valid: false, error: string } 

const stat = util.promisify(fs.stat)

export async function validateRepository(repoPath: string): Promise<RepositoryValidationResult> {
    let repoStats: fs.Stats | null;
    try {
        repoStats = await stat(repoPath)
    } catch (e) {
        repoStats = null;
    }
    if (!repoStats) {
        return { valid: false, error: 'Path does not exist'}
    }
    if (!repoStats.isDirectory()) {
        return { valid: false, error: 'Path is not a directory'}
    }
    return { valid: true }
}