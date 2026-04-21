let currentDate = new Date();
let tasks = [];

//for loading the intial calendar
const refreshTasks = async () => {
  tasks = await window.electronAPI.getTasks();
  for (var task of tasks) {
    task.dueDate.setDate(task.dueDate.getDate() + 1);
  }
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

function makeDateString(date) {
  return `${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()}`;
}

function makePriorityString(priority) {
  if (priority == 0) {
    return "Low Priority";
  } else if (priority == 1) {
    return "Medium Priority";
  } else if (priority == 2) {
    return "High Priority";
  }
  return "Invalid Priority";
}

function createTaskCard(task) {
  // Add task to HTML page
  const container = document.createElement("div");
  container.id = 'task-card-' + task.id;
  container.className = 'task-card';

  const leftSpan = document.createElement('span');
  //leftSpan.innerText = task.name;

  const rightSpan = document.createElement('span');
  //rightSpan.innerText = makeDateString(task.dueDate);

  const taskName = document.createElement('h2');
  taskName.innerText = task.name;

  const taskDueDate = document.createElement('h2');
  taskDueDate.innerText = makeDateString(task.dueDate);

  const taskCategory = document.createElement('p');
  taskCategory.innerText = task.category;

  const taskPriority = document.createElement('p');
  taskPriority.innerText = makePriorityString(task.priority);

  const editButton = document.createElement("button");
  editButton.id = 'editButton'
  editButton.innerText = "Edit";
  editButton.addEventListener('click', () => {

  });

  const delButton = document.createElement("button");
  delButton.innerText = "Delete";
  delButton.id = 'delButton'
  delButton.addEventListener('click', () => {
    document.getElementById("task-card-"+task.id).remove();
    window.electronAPI.removeTask(task.id);
  });

  leftSpan.appendChild(taskName);
  leftSpan.appendChild(taskCategory);
  
  rightSpan.appendChild(taskDueDate);
  rightSpan.appendChild(taskPriority);
  rightSpan.appendChild(editButton);
  rightSpan.appendChild(delButton);

  container.appendChild(leftSpan);
  container.appendChild(rightSpan);
  document.getElementById('tasks-card-view').appendChild(container);
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
    emptyBox.className = 'calendar-date-box calendar-date-box-dark'; // Color the past month's day boxes to be darker.
    daysContainer.appendChild(emptyBox);

    //add day number to box
    let dateNum = document.createElement('span');
    dateNum.className = 'calendar-date-number';
    dateNum.innerText = number;
    emptyBox.appendChild(dateNum);

    tasks.forEach(currentTask => {
      const taskYear = currentTask.dueDate.getFullYear();
      const taskMonth = currentTask.dueDate.getMonth();
      const taskDay = currentTask.dueDate.getDate();

      if (taskDay === number && taskMonth === month-1 && taskYear === year) {
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
        emptyBox.appendChild(taskDiv);
      }
    }
    )
  }

  //add boxes to calendar
  for (let i = 1; i <= endDay; i++) {
    let box = document.createElement("div");
    box.className = 'calendar-date-box';
    box.addEventListener('mouseenter', (event) => {
      event.target.style.backgroundColor = "rgb(106, 155, 106)";
    });
    box.addEventListener('mouseleave', (event) => {
      event.target.style.backgroundColor = "rgb(194, 223, 194)";
    });

    //add day number to box
    let dateNum = document.createElement('span');
    dateNum.className = 'calendar-date-number calendar-date-number-dark';
    dateNum.innerText = i;
    box.appendChild(dateNum);
    
    //add tasks to box if its due on that day 
    //(currently applies to every month, the actual task class needs a better date structure)
    tasks.forEach(currentTask => {
      const taskYear = currentTask.dueDate.getFullYear();
      const taskMonth = currentTask.dueDate.getMonth();
      const taskDay = currentTask.dueDate.getDate();

      if (taskDay === i && taskMonth === month && taskYear === year) {
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

document.getElementById('task-edit-form').addEventListener('submit', async (event) => {
  event.preventDefault();

  const nameField = event.target.elements[0];
  const categoryField = event.target.elements[1];
  const priorityField = document.querySelector('input[name="task-priority-edit"]:checked');
  const dueDateField = document.getElementById('task-date');

  var valid = true;
  var priority = 1;
  if (priorityField) {
    priority = parseInt(priorityField.value);
  } else {
    valid = false;
  }

  const name = nameField.value.trim();
  if (name.length == 0) {
    valid = false;
    nameField.style.backgroundColor = "rgb(255, 127, 127)";
    const warning = document.createElement("p");
    warning.innerText = "Name required!";
    warning.className = 'task-add-form-warning-text';
    nameField.after(warning);
  }

  const category = categoryField.value.trim();
  if (category.length == 0) {
    valid = false;
    categoryField.style.backgroundColor = "rgb(255, 127, 127)";
    const warning = document.createElement("p");
    warning.innerText = "Category required!";
    warning.className = 'task-add-form-warning-text';
    categoryField.after(warning);
  }

  const dueDate = dueDateField.valueAsDate;
  if (!dueDate) {
    valid = false;
    dueDateField.style.backgroundColor = "rgb(255, 127, 127)";
    const warning = document.createElement("p");
    warning.innerText = "Due date required!";
    warning.className = 'task-add-form-warning-text';
    dueDateField.after(warning);
  }

  //console.log(Object.prototype.toString.call(name));
  //console.log(Object.prototype.toString.call(category));
  //console.log(Object.prototype.toString.call(priority));
  //console.log(Object.prototype.toString.call(dueDate));
  if (valid) {
    //createTask(name, category, priority, dueDate);
    window.electronAPI.addTask(name, category, priority, dueDate);
    await refreshTasks();
    if (document.getElementById('tasks-card-view').hasAttribute('hidden')) {
      renderCalendar();
    } else {
      renderCardView();
    }
    event.target.setAttribute('hidden', 'hidden');
    event.target.reset();
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
