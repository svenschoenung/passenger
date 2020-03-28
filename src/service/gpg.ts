import gpg, { GenericKey, GPGUser, PublicKey, GpgParse, PrivateKey } from 'gpg-promised'
import { spawn } from 'child_process';
import { ValidationResult, validateFolder } from '@/model/validation';
import once from 'once'
import { openSystemPreferences } from 'electron-util';

export interface MissingPublicKey extends PublicKey {
    missing: true
}

export interface GPGOptions {
    homedir?: string | null,
}

function runGpg(opts: { args: string[] } & GPGOptions): Promise<string>{
    return new Promise((resolve, reject) => {
        let args = opts.args
        if (opts.homedir) {
            args = ['--homedir', opts.homedir, ...args]
        }

        let output = ''
        const rejectOnce: ((reason: Error) => void) = once(reject)
        const gpgProcess = spawn('gpg', args);

        gpgProcess.stdout.on('data', data => {
           output += data.toString()
        })
        gpgProcess.stdout.on('error', error => {
            rejectOnce(error)
        })
        gpgProcess.stdout.on('exit', (code: number) => {
            if (code > 0) {
                rejectOnce(new Error(`GPG exited with ${code}`))
            } else {
                resolve(output)
            }
        })
        gpgProcess.stdout.on('close', (code: number) => {
            if (code > 0) {
                rejectOnce(new Error(`GPG exited with ${code}`))
            } else {
                resolve(output)
            }
        })
    })
}



export async function validateGPGHomedir(gpgPath: string): Promise<ValidationResult> {
    return await validateFolder(gpgPath)
}

export async function loadPrivateKeys(opts: GPGOptions) {
    const output = await runGpg({ ...opts, args: ['--list-secret-keys', '--with-colons', '--with-fingerprint']});
    return gpg.Parser.parseColons(output)
      .filter(rec => rec.type === 'sec')
      .map(rec => normalizeKey(rec as PrivateKey))
}

export async function loadPublicKeys(opts: GPGOptions) {
    const output = await runGpg({ ...opts, args: ['--list-public-keys', '--with-colons', '--with-fingerprint'] });
    return gpg.Parser.parseColons(output)
      .filter(rec => rec.type === 'pub')
      .map(rec => normalizeKey(rec as PublicKey))
}

export function normalizeKey<T extends GenericKey>(key: T): T {
    if (Array.isArray(key.uid)) {
        return key
    }
    if (!key.uid) {
        key.uid = []
    } else {
        key.uid = [key.uid]
    }
    return key
}

export function findMatchingKey<T extends GenericKey>(needle: string, haystack: T[]) {
    return (haystack || []).find(hay => {
        if (hay.keyid === needle) {
            return true
        }
        return (hay.uid as GPGUser[]).find(uid => uid.email === needle)
    })
}

export function missing(key: string): MissingPublicKey {
    return {
      keyid: key,
      uid: [{ user_id: 'Missing' }],
      missing: true
    } as MissingPublicKey
}

export function findMatchingPublicKeys(keys: string[], publicKeys: PublicKey[]): PublicKey[] {
    const matchingPublicKeys = keys
      .map(key => findMatchingKey(key, publicKeys) || key)
      .map(key => typeof key === 'string' ? missing(key) : key)
    return matchingPublicKeys
}

export function findMissingPublicKeys(keys: string[], publicKeys: PublicKey[]): MissingPublicKey[] {
    return findMatchingPublicKeys(keys, publicKeys)
      .filter(key => (key as any).missing) as MissingPublicKey[]
}

export async function decryptPasswordFile(absPath: string, opts: GPGOptions) {
    const output = await runGpg({ ...opts, args: ['--decrypt', absPath] });
    return output.trimEnd()
}