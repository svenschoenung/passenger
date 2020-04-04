import gpg, { GenericKey, GPGUser, PublicKey, PrivateKey, SubKey, GPGKey } from 'gpg-promised'
//import { spawn } from 'child_process';
import { ValidationResult, validateFolder } from '@/model/validation';
import { once } from 'lodash'
import { spawn } from 'child-process-promise'

export interface UnknownKey<T extends GenericKey> extends GenericKey {
    unknown: true
}

export interface GPGOptions {
    homedir?: string | null,
}

async function runGpg(opts: { args: string[], ignoreError?: boolean } & GPGOptions): Promise<string>{
    let args = opts.args
    if (opts.homedir) {
        args = ['--homedir', opts.homedir, ...args]
    }

    try {
        const gpgProcess = await spawn('gpg', args, { capture: [ 'stdout', 'stderr' ]})
        return gpgProcess.stdout;
    } catch (e) {
        if (opts.ignoreError) {
            return e.stdout
        }
        throw e
    }
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

export function findMatchingKey<T extends GenericKey>(needle: string, haystack: T[], type: T['type']) {
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
    }) || unknownKey(needle, type)
}

export function unknownKey<T extends GenericKey>(key: string, type: T['type']): UnknownKey<T> {
    return {
      type,
      keyid: key,
      uid: [{ user_id: 'Unknown key' }] as GPGUser[],
      sub: [],
      unknown: true
    }
}

export function findMatchingPublicKeys(keys: string[], publicKeys: PublicKey[]): (PublicKey | UnknownKey<PublicKey>)[] {
    return keys.map(key => findMatchingKey(key, publicKeys, 'pub'))
}

export function isUnknownKey(key: string, publicKeys: PublicKey[]): boolean {
    return !!(findMatchingKey(key, publicKeys, 'pub') as any).unknown
}

export function findUnknownPublicKeys(keys: string[], publicKeys: PublicKey[]): UnknownKey<PublicKey>[] {
    return findMatchingPublicKeys(keys, publicKeys)
      .filter(key => (key as any).unknown) as UnknownKey<PublicKey>[]
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
    const k = output.split(/\n/g)
      .filter(line => line.match(/keyid/))
      .map(line => line.replace(/.*keyid\s+([A-Z0-9]+).*/, '$1'))
      if (k.length === 0) {
          console.log('output', output)
      }
      return k
}

export class KeyFinder<T extends GenericKey> {
    private cache: { [key: string]: T | UnknownKey<T> } = {}

    constructor(private keys: T[], private type: T['type']) { }

    findMatchingKey(key: string) {
        if (!Object.prototype.hasOwnProperty.call(this.cache, key)) {
            this.cache[key] = findMatchingKey(key, this.keys, this.type)
        }
        return this.cache[key]
    }

    findMatchingKeyId(key: string) {
        const matchingKey = this.findMatchingKey(key);
        return matchingKey?.keyid
    }
}

export class PublicKeyFinder extends KeyFinder<PublicKey>  {
    constructor(keys: PublicKey[]) {
        super(keys, 'pub')
    }
}