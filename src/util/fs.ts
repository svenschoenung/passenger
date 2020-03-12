import util from 'util'
import fs from 'fs'
import os from 'os'
import path from 'path'

export const stat = util.promisify(fs.stat)
export const readdir = util.promisify(fs.readdir)
export const readFile = util.promisify(fs.readFile)

export function tildify(absPath: string) {
    const homedir = os.homedir();
    if (absPath.startsWith(homedir)) {
        return path.join('~', absPath.substring(homedir.length))
    }
    return absPath
}

export function untildify(absPath: string) {
    if (absPath.startsWith('~/')) {
        return path.join(os.homedir(), absPath.substring(2))
    }
    return absPath;
}