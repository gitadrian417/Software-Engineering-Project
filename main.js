const { app, BrowserWindow, ipcMain, dialog, Notification } = require('electron/main');
const fs = require('fs');
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

function appendTask(event, name, category, priority) {
  task = new Task(name, category, priority, 1);
  tasks.push(task);
  taskReminderNotif(task);
}

function removeTask(event, name) {

}

function addToCal(event) {
  return tasks;
}

function writeTasksToFile(tasks) {
  const contents = []
  for (const task of tasks) {
    contents.push(task.name);
    contents.push(task.category);
    contents.push(task.priority);
    contents.push(task.dueDate);
    contents.push("\n");
  }
  const result = contents.join(" ");
  fs.writeFile("tasks.txt", result, (err) => {
    if (err) {
      console.error('Error writing file: ', err);
    } else {
      console.log('File written successfully.');
    }
  });
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
  ipcMain.handle('addToCal', addToCal)
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  })
})

app.on('window-all-closed', () => {
  writeTasksToFile(tasks);
  if (process.platform !== 'darwin') {
    app.quit();
  }
})