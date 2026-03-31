const h2 = document.getElementById("h2");
const dayBox = document.getElementById("dayBox");

//get current date
let currentDate = new Date()

let tasks = [];

function renderCalendar() {
    dayBox.innerHTML = "";

    //current year, month, starting weekday(monday,tuesday,etc) of the month, ending date(1,2,etc) of the month
    let year = currentDate.getFullYear()
    let month = currentDate.getMonth();
    let startDay = new Date(year, month, 1).getDay()
    let endDay = new Date(year, month + 1, 0).getDate()

    h2.innerText = currentDate.toLocaleString("default", {month: "long"}) + " " + year;

    //add previous month boxes if applicable
    for (let i = startDay; i > 0; i--) {
        let pastDay = new Date(year, month, 0).getDate();
        let number = pastDay - i + 1

        let emptyBox = document.createElement("div");
        dayBox.appendChild(emptyBox)

        //add day number to box
        let dateNum = document.createElement("span")
        dateNum.className = "pastDateNum"
        dateNum.innerText = number
        emptyBox.appendChild(dateNum)
        
    }

    //add boxes to calendar
    for (let i = 1; i <= endDay; i++) {
        let box = document.createElement("div")

        //add day number to box
        let dateNum = document.createElement("span")
        dateNum.className = "dateNum"
        dateNum.innerText = i
        box.appendChild(dateNum);

        //add tasks to box if its due on that day 
        //(currently applies to every month, the actual task class needs a better date structure)
        tasks.forEach(currentTask => {
            const [yearStr, monthStr, dayStr] = currentTask.dueDate.split('-');
            const taskYear = Number(yearStr);
            const taskMonth = Number(monthStr) - 1;
            const taskDay = Number(dayStr);

            if( taskDay === i &&
                taskMonth === month &&
                taskYear === year
            ) {
                let taskDiv = document.createElement("div");
                taskDiv.className = "task"
                taskDiv.innerText = currentTask.name
                box.appendChild(taskDiv);
            }
        })
        dayBox.appendChild(box);
    }
}

//increments/decrements current month by 1 if next/prev is clicked
document.getElementById("next").addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar()
})
document.getElementById("prev").addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar()
})

//for list view
document.getElementById('toggle-List').addEventListener('click', async () => {
  await window.windowView.toggleList()  
})

//for loading the intial calendar
const getTasks = async () => {
    tasks = await window.electronAPI.addToCal()
    renderCalendar()
}
getTasks()