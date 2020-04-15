declare module "gpg-promised" {
    export interface GPGUser {
        user_id: string
        name?: string
        email?: string
        username?: string
        domain?: string
        creation_date: string
    }
    export interface GPGRecord {
        type: string
    }
    export interface GenericKey extends GPGRecord {
        keyid: string
        key_cap: string
        key_length: string
        public_key_algo: string
        owner_trust: string
        validity: string
        creation_date: string
        expiry_date?: string
    }
    export interface MasterKey extends GenericKey {
        type: 'pub' | 'sec'
        uid: GPGUser | GPGUser[]
        sub: SubKey | SubKey[]
    }
    export interface SubKey extends GenericKey {
        type: 'sub' | 'ssb'
    }
    export interface PublicKey extends MasterKey {
        type: 'pub'
    }
    export interface PrivateKey extends MasterKey {
        type: 'sec'
    }
    export interface PublicSubKey extends SubKey {
        type: 'sub'
    }
    export interface PrivateSubKey extends SubKey {
        type: 'ssb'
    }
    export type GPGKey = PublicKey | PrivateKey | PublicSubKey | PrivateSubKey
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
    export class Parser {
        static parseColons(input: string): GPGRecord[]
    }
    export default class GpgPromised {
        static KeyChain: typeof KeyChain;
        static Parser: typeof Parser;
    }
}