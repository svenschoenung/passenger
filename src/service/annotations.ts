import Vue from 'vue';
import { PrivateKey, PublicKey } from 'gpg-promised'

import { findMatchingKey, findUnknownPublicKeys } from '@/service/gpg';
import { PasswordFolder, PasswordNode } from '@/model/passwords'
import { PasswordFlags } from '@/store/modules/passwords'
import { PasswordKeysMap, AnnotationsState } from '@/store/modules/annotations';

export function annotateDecryptable<T extends PasswordNode>(node: T, privateKeys: PrivateKey[],
    inheritedDecryptable: boolean, 
    result: Pick<AnnotationsState, 'decryptable' | 'hasDecryptableChildren'>) {
    if (node.folder) {
        const folder = node as PasswordFolder
        const inheritsKeys = !folder.keys || folder.keys.length === 0
        const decryptable = inheritsKeys ?  inheritedDecryptable :
          folder.keys.some(key => findMatchingKey(key, privateKeys))

        let hasDecryptableChildren = false
        folder.children.forEach(child => {
            if (annotateDecryptable(child, privateKeys, decryptable, result)) {
                hasDecryptableChildren = true
            }
        })

        Vue.set(result.decryptable, folder.relPath, decryptable)
        Vue.set(result.hasDecryptableChildren, folder.relPath, hasDecryptableChildren)
        return hasDecryptableChildren
    } else {
        Vue.set(result.decryptable, node.relPath, inheritedDecryptable)
        Vue.set(result.hasDecryptableChildren, node.relPath, false)
        return inheritedDecryptable
    }
}

export function annotateIntendedKeys<T extends PasswordNode>(node: T, 
    inheritedKeys: string[], result: Pick<AnnotationsState, 'intendedKeys'>) {
    if (node.folder) {
        const folder = node as PasswordFolder
        const inheritsKeys = !folder.keys || folder.keys.length === 0
        const keys = inheritsKeys ? inheritedKeys : folder.keys

        folder.children.forEach(child => annotateIntendedKeys(child, keys, result))

        Vue.set(result.intendedKeys, folder.relPath, keys)
    } else {
        Vue.set(result.intendedKeys, node.relPath, inheritedKeys)
    }
}

export function annotateToBeEncryptedWithUnknownKeys<T extends PasswordNode>(
    node: T, publicKeys: PublicKey[], inheritedUnknownKeys: string[],
    toBeEncryptedWithUnknownKeysResult: PasswordKeysMap) {
    if (node.folder) {
        const folder = node as PasswordFolder
        const unknownKeys = folder.keys && folder.keys.length > 0 ? 
          findUnknownPublicKeys(folder.keys, publicKeys).map(key => key.keyid) : inheritedUnknownKeys
        if (unknownKeys.length > 0) {
            Vue.set(toBeEncryptedWithUnknownKeysResult, folder.relPath, unknownKeys)
        }
        folder.children.forEach(child => annotateToBeEncryptedWithUnknownKeys(child, publicKeys, unknownKeys, toBeEncryptedWithUnknownKeysResult))
  } else {
      if (inheritedUnknownKeys.length > 0) {
        Vue.set(toBeEncryptedWithUnknownKeysResult, node.relPath, inheritedUnknownKeys)
      }
  }
}
