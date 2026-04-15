const { app, BrowserWindow, ipcMain, dialog, Notification } = require('electron/main');
const fs = require('fs');
const path = require('node:path');

PRIORITY_LOW = 0;
PRIORITY_MEDIUM = 1;
PRIORITY_HIGH = 2;

// TASK FIELDS
// Name: string
// Category: string
// Due Date: Date object
// Priority: integer (1-3)

class Task {
  constructor(id, name, category, priority, dueDate) {
    this.id = id;
    this.name = name;
    this.category = category;
    this.priority = priority;
    this.dueDate = dueDate;
  }
}

let tasks = [];

function genTaskId() {
 var duplicate = false;
 var id = 0;
 do {
    id = Math.random() * 9999999;
    for (const task of tasks) {
      if (id == task.id) {
        duplicate = true;
        break;
      }
    }
 } while (duplicate == true);
 return Math.floor(id);
}

function taskReminderNotif(task) {
  const notification = new Notification({
    title: 'Upcoming Tasks',
    body: `${task.name} | ${task.category}`
  });
  notification.show();
}

function generateTaskReminders() {
  const agenda = [];

  for (const task of tasks) {
    const now = new Date();
    const timeLeft = task.dueDate.getTime() - now.getTime();
    const daysLeft = (((timeLeft / 1000) / 60) / 60) / 24;
    if (task.priority == PRIORITY_HIGH) {
      agenda.push(task);
    }
    if (task.priority == PRIORITY_MEDIUM && daysLeft <= 7) {
      agenda.push(task);
    }
    if (task.priority = PRIORITY_LOW && daysLeft <= 1) {
      agenda.push(task);
    }
  }

  for (const task of agenda) {
    taskReminderNotif(task);
  }
}

function appendTask(event, name, category, priority, dueDate) {
  const id = genTaskId();
  const task = new Task(id, name, category, priority, dueDate);
  tasks.push(task);
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

function getTasks(event) {
  return tasks;
}

function saveTasksToFile(tasks) {
  const contents = [];
  for (const task of tasks) {
    const record = [];
    record.push(task.id);
    record.push(task.name);
    record.push(task.category);
    record.push(task.priority);
    record.push(task.dueDate.toISOString());
    const result1 = record.join(",");
    contents.push(result1);
  }
  const result = contents.join("\n");
  fs.writeFile("tasks.txt", result, (err) => {
    if (err) {
      console.error('Error writing file: ', err);
    } else {
      console.log('File written successfully.');
    }
  });
}

function loadTasksFromFile() {
  if (!fs.existsSync("tasks.txt")) {
    return;
  }
  const contents = fs.readFileSync("tasks.txt", "utf8");
  const lines = contents.split("\n");
  for (const line of lines) {
    const entries = line.split(",");
    if (entries.length < 4)
      continue;

    const id = entries[0];
    const name = entries[1];
    const category = entries[2];
    const priority = parseInt(entries[3]);
    const date = new Date(entries[4]);
    const task = new Task(id, name, category, priority, date);
    tasks.push(task);
    //console.log(id);
    //console.log(name);
    //console.log(category);
    //console.log(priority);
    //console.log(date);
  }
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
  });
  win.loadFile('index.html');
  //win.webContents.openDevTools();
}

app.whenReady().then(() => {
  loadTasksFromFile();
  ipcMain.on('add-task', appendTask);
  ipcMain.on('remove-task', removeTask);
  ipcMain.handle('getTasks', getTasks);
  createWindow();
  generateTaskReminders();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  })
})

app.on('window-all-closed', () => {
  saveTasksToFile(tasks);
  if (process.platform !== 'darwin') {
    app.quit();
  }
})
