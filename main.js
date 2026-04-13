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

function appendTask(event, name, category, priority, dueDate) {
  let task = new Task(name, category, priority, dueDate);
  tasks.push(task);
  taskReminderNotif(task);
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

function loadTasksFromFile() {
  if (!fs.existsSync("tasks.txt")) {
    return;
  }
  const contents = fs.readFileSync("tasks.txt", "utf8");
  const lines = contents.split("\n");
  for (const line of lines) {
    const entries = line.split(", ");
    if (entries.length < 4)
      continue;

    const name = entries[0];
    const category = entries[1];
    const priority = parseInt(entries[2]);
    const date = parseInt(entries[3]);

    //console.log(name);
    //console.log(category);
    //console.log(priority);
    //console.log(date);

    const task = new Task(name, category, priority, date);
    tasks.push(task);
    //for (const entry of entries) {
    //  console.log(entry);
    //}
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
  })

  win.loadFile('index.html');
  //win.webContents.openDevTools()
}

app.whenReady().then(() => {
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
