//const information = document.getElementById('info')
//information.innerText = `This app is using Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), and Electron (v${versions.electron()})`

document.getElementById('add-new-task').addEventListener('click', () => {
  let form = document.getElementById('task-edit-form');
  if (form.hasAttribute('hidden')) {
    form.removeAttribute('hidden');
  }
})

document.getElementById('task-edit-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const name = event.target.elements[0].value;
  const category = event.target.elements[1].value;

  const priority = parseInt(document.querySelector('input[name="task-priority-name"]:checked').value)
  createTask(name, category, priority);
  event.target.setAttribute('hidden', 'hidden');
  event.target.reset();
})

function createTask(name, category, priority) {

  // Add task to backend
  window.electronAPI.addTask(name, category, priority);

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
  editButton.innerText = "Edit";
  delButton.innerText = "Delete";

  editButton.addEventListener('click', () => {

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

//for calendar view
document.getElementById('toggle-Cal').addEventListener('click', async () => {
  await window.windowView.toggleCal()  
})
