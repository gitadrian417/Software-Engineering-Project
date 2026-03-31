const { app, BrowserWindow, ipcMain, dialog } = require('electron/main')
const path = require('node:path')

function appendTask(event, name, category, priority) {
  tasks.push(new Task(name, category, priority, 1));
}

function removeTask(event, name) {

}

function addToCal(event) {
  return tasks;
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

  //change window between calendar and list
  ipcMain.handle('toggleCal', () => {
    win.loadFile('calendar.html');
  })
  ipcMain.handle('toggleList', () => {
    win.loadFile('index.html');
  })
}

app.whenReady().then(() => {
  ipcMain.handle('ping', () => 'pong');
  ipcMain.on('add-task', appendTask);
  ipcMain.on('remove-task', removeTask);
  ipcMain.handle('addToCal', addToCal)
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
  constructor(name, category, priority, dueDate) {
    this.name = name
    this.category = category
    this.priority = priority
    this.dueDate = dueDate
  }
}

let tasks = []
