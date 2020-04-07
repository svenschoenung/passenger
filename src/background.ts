'use strict'

import { app, protocol, screen, BrowserWindow } from 'electron'
import { createProtocol, installVueDevtools } from 'vue-cli-plugin-electron-builder/lib'
import Store from 'electron-store'
import unhandled from 'electron-unhandled';
import path from 'path'
import { get } from 'lodash'
import { darkMode } from 'electron-util'

unhandled({
  logger: error => {
    console.error(error)
    if (win) {
      win.webContents.send('unhandled-error', error)
    }
  }
})

const isDevelopment = process.env.NODE_ENV !== 'production'

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win: BrowserWindow | null = null;
let splash: BrowserWindow | null = null;

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{scheme: 'app', privileges: { secure: true, standard: true } }])

function loadState() {
  return new Store({ name: 'store' }).get('state');
}

function createSplash(state = loadState()) {
  const screenSize = screen.getPrimaryDisplay().workAreaSize
  const width = 400
  const height = 400

  splash = new BrowserWindow({
    title: 'Passenger',
    show: true,
    x: (screenSize.width - width) / 2,
    y: (screenSize.height - height) / 2, 
    width,
    height,
    resizable: false,
    frame: false,
    focusable: false,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: false
    }
  })

  let theme = get(state, 'settings.colorTheme')
  if (!theme || theme === 'system') {
    theme = darkMode.isEnabled ? 'dark' : 'light'
  }

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    splash.loadURL(path.join(process.env.WEBPACK_DEV_SERVER_URL, `splash_${theme}.html`))
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    splash.loadURL(`app://./splash_${theme}.html`)
  }
}

function createWindow(state = loadState()) {
  const [ minWidth, minHeight ] = [ 640, 480 ]
  const x = get(state, 'preferences.windowState.bounds.x')
  const y = get(state, 'preferences.windowState.bounds.y')
  let width = get(state, 'preferences.windowState.bounds.width')
  let height = get(state, 'preferences.windowState.bounds.height')

  if (!width || !height) {
    const screenSize = screen.getPrimaryDisplay().workAreaSize
    width = Math.round(Math.max(minWidth, screenSize.width * 0.8))
    height = Math.round(Math.max(minHeight, screenSize.height * 0.8))
  }

  win = new BrowserWindow({
    title: 'Passenger',
    show: false,
    x,
    y,
    width,
    height, 
    minWidth,
    minHeight,
    webPreferences: {
      nodeIntegration: true
    }
  })

  win.on('ready-to-show', function() { 
    if (win) {
      win.show()
      win.focus()
    }
    if (splash) {
      splash.close()
      splash = null
    }
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }

  win.on('closed', () => {
    win = null
  })
}

app.allowRendererProcessReuse = true
// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    // Devtools extensions are broken in Electron 6.0.0 and greater
    // See https://github.com/nklayman/vue-cli-plugin-electron-builder/issues/378 for more info
    // Electron will not launch with Devtools extensions installed on Windows 10 with dark mode
    // If you are not using Windows 10 dark mode, you may uncomment these lines
    // In addition, if the linked issue is closed, you can upgrade electron and uncomment these lines
    try {
      await installVueDevtools()
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  const state = loadState()
  createSplash(state)
  createWindow(state)
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', data => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}