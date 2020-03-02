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

export type DoNothing = null
export type DeleteNode = { node: null } 
export type ReplaceNode = { node: PasswordNode, skipChildren?: boolean } 
export type NodeVisitResult = DoNothing | DeleteNode | ReplaceNode

export function traverseTree(node: PasswordNode, visit: (n: PasswordNode) => NodeVisitResult) {
    const result = visit(node);
    if (!result) {
        return node
    }
    if (!result.node) {
        return null
    }
    const newNode = result.node
    if (newNode.folder && !result.skipChildren) {
        newNode.children = newNode.children
          .map(child => traverseTree(child, visit))
          .filter(child => child !== null) as PasswordNode[]
    }
    return newNode
}