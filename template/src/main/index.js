{{#if_eq eslintConfig 'standard'}}
'use strict'
{{/if_eq}}
import { app, BrowserWindow } from 'electron'{{#if_eq eslintConfig 'airbnb'}} // eslint-disable-line{{/if_eq}}
/* eslint-disable no-console*/
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\'){{#if_eq eslintConfig 'airbnb'}} // eslint-disable-line{{/if_eq}}
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9081`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  if(!mainWindow) {
    console.info('🌱 - instantiate new window from createWindow function')
    let options = {
      height: 563,
      useContentSize: true,
      width: 1000
    }
    {{#isEnabled plugins 'standard-settings'}}
    options = require('assignment')(options, global.settings.window)
    mainWindow = new BrowserWindow(options) 
    if (global.settings.simulateOutage) {
      mainWindow.webContents.session.enableNetworkEmulation({offline: true})
    }
    if (global.settings.openDevTools) {
      mainWindow.webContents.openDevTools()
    }
    if (global.settings.clearCache) {
      console.warn('⚠️ - Option to clear cache set, cache will be cleared')
      mainWindow.webContents.session.clearStorageData({}, () => {
        mainWindow.webContents.session.clearCache(() => {
          console.log('cache cleared.')
          mainWindow.loadURL(winURL)
        })
      })
    } else {
      mainWindow.loadURL(winURL)
    }
    {{else}}
    mainWindow.loadURL(winURL)
    {{/isEnabled}}
    
    mainWindow.on('closed', () => {
      mainWindow = null
    })
    mainWindow.on('unresponsive', () => {
      console.error('ERROR 61 - Window does not respond, let\'s quit')
      app.quit()
    })

    mainWindow.webContents.on('crashed', () => {
      console.error('ERROR 62 - Webcontent renderer crashed, let\'s quit')
      app.quit()
    })

    mainWindow.webContents.on('destroyed', () => {
      console.error('ERROR 63 - Webcontent destroyed, let\'s quit')
      app.quit()
    })
  }else {
    console.warn('⚠️ - trying to create a new Window from create window. Window already exist. Not creating')
  }
}
{{#isEnabled plugins 'standard-settings'}}
global.settings = require('standard-settings').getSettings()
if (global.settings.appendSwitch) {
  Object.keys(global.settings.appendSwitch).forEach((key) => {
    if (global.settings.appendSwitch[key] !== '') {
      app.commandLine.appendSwitch(key, global.settings.appendSwitch[key])
    } else {
      app.commandLine.appendSwitch(key)
    }
  })
}
if (global.settings.appendArgument) {
  Object.values(global.settings.appendArgument).forEach((value) => {
    app.commandLine.appendArgument(value)
  })
}
{{/isEnabled}}

app.on('ready', createWindow)

app.on('gpu-process-crashed', () => {
  console.error('ERROR 64 - App GPU process has crashed, let\'s quit')
  app.quit()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
{{#if_eq builder 'builder'}}

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
{{/if_eq}}
