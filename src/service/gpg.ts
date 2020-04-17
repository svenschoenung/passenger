import { SettingsModule } from './../store/index';
import gpg, { GenericKey, GPGUser, PublicKey, PrivateKey, SubKey, GPGKey, MasterKey } from 'gpg-promised'
import { ValidationResult, validateFolder } from '@/model/validation';
import { spawn } from 'child-process-promise'

/* https://tools.ietf.org/html/rfc4880#section-9.1 */
export const PublicKeyAlgo = {
    1: "RSA (Encrypt/Sign)",
    2: "RSA (Encrypt-Only)",
    3: "RSA (Sign-Only)",
    16: "Elgamal (Encrypt-Only)",
    17: "DSA",
    18: "Elliptic Curve",
    19: "ECDSA",
    20: "Elgamal (Encrypt/Sign)",
    21: "Diffie-Hellman (X9.42)",
    100: "Private/Experimental algorithm",
    101: "Private/Experimental algorithm",
    102: "Private/Experimental algorithm",
    103: "Private/Experimental algorithm",
    104: "Private/Experimental algorithm",
    105: "Private/Experimental algorithm",
    106: "Private/Experimental algorithm",
    107: "Private/Experimental algorithm",
    108: "Private/Experimental algorithm",
    109: "Private/Experimental algorithm",
    110: "Private/Experimental algorithm"
};

/* https://github.com/gpg/gnupg/blob/master/doc/DETAILS#field-2---validity */
export const Validities = {
    o: 'Unknown',
    i: 'Invalid', 
    d: 'Disabled', 
    r: 'Revoked',
    e: 'Expired',
    '-': 'Unknown',
    q: 'Undefined',
    n: 'Not valid',
    m: 'Marginally valid',
    f: 'Fully valid',
    u: 'Ultimately valid',
    w: 'Well known private part',
    s: 'Special validity'
}

/* https://www.gnupg.org/documentation/manuals/gnupg/Trust-Values.html */
export const OwnerTrust = {
    '-': 'Unknown',
    e: 'Expired',
    q: 'Undefined',
    n: 'Never trusted',
    m: 'Marginally trusted',
    f: 'Fully trusted',
    u: 'Ultimately trusted',
    r: 'Revoked',
    '?': 'Unknown trust value',
}

export interface UnknownKey<T extends GenericKey> extends MasterKey {
    unknown: true
}

export interface GPGOptions {
    homedir?: string | null,
    stdin?: string
}

async function runGpg(opts: { args: string[], ignoreError?: boolean } & GPGOptions): Promise<string>{
    let args = opts.args
    if (opts.homedir) {
        args = ['--homedir', opts.homedir, ...args]
    }
    args = ['--batch', ...args]

    try {
        const gpgProcess = spawn(SettingsModule.gpgBinaryPath || 'gpg', args, { capture: [ 'stdout', 'stderr' ]})
        if (opts.stdin) {
            console.log(opts.stdin)
            gpgProcess.childProcess.stdin?.write(opts.stdin)
            gpgProcess.childProcess.stdin?.end()
        }
        const gpgResult = await gpgProcess
        return gpgResult.stdout;
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

export async function loadPublicKeys(opts: { keys?: string[] } & GPGOptions) {
    const output = await runGpg({ ...opts, args: [
        '--list-public-keys', '--with-colons', '--with-fingerprint', ...(opts.keys || [])
    ]});
    return gpg.Parser.parseColons(output)
      .filter(rec => rec.type === 'pub')
      .map(rec => normalizeKey(rec as PublicKey))
}

export async function exportArmoredKey(keyid: string, opts: { secret: boolean } & GPGOptions) {
    return await runGpg({ ...opts, args: [
        opts.secret ? '--export-secret-keys' : '--export' , '--armor', keyid
    ] });
}

export async function importArmoredKey(armoredKey: string, opts: GPGOptions) {
    return await runGpg({ stdin: armoredKey, ...opts, args: ['--import' ] });
}

export async function importKey(keyPath: string, opts: GPGOptions) {
    return await runGpg({ ...opts, args: ['--import', keyPath ] });
}

export function normalizeKey<T extends MasterKey>(key: T): T {
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

export function findMatchingKey<T extends MasterKey>(needle: string, haystack: T[], type: T['type']) {
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

export function unknownKey<T extends MasterKey>(key: string, type: T['type']): UnknownKey<T> {
    return {
      type,
      keyid: key,
      uid: [{ user_id: 'Unknown key' }] as GPGUser[],
      sub: [],
      key_cap: '',
      key_length: '',
      public_key_algo: '',
      owner_trust: '',
      validity: '',
      creation_date: '',
      unknown: true,
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

export function hasMatchingPrivateKey(key: string, publicKeys: PrivateKey[]): boolean {
    return !(findMatchingKey(key, publicKeys, 'sec') as any).unknown
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

export async function deletePublicKey(key: PublicKey, opts?: GPGOptions) {
    await runGpg({
        ...opts,
        args: ['--delete-key', '--yes', key.keyid],
    }); 
}

export class KeyFinder<T extends MasterKey> {
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