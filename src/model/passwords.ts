import path from 'path'

import { PasswordsModule } from '@/store';

export type SearchMatches = [number, number][]

export interface PasswordObj {
    name: string
    fullName: string
    absPath: string
    relPath: string
    annotations: {
        matches?: SearchMatches,
    }
}

export interface PasswordFolder extends PasswordObj {
    folder: true
    keys: string[]
    children: PasswordNode[]
}

export interface PasswordFile extends PasswordObj {
    folder: false
}

export type PasswordNode = PasswordFolder | PasswordFile

export function depth(node: PasswordNode) {
    if (node.relPath === '.') {
        return 0
    }
    return (node.relPath.match(/\//g) || []).length + 1
}

export function traverseTree(node: PasswordNode, visit: (n: PasswordNode, depth: number) => {skipChildren: boolean} | void, depth: number = 0) {
    const result = visit(node, depth);
    if (!(result && result.skipChildren) && node.folder) {
        node.children.forEach(child => traverseTree(child, visit, depth! + 1))
    }
}

export function getParent(relPath: string): PasswordFolder | null {
    if (relPath === '.') {
        return null
    }
    const map = PasswordsModule.map.value
    if (map) {
        return map[path.dirname(relPath)] as PasswordFolder
    }
    return null
}

export function getParents(relPath: string): PasswordFolder[] {
    const parentNodes: PasswordFolder[] = []
    let parentNode: PasswordFolder | null = null
    do {
        parentNode = getParent(relPath)
        if (parentNode) {
            parentNodes.unshift(parentNode)
            relPath = parentNode.relPath
        }
    } while (parentNode)
    return parentNodes
}

export function traverseParents(relPath: string, visit: (folder: PasswordFolder) => { break: boolean } | void) {
    let parentNode: PasswordFolder | null = null
    do {
        parentNode = getParent(relPath)
        if (parentNode) {
            const result = visit(parentNode)
            if (result && result.break) {
                return
            } 
            relPath = parentNode.relPath
        }
    } while (parentNode)
}