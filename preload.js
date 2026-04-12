const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  ping: () => ipcRenderer.invoke('ping')
})

contextBridge.exposeInMainWorld('electronAPI', {
  addTask: (name, category, priority, dueDate) => ipcRenderer.send('add-task', name, category, priority, dueDate),
  removeTask: (name) => ipcRenderer.send('remove-task', name),
  editTask: (oName, name, category, dueDate, priority) => ipcRenderer.send('edit-task', oName, name, category, dueDate, priority),
  addToCal: () => ipcRenderer.invoke('addToCal'),
})

//for changing between calendar and list view
contextBridge.exposeInMainWorld('windowView', {
  toggleCal: () => ipcRenderer.invoke('toggleCal'),
  toggleList: () => ipcRenderer.invoke('toggleList')
})
