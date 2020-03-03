import util from 'util'
import fs from 'fs'

export const stat = util.promisify(fs.stat)
export const readdir = util.promisify(fs.readdir)
export const readFile = util.promisify(fs.readFile)