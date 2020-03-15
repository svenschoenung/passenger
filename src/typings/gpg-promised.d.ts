declare module "gpg-promised" {
    export interface GPGUser {
        name: string
        email: string
        user_id: string
    }
    export interface GenericKey {
        type: 'pub' | 'sec'
        keyid: string
        uid: GPGUser | GPGUser[]
    }
    export interface PublicKey extends GenericKey {
        type: 'pub'
    }
    export interface PrivateKey extends GenericKey {
        type: 'sec'
    }
    export type GPGKey = PublicKey | PrivateKey
    export interface ExecResult {
        stdout: string
        stdin: string
    }
    export class KeyChain {
        constructor(homedir?: string)
        open(): Promise<void>
        listPublicKeys(ultimate?: boolean, keyId?: string): Promise<PublicKey[]>
        listSecretKeys(ultimate?: boolean, keyId?: string): Promise<PrivateKey[]>
        decrypt(input: string | Buffer | null, options?: { from?: string[] }): Promise<Buffer>
        call(input: string | Buffer | null, args: string[], batch: boolean): Promise<ExecResult>
    }
    export default class GpgPromised {
        static KeyChain: typeof KeyChain;
    }
}