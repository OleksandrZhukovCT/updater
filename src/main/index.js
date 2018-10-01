import {
  app,
  BrowserWindow
} from 'electron'
import {
  initialize,
  checkUpdate,
  latestVersion,
  updateApp,
  runApp
} from '../services/updater';
import {
  ipcMain
} from 'electron';


/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */

let mainWindow

const winURL = process.env.NODE_ENV === 'development' ?
  `http://localhost:9080` :
  `file://${__dirname}/index.html`

if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

initialize();


function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 200,
    useContentSize: true,
    width: 500
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
  updateApp(mainWindow)
}

checkUpdate().then(needsUpdate => {
  console.log('Opening window', needsUpdate)
  if (needsUpdate) {
    if (app.isReady()) {
      //if (mainWindow === null)
      createWindow()
    } else {
      app.on('ready', createWindow)
      app.on('activate', () => {
        if (mainWindow === null) {
          createWindow()
        }
      })
    }
  } else {
    runApp()
  }
}).catch(e => {
  console.error(e)
  runApp()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

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