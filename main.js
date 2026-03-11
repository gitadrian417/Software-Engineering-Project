const { app, BrowserWindow, ipcMain, dialog } = require('electron/main')
const path = require('node:path')

function appendTask(event, name, category) {
  //console.log('name: ' + name);
  //console.log('category: ' + category);
  tasks.push(new Task(name, category, 0, 0));
  //console.log(tasks);
}

function removeTask(event, name) {

}

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile('index.html');
  //win.webContents.openDevTools()
}

app.whenReady().then(() => {
  ipcMain.handle('ping', () => 'pong');
  ipcMain.on('add-task', appendTask);
  ipcMain.on('remove-task', removeTask);
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
})

// TASK FIELDS
// Name: string
// Category: string
// Due Date: Date object
// Priority: integer (1-3)

class Task {
  constructor(name, category, dueDate, priority) {
    this.name = name
    this.category = category
    this.dueDate = dueDate
    this.priority = priority
  }
}

tasks = []

