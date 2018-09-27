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
import axios from 'axios';
const request = require('request');


/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */

let mainWindow
  
  //url = 'https://s.gravatar.com/avatar/433f03f0cf4ffafc35a8527538fd8a48?size=496&default=retro'
  /* axios({
    url,
    method: 'GET',
    responseType: 'blob',
    onDownloadProgress: (p) => {
      console.log('aaa'+p);
      mainWindow.webContents.send('download-progress', p)
    }
  }).then(() => mainWindow.webContents.send('download-finish')); */
//});

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
    height: 500,
    useContentSize: true,
    width: 800
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
}).catch(() => runApp())

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