const { app, BrowserWindow, ipcMain, dialog, Notification } = require('electron/main');
const path = require('node:path');

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

function taskReminderNotif(task) {
  const notification = new Notification({
    title: 'Upcoming Tasks',
    body: `${task.name} | ${task.category}`
  });
  notification.show();
}

function appendTask(event, name, category, priority, dueDate) {
  task = new Task(name, category, priority, dueDate, 1);
  tasks.push(task);
  taskReminderNotif(task);
}

// Replaces task attributes with new ones from edit option
function editTask(event, oName, name, category, dueDate, priority) {
  const task = tasks.find(t => t.name === oName);
  if (task) {
    task.name = name;
    task.category = category;
    task.priority = priority;
    task.dueDate = dueDate;
  }
}

//function to remove tasks, iterates through the tasks array and increments index
//once it finds the name of the task, it removes it at index
let index = 0;
function removeTask(event, name) {
  tasks.forEach(currentTask => {
    if (currentTask.name == name) {
      tasks.splice(index, 1)
    }
    else {
      index += 1;
    }
  })
  index = 0
}

function addToCal(event) {
  return tasks;
}

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    title: 'Task Tracker',
    icon: path.join(__dirname, 'icon.png'),
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
  ipcMain.handle('addToCal', addToCal);
  ipcMain.on('edit-task', editTask);
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