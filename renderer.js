//const information = document.getElementById('info')
//information.innerText = `This app is using Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), and Electron (v${versions.electron()})`

const func = async () => {
  const response = await window.versions.ping()
  console.log(response) // prints out 'pong'
}

func()

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
  addTask(name, category);
  event.target.setAttribute('hidden', 'hidden');
  event.target.reset();
})

function addTask(name, category) {
  const div1 = document.createElement("div");
  const h2 = document.createElement("h2");
  const p = document.createElement("p");
  div1.id = "task-div-" + name;
  div1.className = "task-div-class";
  h2.innerText = name;
  p.innerText = category;
  div1.appendChild(h2);
  div1.appendChild(p);
  document.body.appendChild(div1);
  console.log("Added new task to page.");
}