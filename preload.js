const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  addTask: (name, category, priority, dueDate) => ipcRenderer.send('add-task', name, category, priority, dueDate),
  editTask: (id, name, category, priority, dueDate) => ipcRenderer.send('edit-task', id, name, category, priority, dueDate),
  removeTask: (name) => ipcRenderer.send('remove-task', name),
  getTasks: () => ipcRenderer.invoke('getTasks')
})
