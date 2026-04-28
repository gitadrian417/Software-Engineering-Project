const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  addTask: (name, category, priority, dueDate, color) => ipcRenderer.send('add-task', name, category, priority, dueDate, color),
  editTask: (id, name, category, priority, dueDate, color) => ipcRenderer.send('edit-task', id, name, category, priority, dueDate, color),
  removeTask: (id) => ipcRenderer.send('remove-task', id),
  sortTasks: (sortBy) => ipcRenderer.send('sort-tasks', sortBy),
  getTasks: () => ipcRenderer.invoke('getTasks')
})
