import { UIModule, SettingsModule } from '@/store';
import { clipboard } from 'electron'
import bcrypt from 'bcrypt'

let previousClipboardText: string | null = null
let passwordSalt: string | null = null
let passwordHash: string | null = null

export async function copyToClipboard(text: string, password: boolean) {
    await removePasswordFromClipboard()
    if (password && SettingsModule.enablePasswordInClipboardTimeout) {
        previousClipboardText = clipboard.readText()
        clipboard.writeText(text)
        passwordSalt = await bcrypt.genSalt(10)
        passwordHash = await bcrypt.hash(text, passwordSalt)
        UIModule.startPasswordInClipboardCountdown()
    } else {
        clipboard.writeText(text)
    }
}

export async function removePasswordFromClipboard(sync: boolean = false) {
    if (!passwordHash || !passwordSalt) {
        UIModule.stopPasswordInClipboardCountdown()
        return
    }
    const clipboardHash = sync ? bcrypt.hashSync(clipboard.readText(), passwordSalt) : 
      await bcrypt.hash(clipboard.readText(), passwordSalt)
    if (passwordHash === clipboardHash) {
        clipboard.writeText(previousClipboardText || '')
    }
    previousClipboardText = null
    passwordHash = null
    passwordSalt = null
    UIModule.stopPasswordInClipboardCountdown()
}

export function removePasswordFromClipboardSync() {
    removePasswordFromClipboard(true)
}

