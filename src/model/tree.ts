export interface PasswordNode {
    folder: boolean
    name: string
    absPath: string
    relPath: string
}

export interface PasswordFolder extends PasswordNode {
    keys: string[]
    children: PasswordNode[]
}

export interface PasswordFile extends PasswordNode {
    contents?: string
}
