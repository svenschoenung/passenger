import path from 'path'
import { PasswordNode } from "@/model/passwords"

export function escapeHtml(char: string) {
    switch (char) {
      case '&': return '&amp;'
      case '<': return '&lt;'
      case '>': return '&gt;'
      case '"': return '&quot;'
      case "'": return '&#039;'
    }
    return char
}

export function highlight(item: PasswordNode) {
    const matches = item.annotations.matches
    if (matches && matches.length > 0) {
      let m = 0, match = matches[m]
      const highlighted = []
      for (let c = 0; c < item.fullName.length; c++) {
        if (match && c === match[0]) {
          highlighted.push('<b>')
        }
        highlighted.push(escapeHtml(item.fullName.charAt(c)))
        if (match && c === match[1]) {
          highlighted.push('</b>')
          match = matches[++m]
        }
      }
      return highlighted.join('')
    }
    return item.fullName
}

export function highlightTreeNode(node: PasswordNode) {
  const matches = node.annotations.matches
  if (matches && matches.length > 0) {
    let m = 0, match = matches[matches.length - 1]
    const highlighted = []
    for (let c = node.fullName.length - 1; c >= 0; c--) {
      if (match && c === match[1]) {
        highlighted.unshift('</b>')
      }
      if (c > 0 && node.fullName.charAt(c) === path.sep) {
        break;
      }
      highlighted.unshift(escapeHtml(node.fullName.charAt(c)))
      if (match && c === match[0]) {
        highlighted.unshift('<b>')
        match = matches[--m]
      }
    }
    return highlighted.join('')
  }
  return node.name
}