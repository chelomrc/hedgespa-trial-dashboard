const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('hedgespaDesktop', {
  isElectron: true,
  openWidgetWindow: (payload) => ipcRenderer.invoke('open-widget-window', payload),
})
