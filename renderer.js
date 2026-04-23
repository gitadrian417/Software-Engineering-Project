let currentDate = new Date();
let tasks = [];
// ID of the task currently being edited.
// Negative number means no task is being edited.
let taskBeingEdited = -1;

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

// Sets the selected value of the priority radio control in the task edit form.
// Parameter priority should be an integer on the interval [0, 2].
function setTaskEditFormPriority(priority) {
  const radio = document.getElementsByName('task-priority-edit');
  for (option of radio) {
    if (option.value == priority) {
      option.checked = true;
      break;
    }
  }
}
function setTaskColorForm(color) {
  const radio = document.getElementsByName('task-color');
  for (option of radio) {
    if (option.value == color) {
      option.checked = true;
      break;
    }
  }
}

function createTaskCard(task) {
  // Add task to HTML page
  const container = document.createElement("div");
  container.id = 'task-card-' + task.id;
  container.className = 'task-card';
 
  let colorbox = document.createElement('div')

  const leftSpan = document.createElement('span');
  const rightSpan = document.createElement('span');

  const taskColor = document.createElement('p');
  taskColor.innerText = "Color (" + task.color + "):";

  //for adding color to tasks
  switch(task.color) {
    case "blue": {
      if (task.priority == 0) { 
        colorbox.className = 'task-color-box blue-low'
      }
      else if (task.priority == 1) {
        colorbox.className = 'task-color-box blue-mid'      
      }
      else {
        colorbox.className = 'task-color-box blue-high'      
      }
      break;
    }
  
    case "green": {
      if (task.priority == 0) { 
        colorbox.className = 'task-color-box green-low'
      }
      else if (task.priority == 1) {
        colorbox.className = 'task-color-box green-mid'
      }
      else {
        colorbox.className = 'task-color-box green-high'
      }
      break;
    }

    case "grey": {
      if (task.priority == 0) { 
        colorbox.className = 'task-color-box grey-low'
      }
      else if (task.priority == 1) {
        colorbox.className = 'task-color-box grey-mid'
      }
      else {
        colorbox.className = 'task-color-box grey-high'
      }
      break;
    }

    case "purple": {
      if (task.priority == 0) { 
        colorbox.className = 'task-color-box purple-low'
      }
      else if (task.priority == 1) {
        colorbox.className = 'task-color-box purple-mid'

      }
      else {
        colorbox.className = 'task-color-box purple-high'
      }
      break;
    }

    case "red": {
      if (task.priority == 0) { 
        colorbox.className = 'task-color-box red-low'
      }
      else if (task.priority == 1) {
        colorbox.className = 'task-color-box red-mid'

      }
      else {
        colorbox.className = 'task-color-box red-high'
      }
      break;
    }
  }

  const taskName = document.createElement('h2');
  taskName.innerText = task.name;

  const taskDueDate = document.createElement('h2');
  taskDueDate.innerText = makeDateString(task.dueDate);

  const taskCategory = document.createElement('p');
  taskCategory.innerText = task.category;

  const taskPriority = document.createElement('p');
  taskPriority.innerText = makePriorityString(task.priority);

  const editButton = document.createElement("button");
  editButton.id = 'editButton' + task.id;
  editButton.className = 'editButton'
  editButton.innerText = "Edit";
  editButton.addEventListener('click', () => {
    const form = document.getElementById('task-edit-form');
    if (form.hasAttribute('hidden')) {
      taskBeingEdited = task.id;

      document.getElementById('task-edit-form-header').innerText = `Editing '${task.name}'`;
      document.getElementById('task-name-edit').value = task.name;
      document.getElementById('task-category-edit').value = task.category;
      setTaskEditFormPriority(task.priority);
      setTaskColorForm(task.color)
      newDueDate = new Date(task.dueDate); // Decrement day by one because of timezone shenanigans
      newDueDate.setDate(newDueDate.getDate() - 1);
      document.getElementById('task-date-edit').valueAsDate = newDueDate;

      form.removeAttribute('hidden');
      editButton.innerText = "Cancel";
    } 
        
    else {
      editButton.innerText = "Edit";
      form.setAttribute('hidden', 'hidden');
      taskBeingEdited = -1;
      const createButton = document.getElementById('add-new-task')
      if (createButton.innerText != 'Add New Task') {
        createButton.innerText = 'Add New Task'
      }
    }
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
  leftSpan.appendChild(taskColor)
          leftSpan.appendChild(colorbox)


  
  rightSpan.appendChild(taskDueDate);
  rightSpan.appendChild(taskPriority);
  rightSpan.appendChild(editButton);
  rightSpan.appendChild(delButton);

  container.appendChild(leftSpan);
  container.appendChild(rightSpan);
  document.getElementById('tasks-card-view').appendChild(container);
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
        let task_cal_box = document.createElement("div");
        task_cal_box.className = "task_priority"

        switch(currentTask.color) {
          case "blue": {
            if (currentTask.priority == 0) {task_cal_box.className += ' blue-low'}
            else if (currentTask.priority == 1) {task_cal_box.className += ' blue-mid'}
            else {task_cal_box.className += ' blue-high'}
            break;
          }
          case "green": {
            if (currentTask.priority == 0) {task_cal_box.className += ' green-low'}
            else if (currentTask.priority == 1) {task_cal_box.className += ' green-mid'}
            else {task_cal_box.className += ' green-high'}
            break;
          }          
          case "grey": {
            if (currentTask.priority == 0) {task_cal_box.className += ' grey-low'}
            else if (currentTask.priority == 1) {task_cal_box.className += ' grey-mid'}
            else {task_cal_box.className += ' grey-high'}
            break;
          }
          case "purple": {
            if (currentTask.priority == 0) {task_cal_box.className += ' purple-low'}
            else if (currentTask.priority == 1) {task_cal_box.className += ' purple-mid'}
            else {task_cal_box.className += ' purple-high'}
            break;
          }
          case "red": {
            if (currentTask.priority == 0) {task_cal_box.className += ' red-low'}
            else if (currentTask.priority == 1) {task_cal_box.className += ' red-mid'}
            else {task_cal_box.className += ' red-high'}
            break;
          }
        }

        task_cal_box.innerText = currentTask.name
        taskDiv.appendChild(task_cal_box)
        emptyBox.appendChild(taskDiv);
      }
    })
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
        let task_cal_box = document.createElement("div");
        task_cal_box.className = "task_priority"

        //colors task based on priority
        switch(currentTask.color) {
          case "blue": {
            if (currentTask.priority == 0) {task_cal_box.className += ' blue-low'}
            else if (currentTask.priority == 1) {task_cal_box.className += ' blue-mid'}
            else {task_cal_box.className += ' blue-high'}
            break;
          }
          case "green": {
            if (currentTask.priority == 0) {task_cal_box.className += ' green-low'}
            else if (currentTask.priority == 1) {task_cal_box.className += ' green-mid'}
            else {task_cal_box.className += ' green-high'}
            break;
          }          
          case "grey": {
            if (currentTask.priority == 0) {task_cal_box.className += ' grey-low'}
            else if (currentTask.priority == 1) {task_cal_box.className += ' grey-mid'}
            else {task_cal_box.className += ' grey-high'}
            break;
          }
          case "purple": {
            if (currentTask.priority == 0) {task_cal_box.className += ' purple-low'}
            else if (currentTask.priority == 1) {task_cal_box.className += ' purple-mid'}
            else {task_cal_box.className += ' purple-high'}
            break;
          }
          case "red": {
            if (currentTask.priority == 0) {task_cal_box.className += ' red-low'}
            else if (currentTask.priority == 1) {task_cal_box.className += ' red-mid'}
            else {task_cal_box.className += ' red-high'}
            break;
          }
        }
        task_cal_box.innerText = currentTask.name
        taskDiv.appendChild(task_cal_box)
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

document.getElementById('add-new-task').addEventListener('click', (event) => {
  const form = document.getElementById('task-edit-form');

    tasks.forEach(currentTask => {
      if (currentTask.id == taskBeingEdited) {
        change = document.getElementById('editButton' + currentTask.id)
        change.innerText = "Edit"
        taskBeingEdited = -1
      }
    }) 
  

  if (form.hasAttribute('hidden')) {
    taskBeingEdited = -1;

    document.getElementById('task-edit-form-header').innerText = "Creating New Task";
    document.getElementById('task-name-edit').value = "";
    document.getElementById('task-category-edit').value = "";
    setTaskEditFormPriority(1);
    setTaskColorForm("grey")
    newDueDate = new Date();
    document.getElementById('task-date-edit').valueAsDate = newDueDate;

    form.removeAttribute('hidden');
    event.target.innerText = "Cancel";
  } else {
    event.target.innerText = "Add New Task";
    form.setAttribute('hidden', 'hidden');
  }

})

document.getElementById('task-edit-form').addEventListener('submit', async (event) => {
  event.preventDefault();

  const nameField = event.target.elements[0];
  const categoryField = event.target.elements[1];
  const priorityField = document.querySelector('input[name="task-priority-edit"]:checked');
  const dueDateField = document.getElementById('task-date-edit');
  const colorField = document.querySelector('input[name="task-color"]:checked')

  var valid = true;
  var priority = 1;
  if (priorityField) {
    priority = parseInt(priorityField.value);
  } else {
    valid = false;
  }

  var color = 3
  if (colorField) {
    color = colorField.value
  }
  else {
    valid = false
  }

  const name = nameField.value.trim();
  if (name.length == 0) {
    valid = false;
    nameField.style.backgroundColor = "rgb(255, 127, 127)";
    const warning = document.createElement("p");
    warning.id = 'name-warning'
    warning.innerText = "Name required!";
    warning.className = 'task-add-form-warning-text';
    nameField.after(warning);
  }

  const category = categoryField.value.trim();
  if (category.length == 0) {
    valid = false;
    categoryField.style.backgroundColor = "rgb(255, 127, 127)";
    const warning = document.createElement("p");
    warning.id = 'cat-warning'
    warning.innerText = "Category required!";
    warning.className = 'task-add-form-warning-text';
    categoryField.after(warning);
  }

  const dueDate = dueDateField.valueAsDate;
  if (!dueDate) {
    valid = false;
    dueDateField.style.backgroundColor = "rgb(255, 127, 127)";
    const warning = document.createElement("p");
    warning.id = 'date-warning'
    warning.innerText = "Due date required!";
    warning.className = 'task-add-form-warning-text';
    dueDateField.after(warning);
  }

  if (valid) {
    if (taskBeingEdited < 0) {
      window.electronAPI.addTask(name, category, priority, dueDate, color);
    } else {
      window.electronAPI.editTask(taskBeingEdited, name, category, priority, dueDate, color);
    }

    await refreshTasks();

    if (document.getElementById('tasks-card-view').hasAttribute('hidden')) {
      renderCalendar();
    } else {
      renderCardView();
    } 

    if (document.getElementById('add-new-task').innerText != 'Add New Task') {
      document.getElementById('add-new-task').innerText = 'Add New Task'
    } 
    event.target.setAttribute('hidden', 'hidden');
    event.target.reset();

    if(document.getElementById('name-warning')) {
      nameField.style.backgroundColor = "rgb(194, 223, 194)"
      document.getElementById('name-warning').remove()
    }
    if(document.getElementById('cat-warning')) {
      categoryField.style.backgroundColor = "rgb(194, 223, 194)"
      document.getElementById('cat-warning').remove()
    }
    if(document.getElementById('date-warning')) {
      dueDateField.style.backgroundColor = "rgb(194, 223, 194)"
      document.getElementById('date-warning').remove()
    }
  }
})

//for calendar view
document.getElementById('toggle-view').addEventListener('click', async () => {
  await refreshTasks();
  switchViews();
})

window.addEventListener('load', async (event) => {
  await refreshTasks();
  renderCardView();
});
