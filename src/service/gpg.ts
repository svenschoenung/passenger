import gpg, { GenericKey, GPGUser, PublicKey, PrivateKey, SubKey } from 'gpg-promised'
import { spawn } from 'child_process';
import { ValidationResult, validateFolder } from '@/model/validation';
import { once } from 'lodash'

export interface UnknownPublicKey extends PublicKey {
    unknown: true
}

export interface GPGOptions {
    homedir?: string | null,
}

function runGpg(opts: { args: string[], ignoreError?: boolean } & GPGOptions): Promise<string>{
    return new Promise((resolve, reject) => {
        let args = opts.args
        if (opts.homedir) {
            args = ['--homedir', opts.homedir, ...args]
        }

        let stdout = ''
        let stderr = ''

        const rejectOnce: ((reason: Error) => void) = once(reject)
        const handleExit = (code: number) => {
            if (code > 0 && !opts.ignoreError) {
                if (stderr) {
                    rejectOnce(new Error(stderr))
                } else {
                    rejectOnce(new Error(`GPG exited with code ${code}`))
                }
            } else {
                resolve(stdout)
            }
        }

        const gpgProcess = spawn('gpg', args);

        gpgProcess.stdout.on('data', data => {
           stdout += data.toString()
        })
        gpgProcess.stderr.on('data', data => {
           stderr += data.toString()
        })
        gpgProcess.on('error', error => {
            rejectOnce(error)
        })
        gpgProcess.on('exit', (code: number) => {
            handleExit(code)
        })
        gpgProcess.on('close', (code: number) => {
            handleExit(code)
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
    if (!key.uid) {
        key.uid = []
    } else if (!Array.isArray(key.uid)) {
        key.uid = [key.uid]
    }
    if (!key.sub) {
        key.sub = []
    } else if (!Array.isArray(key.sub)) {
        key.sub = [key.sub]
    }
    return key
}

export function findMatchingKey<T extends GenericKey>(needle: string, haystack: T[]) {
    return (haystack || []).find(hay => {
        if (hay.keyid === needle) {
            return true
        }
        const matchingUid = (hay.uid as GPGUser[]).find(uid => uid.email === needle) 
        if (matchingUid) {
            return true
        }
        const matchingSub = (hay.sub as SubKey[]).find(sub => sub.keyid === needle)  
        if (matchingSub) {
            return true
        }
        return false
    })
}

export function unknown(key: string): UnknownPublicKey {
    return {
      keyid: key,
      uid: [{ user_id: 'Unknown key' }],
      unknown: true
    } as UnknownPublicKey
}

export function findMatchingPublicKeys(keys: string[], publicKeys: PublicKey[]): PublicKey[] {
    const matchingPublicKeys = keys
      .map(key => findMatchingKey(key, publicKeys) || key)
      .map(key => typeof key === 'string' ? unknown(key) : key)
    return matchingPublicKeys
}

export function isUnknownKey(key: string, publicKeys: PublicKey[]): boolean {
    return !!findMatchingKey(key, publicKeys)
}

export function findUnknownPublicKeys(keys: string[], publicKeys: PublicKey[]): UnknownPublicKey[] {
    return findMatchingPublicKeys(keys, publicKeys)
      .filter(key => (key as any).unknown) as UnknownPublicKey[]
}

export async function decryptPasswordFile(absPath: string, opts?: GPGOptions) {
    const output = await runGpg({ ...opts, args: ['--decrypt', absPath] });
    return output.trimEnd()
}

export async function listUsedKeys(absPath: string, opts?: GPGOptions) {
    const output = await runGpg({
        ...opts,
        args: ['--list-packets', '--pinentry-mode=cancel', absPath],
        ignoreError: true
    });
    return output.split(/\n/g)
      .filter(line => line.match(/keyid/))
      .map(line => line.replace(/.*keyid\s+([A-Z0-9]+).*/, '$1'))
}