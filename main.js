const { app, BrowserWindow, Menu, ipcMain } = require('electron')
const path = require('path')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js'),
    }
  })

  let applicationMenu = [
    {
      label: 'file',
      submenu: [
        {
          label: 'create',
          accelerator: 'Ctrl+N',
          click: () => win.webContents.send('create')
        },
        {
          label: 'open',
          accelerator: 'Ctrl+O',
          click: () => win.webContents.send('open')
        },
        {
          label: 'save',
          accelerator: 'Ctrl+S',
          click: () => win.webContents.send('save')
        },
        {
          label: 'export',
          accelerator: 'Ctrl+E',
          click: () => win.webContents.send('export')
        }
      ]
    },
    {
      label: 'Tools',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'CmdOrCtrl+R',
          click: function (item, focusedWindow) {
            if (focusedWindow)
              focusedWindow.reload();
          }
        },
        {
          label: 'Toggle Developer Tools',
          accelerator: 'F12',
          click: function (item, focusedWindow) {
            if (focusedWindow)
              focusedWindow.toggleDevTools();
          }
        }
      ]
    }
  ]

  var menu = Menu.buildFromTemplate(applicationMenu)
  Menu.setApplicationMenu(menu);

  win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

async function settitle(event, newtitle) {
  console.log('set new title: ' + newtitle)
  app.settitle(newtitle)
}

ipcMain.on('settitle', settitle)