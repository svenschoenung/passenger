import fs from 'fs'
import util from 'util'
import path from 'path'
import { PasswordFile, PasswordFolder, PasswordNode } from '@/model/tree'

const stat = util.promisify(fs.stat)
const readdir = util.promisify(fs.readdir)
const readFile = util.promisify(fs.readFile)

export async function readPasswordTree(repoPath: string) {
    const repo = await stat(repoPath)
    if (!repo.isDirectory) {
        throw new Error('Repository path does not point to a directory')
    }
    const repoFolder: PasswordFolder = {
        folder: true,
        name: '',
        absPath: repoPath,
        relPath: path.relative(repoPath, repoPath),
        keys: [],
        children: []
    }
    return await readPasswordFolder(repoFolder)
}

async function readPasswordFolder(parent: PasswordFolder) {
    const files = await readdir(parent.absPath, { withFileTypes: true })
    const promises = files
      .filter(f => !isGitFile(f.name))
      .map(f => addPasswordNode(parent, f))
      .filter(f => f.folder || isKeysFile(f.name))
      .map(f => f.folder ? readPasswordFolder(f as PasswordFolder) : addKeys(parent, f))
    await Promise.all(promises) 
    return parent
}

function addPasswordNode(parent: PasswordFolder, dirent: fs.Dirent): PasswordFolder | PasswordFile {
    const isDirectory = dirent.isDirectory();
    const node: PasswordFolder | PasswordFile = {
        folder: isDirectory,
        name: dirent.name,
        absPath: path.join(parent.absPath, dirent.name),
        relPath: path.join(parent.relPath, dirent.name)
    }
    if (isDirectory) {
        const folder = node as PasswordFolder
        folder.children = []
        folder.keys = []
    } else {
        node.name = node.name.replace(/\.gpg$/, '')
    }
    if (!isKeysFile(node.name)) {
        parent.children.push(node)
    }
    return node
}

async function addKeys(parent: PasswordFolder, file: PasswordFile) {
    const contents = await readFile(file.absPath, { encoding: 'UTF-8' })
    const keys = contents.split('\n')
    keys.filter(key => !!key).forEach(key => parent.keys.push(key))
    return parent
}

function isKeysFile(name: string) {
    return (name === '.gpg-id')
}

function isGitFile(name: string) {
    return name.indexOf('.git') === 0
}