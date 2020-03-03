import fs from 'fs'
import { stat } from '@/util/promisified/fs'

export type ValidationResult = { valid: true } | { valid: false, error: string } 

export type FolderValidator = (path: string) => Promise<ValidationResult>

export async function validateFolder(path: string): Promise<ValidationResult> {
    let repoStats: fs.Stats | null;
    try {
        repoStats = await stat(path)
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