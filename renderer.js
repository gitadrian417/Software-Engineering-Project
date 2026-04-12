//const information = document.getElementById('info')
//information.innerText = `This app is using Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), and Electron (v${versions.electron()})`

const h2 = document.getElementById("h2");
const dayBox = document.getElementById("dayBox");

let currentDate = new Date();
let tasks = [];

function createTask(name, category, priority, dueDate) {

  // Add task to backend
  window.electronAPI.addTask(name, category, priority, dueDate);

  // Add to tasks array for calendar rendering
  tasks.push({ name, category, priority, dueDate });

  // Re-render the calendar so the new task shows up
  renderCalendar();

  // Add task to HTML page
  const div1 = document.createElement("div");
  const h2 = document.createElement("h2");
  const p = document.createElement("p");
  const editButton = document.createElement("button");
  const delButton = document.createElement("button");

  div1.dataset.dueDate = dueDate;
  div1.dataset.priority = priority;
  div1.dataset.name = name;
  div1.dataset.category = category;

  div1.id = "task-div-" + name;
  div1.className = "task-card";
  h2.className = 'task-card-text';
  p.className = 'task-card-text';
  h2.innerText = name;
  p.innerText = category;
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

    // Prefill radio buttons (priority)
    const priorityValue = div1.dataset.priority;

    document.querySelectorAll('input[name="edit-priority-name"]').forEach(radio => {
      radio.checked = (radio.value === priorityValue);
    });

    // Saves task ID and task name for reference in submit button
    form.dataset.taskId = div1.id;
    form.dataset.origName = div1.dataset.name;
  });

  delButton.addEventListener('click', () => {
    document.getElementById("task-div-"+name).remove();
    tasks = tasks.filter(t => t.name !== name || t.dueDate !== dueDate);
    renderCalendar();
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
  if (cardView.hasAttribute('hidden')) {
    cardView.removeAttribute('hidden');
    hideElement(calendarView);
  } else {
    hideElement(cardView);
    unhideElement(calendarView);
  }
}

function renderCalendar() {
    //console.log(tasks.length);
    dayBox.innerHTML = "";

    //current year, month, starting weekday(monday,tuesday,etc) of the month, ending date(1,2,etc) of the month
    let year = currentDate.getFullYear();
    let month = currentDate.getMonth();
    let startDay = new Date(year, month, 1).getDay();
    let endDay = new Date(year, month + 1, 0).getDate();

    h2.innerText = currentDate.toLocaleString("default", {month: "long"}) + " " + year;

    //add previous month boxes if applicable
    for (let i = startDay; i > 0; i--) {
        let pastDay = new Date(year, month, 0).getDate();
        let number = pastDay - i + 1;

        let emptyBox = document.createElement("div");
        emptyBox.className = 'pastDayBox'; // Color the past month's day boxes to be darker.
        dayBox.appendChild(emptyBox);

        //add day number to box
        let dateNum = document.createElement("span");
        dateNum.className = "pastDateNum";
        dateNum.innerText = number;
        emptyBox.appendChild(dateNum);
        
    }

    //add boxes to calendar
    for (let i = 1; i <= endDay; i++) {
      let box = document.createElement("div");
      box.className = 'dayBox';
      box.addEventListener('mouseenter', (event) => {
        event.currentTarget.style.backgroundColor = "rgb(106, 155, 106)";
        //event.currentTarget.style.backgroundColor = "purple";
      });
      box.addEventListener('mouseleave', (event) => {
        event.currentTarget.style.backgroundColor = "rgb(194, 223, 194)";
        //event.currentTarget.style.backgroundColor = "orange";
      });

      //add day number to box
      let dateNum = document.createElement("span");
      dateNum.className = "dateNum";
      dateNum.innerText = i;
      box.appendChild(dateNum);
      
      //add tasks to box if its due on that day 
      //(currently applies to every month, the actual task class needs a better date structure)
      tasks.forEach(currentTask => {
        // Chanhged from Date() function structure to avoid timezone date errors
        const [yearStr, monthStr, dayStr] = currentTask.dueDate.split('-');
        const taskYear = Number(yearStr);
        const taskMonth = Number(monthStr) - 1;
        const taskDay = Number(dayStr);

        if (taskYear === year &&
            taskMonth === month &&
            taskDay === i) { 
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
      dayBox.appendChild(box);
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

  const priority = parseInt(document.querySelector('input[name="task-priority-name"]:checked').value);
  createTask(name, category, priority, dueDate);
  event.target.setAttribute('hidden', 'hidden');
  event.target.reset();
})

document.getElementById('task-edit-form').addEventListener('submit', async (event) => {
  event.preventDefault();

  const name = event.target.elements[0].value;
  const category = event.target.elements[1].value;
  const dueDate = event.target.elements[2].value;
  const priority = parseInt(document.querySelector('input[name="edit-priority-name"]:checked').value)


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

//for calendar view
document.getElementById('toggle-view').addEventListener('click', async () => {
  switchViews();
  getTasks();
})

//for loading the intial calendar
const getTasks = async () => {
  tasks = await window.electronAPI.addToCal();
  renderCalendar();
}