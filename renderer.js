//const information = document.getElementById('info')
//information.innerText = `This app is using Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), and Electron (v${versions.electron()})`

const func = async () => {
  const response = await window.versions.ping()
  console.log(response) // prints out 'pong'
}

func()

document.getElementById('add-new-task').addEventListener('click', () => {
  let form = document.getElementById('task-create-form');
  if (form.hasAttribute('hidden')) {
    form.removeAttribute('hidden');
  }
})

document.getElementById('task-create-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const name = event.target.elements[0].value;
  const category = event.target.elements[1].value;
  const dueDate = event.target.elements[2].value;
  const priority = event.target.elements[3].value;

  createTask(name, category, dueDate, priority);
  event.target.setAttribute('hidden', 'hidden');
  event.target.reset();
})

document.getElementById('task-edit-form').addEventListener('submit', (event) => {
  event.preventDefault();

  const name = event.target.elements[0].value;
  const category = event.target.elements[1].value;
  const dueDate = event.target.elements[2].value;
  const priority = event.target.elements[3].value;

  // Update dataset for next edit
  const taskDiv = document.getElementById(event.target.dataset.taskId);
  taskDiv.querySelector('h2').innerText = name;
  taskDiv.querySelector('p').innerText = category;
  taskDiv.dataset.name = name;
  taskDiv.dataset.category = category;
  taskDiv.dataset.dueDate = dueDate;
  taskDiv.dataset.priority = priority;

  console.log("After:", tasks);
  const oName = event.target.dataset.origName;
  try {
    window.electronAPI.editTask(oName, name, category, dueDate, priority);
  } catch (e) {
  console.error("Error calling editTask:", e);
  }

  event.target.dataset.origName = name;

  event.target.setAttribute('hidden', 'hidden');
  event.target.reset();
})

function createTask(name, category, dueDate, priority) {

  // Add task to backend
  window.electronAPI.addTask(name, category, dueDate);

  // Add task to HTML page
  const div1 = document.createElement("div");
  const h2 = document.createElement("h2");
  const p = document.createElement("p");
  const editButton = document.createElement("button");
  const delButton = document.createElement("button");

  div1.id = "task-div-" + name;
  div1.className = "task-card";
  h2.className = 'task-card-text';
  p.className = 'task-card-text';
  h2.innerText = name;
  p.innerText = category;

  div1.dataset.name = name;
  div1.dataset.category = category;
  div1.dataset.dueDate = dueDate;
  div1.dataset.priority = priority;

  editButton.innerText = "Edit";
  delButton.innerText = "Delete";

  editButton.addEventListener('click', () => {
    const form = document.getElementById('task-edit-form')

    if (form.hasAttribute('hidden')) {
      form.removeAttribute('hidden');
    }

    // Prefills form inputs with task's current data
    form.elements[0].value = div1.dataset.name || name;
    form.elements[1].value = div1.dataset.category || category;
    form.elements[2].value = div1.dataset.dueDate || dueDate;
    form.elements[3].value = div1.dataset.priority || priority;


    // Saves task ID and task name for reference in submit button
    form.dataset.taskId = div1.id;
    form.dataset.origName = div1.dataset.name;
  });

  delButton.addEventListener('click', () => {
    document.getElementById("task-div-"+name).remove();
    window.electronAPI.removeTask(name);
  });

  div1.appendChild(h2);
  div1.appendChild(p);
  div1.appendChild(editButton);
  div1.appendChild(delButton);
  document.getElementById('tasks-card-view').appendChild(div1);
  console.log("Added new task to page.");
}

function hideElement(element) {
  element.setAttribute('hidden', 'hidden');
}

function unhideElement(element) {
  if (element.hasAttribute('hidden')) {
    element.removeAttribute('hidden');
  }
}

// Testing
createTask("Assignment 1", "CSCE 3444", '2026-03-17');
createTask("Assignment 2", "CSCE 4240", '2026-04-17');
createTask("Assignment 3", "CSCE 4650", '2026-06-07');

//for calendar view
document.getElementById('toggle-Cal').addEventListener('click', async () => {
  await window.windowView.toggleCal()  
})
