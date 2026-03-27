const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('hedgespaDesktop', {
  isElectron: true,
  openWidgetWindow: (payload) => ipcRenderer.invoke('open-widget-window', payload),
  updateWidgetTitles: (payload) => ipcRenderer.send('dashboard-title-update', payload),
})
