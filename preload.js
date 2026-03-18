const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  ping: () => ipcRenderer.invoke('ping')
})

contextBridge.exposeInMainWorld('electronAPI', {
  addTask: (name, category, priority) => ipcRenderer.send('add-task', name, category, priority),
  removeTask: (name) => ipcRenderer.send('remove-task', name),
  addToCal: () => ipcRenderer.invoke('addToCal'),
})

//for changing between calendar and list view
contextBridge.exposeInMainWorld('windowView', {
  toggleCal: () => ipcRenderer.invoke('toggleCal'),
  toggleList: () => ipcRenderer.invoke('toggleList')
})
