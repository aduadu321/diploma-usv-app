import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  getAppPath: () => ipcRenderer.invoke('get-app-path'),
  isDev: () => ipcRenderer.invoke('is-dev'),

  // Platform info
  platform: process.platform,

  // File dialog (for future use)
  onFileOpen: (callback: (path: string) => void) => {
    ipcRenderer.on('file-opened', (_, path) => callback(path))
  }
})

// Type definitions for renderer
declare global {
  interface Window {
    electronAPI: {
      getAppPath: () => Promise<string>
      isDev: () => Promise<boolean>
      platform: string
      onFileOpen: (callback: (path: string) => void) => void
    }
  }
}
