import fs from 'fs'
import { stat, untildify } from '@/util/fs'
import { is } from 'electron-util'
import modeToPermissions from 'mode-to-permissions'

export type ValidationResult = { valid: true } | { valid: false, error: string } 

export type PathValidator = (path: string) => Promise<ValidationResult>

export async function validateFolder(path: string): Promise<ValidationResult> {
    let folderStats: fs.Stats | null;
    try {
        folderStats = await stat(untildify(path))
    } catch (e) {
        folderStats = null;
    }
    if (!folderStats) {
        return { valid: false, error: 'Path does not exist'}
    }
    if (!folderStats.isDirectory()) {
        return { valid: false, error: 'Path is not a directory'}
    }
    return { valid: true }
}

export async function validateExecutable(path: string): Promise<ValidationResult> {
    let fileStats: fs.Stats | null;
    try {
        fileStats = await stat(untildify(path))
    } catch (e) {
        fileStats = null;
    } 
    if (!fileStats) {
        return { valid: false, error: 'Path does not exist'}
    }
    if (!fileStats.isFile()) {
        return { valid: false, error: 'Path is not a file'}
    }
    if (is.windows && !path.endsWith('.exe')) {
        return { valid: false, error: 'File is not an executable'}
    }
    if (!is.windows && !modeToPermissions(fileStats.mode).execute.others) {
        return { valid: false, error: 'File is not an executable'}
    }
    return { valid: true }
}