const { app, BrowserWindow, ipcMain, dialog } = require('electron/main')
const path = require('node:path')

function appendTask(event, name, category, dueDate) {
  tasks.push(new Task(name, category, dueDate, 2));
}

function removeTask(event, name) {

}

function editTask(taskName, newName, newCategory, newDueDate, newPriority) {

  // Searches for taskName in task array
  const task = tasks.find(t => t.name === taskName)
  if(!task)
    return;

  task.name = newName;
  task.category = newCategory;
  task.dueDate = newDueDate;
  task.priority = newPriority;

  console.log("Editing:", taskName);
  console.log("Before:", tasks);
}

function addToCal(event) {
  return tasks
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
    win.loadFile('calendar.html')

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
  constructor(name, category, dueDate, priority) {
    this.name = name
    this.category = category
    this.dueDate = dueDate
    this.priority = priority
  }
}

tasks = []
