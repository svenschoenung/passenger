import { ValidationResult, validateFolder } from '@/model/validation';
import gpg, { GenericKey, GPGUser, PublicKey } from 'gpg-promised'

export interface MissingPublicKey extends PublicKey {
    missing: true
}

export async function validateGPGHomedir(gpgPath: string): Promise<ValidationResult> {
    return await validateFolder(gpgPath)
}

export async function loadPrivateKeys(gpgPath: string) {
    const folder = await validateFolder(gpgPath)
    if (!folder.valid) {
        throw new Error(folder.error)
    }
    const keychain = new gpg.KeyChain(gpgPath) 
    await keychain.open()
    return (await keychain.listSecretKeys()).map(normalizeKey)
}

export async function loadPublicKeys(gpgPath: string) {
    const folder = await validateFolder(gpgPath)
    if (!folder.valid) {
        throw new Error(folder.error)
    } 
    const keychain = new gpg.KeyChain(gpgPath) 
    await keychain.open()
    return (await keychain.listPublicKeys()).map(normalizeKey)
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

export async function decryptPasswordFile(gpgPath: string, absPath: string) {
    const keychain = new gpg.KeyChain(gpgPath)
    await keychain.open()
    return (await keychain.call(null, ['--decrypt', absPath], false)).stdout.toString().trimEnd()
}