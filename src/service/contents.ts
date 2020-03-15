export type PasswordFieldType = 'text' | 'key-value'
export type PasswordContentsType = 'text' | 'key-value'

export interface PasswordField  {
    key: string
    value: string
}

export interface PasswordContents {
    type: PasswordContentsType
    password: string
}

export interface PasswordTextContents extends PasswordContents {
    type: 'text'
    text: string
}

export interface PasswordKeyValueContents extends PasswordContents {
    type: 'key-value'
    fields: PasswordField[]
}


export function parseTextContents(contents: string): PasswordTextContents {
    const lines = contents.split('\n')
    if (lines.length === 0) {
        return { type: 'text', password: '', text: '' }
    }
    const passwordContents: PasswordTextContents = {
        type: 'text',
        password: lines.shift() as string,
        text: lines.join('\n')
    }
    return passwordContents
}

export function parseKeyValueContents(contents: string): PasswordKeyValueContents {
    const lines = contents.split('\n')
    if (lines.length === 0) {
        return { type: 'key-value', password: '', fields: [] }
    }
    const passwordContents: PasswordKeyValueContents = {
        type: 'key-value',
        password: lines.shift() as string,
        fields: []
    }
    let key: string = ''
    let value: string[] = []
    lines.forEach(line => {
        const keyValueMatch = line.match(/^([^ ]+?):\s*(.*)/)
        if (keyValueMatch) {
            if (value.length) {
                passwordContents.fields.push({ key, value: value.join('\n') })
                value = []
            }
            key = keyValueMatch[1]
            value.push(keyValueMatch[2])
        } else {
            value.push(line)
        }
    })
    if (value.length) {
        passwordContents.fields.push({ key, value: value.join('\n') })
    }
    return passwordContents
}

export function serializeTextContents(contents: PasswordTextContents) {
    return `${contents.password}\n${contents.text}`.trimEnd()
}

export function serializeKeyValueContents(contents: PasswordKeyValueContents) {
    const fields = contents.fields.map(field => (field.key ? `${field.key}: ` : '') + field.value).join('\n')
    return `${contents.password}\n${fields}`.trimEnd()
}