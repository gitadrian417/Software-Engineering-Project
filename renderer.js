let currentDate = new Date();
let tasks = [];

//for loading the intial calendar
const refreshTasks = async () => {
  tasks = await window.electronAPI.getTasks();
}

function createTask(name, category, priority, dueDate) {
  // Add task to backend
  window.electronAPI.addTask(name, category, priority, dueDate);

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

function switchViews() {
  cardView = document.getElementById('tasks-card-view');
  calendarView = document.getElementById('calendar-view');
  if (cardView.hasAttribute('hidden')) { // Show card view
    renderCardView();
    cardView.removeAttribute('hidden');
    hideElement(calendarView);
  } else { // Show calendar view
    hideElement(cardView);
    renderCalendar();
    unhideElement(calendarView);
  }
}

function createTaskCard(task) {
  // Add task to HTML page
  const div1 = document.createElement("div");
  const h2 = document.createElement("h2");
  const p = document.createElement("p");
  const editButton = document.createElement("button");
  const delButton = document.createElement("button");

  div1.id = "task-div-" + task.name;
  div1.className = "task-card";
  h2.className = 'task-card-text';
  p.className = 'task-card-text';
  h2.innerText = task.name;
  p.innerText = task.category;
  editButton.innerText = "Edit";
  delButton.innerText = "Delete";

  editButton.addEventListener('click', () => {

  });

  delButton.addEventListener('click', () => {
    document.getElementById("task-div-"+task.name).remove();
    window.electronAPI.removeTask(task.name);
  });

  div1.appendChild(h2);
  div1.appendChild(p);
  div1.appendChild(editButton);
  div1.appendChild(delButton);
  document.getElementById('tasks-card-view').appendChild(div1);
  //console.log("Added new task to page.");
}

function renderCardView() {
  document.getElementById('tasks-card-view').replaceChildren();
  for (task of tasks) {
    createTaskCard(task);
  }
}

function renderCalendar() {
  const monthHeader = document.getElementById("calendar-month-header");
  const daysContainer = document.getElementById("calendar-days-container");
  daysContainer.replaceChildren();

  //current year, month, starting weekday(monday,tuesday,etc) of the month, ending date(1,2,etc) of the month
  let year = currentDate.getFullYear();
  let month = currentDate.getMonth();
  let startDay = new Date(year, month, 1).getDay();
  let endDay = new Date(year, month + 1, 0).getDate();

  monthHeader.innerText = currentDate.toLocaleString("default", {month: "long"}) + " " + year;

  //add previous month boxes if applicable
  for (let i = startDay; i > 0; i--) {
    let pastDay = new Date(year, month, 0).getDate();
    let number = pastDay - i + 1;

    let emptyBox = document.createElement("div");
    emptyBox.className = 'dayBox dayBoxDark'; // Color the past month's day boxes to be darker.
    daysContainer.appendChild(emptyBox);

    //add day number to box
    let dateNum = document.createElement('span');
    dateNum.className = 'dateNum';
    dateNum.innerText = number;
    emptyBox.appendChild(dateNum);
  }

  //add boxes to calendar
  for (let i = 1; i <= endDay; i++) {
    let box = document.createElement("div");
    box.className = 'dayBox';
    box.addEventListener('mouseenter', (event) => {
      event.target.style.backgroundColor = "rgb(106, 155, 106)";
      //event.target.style.backgroundColor = "purple";
    });
    box.addEventListener('mouseleave', (event) => {
      event.target.style.backgroundColor = "rgb(194, 223, 194)";
      //event.target.style.backgroundColor = "orange";
    });

    //add day number to box
    let dateNum = document.createElement('span');
    dateNum.className = 'dateNum';
    dateNum.innerText = i;
    box.appendChild(dateNum);
    
    //add tasks to box if its due on that day 
    //(currently applies to every month, the actual task class needs a better date structure)
    tasks.forEach(currentTask => {

      const taskYear = Number(currentTask.dueDate.getFullYear());
      const taskMonth = Number(currentTask.dueDate.getMonth());
      const taskDay = Number(currentTask.dueDate.getDate()) + 1;

      if( taskDay === i &&
          taskMonth === month &&
          taskYear === year
      ){
        let taskDiv = document.createElement("div");
        taskDiv.className = "task";

        //colors task based on priority
        switch(currentTask.priority) {
          case 0: {
            let priority = document.createElement("div");
            priority.className = "task_low";
            priority.innerText = currentTask.name;
            taskDiv.appendChild(priority);
            break;
          }
          case 1: {
            let priority = document.createElement("div");
            priority.className = "task_mid";
            priority.innerText = currentTask.name;
            taskDiv.appendChild(priority)
            break;
          }
          case 2: {
            let priority = document.createElement("div");
            priority.className = "task_high";
            priority.innerText = currentTask.name;
            taskDiv.appendChild(priority);
            break;
          }
        }
        box.appendChild(taskDiv);
      }
    });
    daysContainer.appendChild(box);
  }
}

//increments/decrements current month by 1 if next/prev is clicked
document.getElementById("next").addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
})

document.getElementById("prev").addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
})

document.getElementById('add-new-task').addEventListener('click', () => {
  const form = document.getElementById('task-edit-form');
  if (form.hasAttribute('hidden')) {
    form.removeAttribute('hidden');
  } else {
    form.setAttribute('hidden', 'hidden');
  }
})

document.getElementById('task-edit-form').addEventListener('submit', (event) => {
  event.preventDefault();

  var valid = true;

  const radio = document.querySelector('input[name="task-priority-edit"]:checked');
  var priority = 1;
  if (radio) {
    priority = parseInt(radio.value);
  } else {
    console.log("Empty Priority!");
    valid = false;
  }

  const name = event.target.elements[0].value.trim();
  if (name.length == 0) {
    console.log("Empty Name!");
    valid = false;
  }

  const category = event.target.elements[1].value.trim();
  if (category.length == 0) {
    console.log("Empty Category!");
    valid = false;
  }

  const dueDate = document.getElementById('task-date').valueAsDate;
  if (!dueDate) {
    console.log("Empty Due-Date!");
    valid = false;
  }

  //console.log(Object.prototype.toString.call(name));
  //console.log(Object.prototype.toString.call(category));
  //console.log(Object.prototype.toString.call(priority));
  //console.log(Object.prototype.toString.call(dueDate));
  if (valid) {
    createTask(name, category, priority, dueDate);
    event.target.setAttribute('hidden', 'hidden');
    event.target.reset();
    refreshTasks();
  }
})

//for calendar view
document.getElementById('toggle-view').addEventListener('click', async () => {
  refreshTasks();
  switchViews();
})

window.addEventListener('load', async (event) => {
  await refreshTasks();
  //console.log(tasks.length);
  renderCardView();
});