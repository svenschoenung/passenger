import Vue from 'vue';
import { PrivateKey, PublicKey } from 'gpg-promised'

import { findMatchingKey } from '@/service/gpg';
import { PasswordFolder, PasswordNode } from '@/model/passwords'
import { PasswordFlags } from '@/store/modules/passwords'

export function annotateDecryptable<T extends PasswordNode>(
    node: T, privateKeys: PrivateKey[], inheritedDecryptable: boolean,
    decryptableFlags: PasswordFlags, decryptableChildrenFlags: PasswordFlags) {
    if (node.folder) {
        const folder = node as PasswordFolder
        const decryptable = folder.keys && folder.keys.length > 0 ? 
          folder.keys.some(key => findMatchingKey(key, privateKeys)) : inheritedDecryptable
        let decryptableChildren = false
        folder.children.forEach(child => {
            if (annotateDecryptable(child, privateKeys, decryptable, decryptableFlags, decryptableChildrenFlags)) {
                decryptableChildren = true
            }
        })

        Vue.set(decryptableFlags, folder.relPath, decryptable)
        Vue.set(decryptableChildrenFlags, folder.relPath, decryptableChildren)
        return decryptableChildren
    } else {
        Vue.set(decryptableFlags, node.relPath, inheritedDecryptable)
        Vue.set(decryptableChildrenFlags, node.relPath, false)
        return inheritedDecryptable
    }
}

export function annotateNotEncryptable<T extends PasswordNode>(
    node: T, publicKeys: PublicKey[], inhertedNotEncryptable: boolean,
    notEncryptableFlags: PasswordFlags) {
    if (node.folder) {
        const folder = node as PasswordFolder
        const notEncryptable = folder.keys && folder.keys.length > 0 ? 
          !!folder.keys.find(key => !findMatchingKey(key, publicKeys)) : inhertedNotEncryptable
        Vue.set(notEncryptableFlags, folder.relPath, notEncryptable)
        folder.children.forEach(child => annotateNotEncryptable(child, publicKeys, notEncryptable, notEncryptableFlags))
  } else {
        Vue.set(notEncryptableFlags, node.relPath, inhertedNotEncryptable)
  }
}
