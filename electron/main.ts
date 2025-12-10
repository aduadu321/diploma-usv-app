import { app, BrowserWindow, ipcMain } from 'electron'
import { spawn, ChildProcess } from 'child_process'
import path from 'path'

let mainWindow: BrowserWindow | null = null
let pythonProcess: ChildProcess | null = null

const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    },
    icon: path.join(__dirname, '../assets/icon.ico'),
    title: 'USV Diploma Calculator - Autovehicule Rutiere'
  })

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

function startPythonBackend() {
  const pythonPath = isDev
    ? 'python'
    : path.join(process.resourcesPath, 'python', 'main.py')

  const pythonScript = isDev
    ? path.join(__dirname, '../python/main.py')
    : pythonPath

  pythonProcess = spawn('python', [pythonScript], {
    cwd: isDev ? path.join(__dirname, '../python') : process.resourcesPath
  })

  pythonProcess.stdout?.on('data', (data) => {
    console.log(`Python: ${data}`)
  })

  pythonProcess.stderr?.on('data', (data) => {
    console.error(`Python Error: ${data}`)
  })

  pythonProcess.on('close', (code) => {
    console.log(`Python process exited with code ${code}`)
  })
}

function stopPythonBackend() {
  if (pythonProcess) {
    pythonProcess.kill()
    pythonProcess = null
  }
}

app.whenReady().then(() => {
  startPythonBackend()
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  stopPythonBackend()
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('before-quit', () => {
  stopPythonBackend()
})

// IPC Handlers
ipcMain.handle('get-app-path', () => {
  return app.getAppPath()
})

ipcMain.handle('is-dev', () => {
  return isDev
})
