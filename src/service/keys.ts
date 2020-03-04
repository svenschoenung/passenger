import { ValidationResult, validateFolder } from '@/model/validation';
import gpg, { GenericKey, GPGUser } from 'gpg-promised'

export async function validateGPGHomedir(gpgPath: string): Promise<ValidationResult> {
    return await validateFolder(gpgPath)
}

export async function loadPrivateKeys(gpgPath: string) {
    const keychain = new gpg.KeyChain(gpgPath) 
    await keychain.open()
    return (await keychain.listSecretKeys()).map(normalizeKey)
}

export async function loadPublicKeys(gpgPath: string) {
    const keychain = new gpg.KeyChain(gpgPath) 
    await keychain.open()
    return (await keychain.listPublicKeys()).map(normalizeKey)
}

export function normalizeKey(key: GenericKey) {
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
    return haystack.find(hay => {
        if (hay.keyid === needle) {
            return true
        }
        return (hay.uid as GPGUser[]).find(uid => uid.email === needle)
    })
}
