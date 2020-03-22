import { Notify, Dark } from 'quasar'
import unhandled from 'electron-unhandled'
import { openNewGitHubIssue, debugInfo } from 'electron-util'
import { ipcRenderer } from 'electron'

import { escapeHtml } from '@/util/html'
import icons from '@/ui/icons'

export function showErrorNotification(error: Error) {
    Notify.create({
        html: true,
        color: Dark.isActive ? 'dark' : 'white',
        textColor: Dark.isActive ? 'white' : 'black',
        icon: icons.error,
        message: `<b>Passenger experienced an internal error:</b><br><pre>${escapeHtml(error.message)}</pre>`,
        position: 'bottom-right',
        actions: [
           { label: 'Report', handler: () => {
              openNewGitHubIssue({
                  user: 'svenschoenung',
                  repo: 'passenger',
                  body: `\`\`\`\n${error.stack}\n\`\`\`\n\n---\n\n${debugInfo()}`
              });
           }},
           { label: 'close', handler: () => {} }
        ]
    })
}

unhandled({
  logger: error => {
    console.error(error)
    showErrorNotification(error)
  }
})

ipcRenderer.on('unhandled-error', (event, error: Error) => {
  showErrorNotification(error)
})