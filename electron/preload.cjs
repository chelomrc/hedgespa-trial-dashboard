const { contextBridge } = require('electron')

contextBridge.exposeInMainWorld('hedgespaDesktop', {
  isElectron: true,
})
