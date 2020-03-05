export interface PasswordFolder {
    folder: true
    name: string
    absPath: string
    relPath: string
    keys: string[]
    children: PasswordNode[]
    [key: string]: any
}

export interface PasswordFile {
    folder: false
    name: string
    absPath: string
    relPath: string
    contents?: string
    [key: string]: any
}

export type PasswordNode = PasswordFolder | PasswordFile

export function traverseTree(node: PasswordNode, visit: (n: PasswordNode) => void) {
    visit(node);
    if (node.folder) {
        node.children.forEach(child => traverseTree(child, visit))
    }
}