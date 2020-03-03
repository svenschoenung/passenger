import { ValidationResult, validateFolder } from '@/model/validation';
import gpg, { GenericKey } from 'gpg-promised'

export async function validateGPGHomedir(gpgPath: string): Promise<ValidationResult> {
    return await validateFolder(gpgPath)
}

export async function loadPrivateKeys(gpgPath: string) {
    const keychain = new gpg.KeyChain(gpgPath) 
    await keychain.open()
    return keychain.listSecretKeys()
}

export async function loadPublicKeys(gpgPath: string) {
    const keychain = new gpg.KeyChain(gpgPath) 
    await keychain.open()
    return keychain.listPublicKeys()
}

export function findMatchingKey<T extends GenericKey>(needle: string, haystack: T[]) {
    return haystack.find(hay => {
        if (hay.keyid === needle) {
            return true
        }
        if (Array.isArray(hay.uid)) {
            return hay.uid.find(uid => uid.email === needle)
        }
        if (hay.uid) {
            return hay.uid.email === needle
        }
        return false
    })
}
