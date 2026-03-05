//const information = document.getElementById('info')
//information.innerText = `This app is using Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), and Electron (v${versions.electron()})`

const func = async () => {
  const response = await window.versions.ping()
  console.log(response) // prints out 'pong'
}

func()

/*document.getElementById('my-button').addEventListener('click', () => {
  document.getElementById('output').innerText = "Button clicked!"
})*/

/*document.getElementById('task-name').innerText = "Assignment 1"
document.getElementById('task-category').innerText = "CSCE 3444"
document.getElementById('task-edit-button').addEventListener('click', () => {
  document.getElementById('task-edit-form').removeAttribute('hidden')
})
document.getElementById('task-edit-form').addEventListener('submit', (event) => {
  document.getElementById('task-name').innerText = document.getElementById('task-name-edit').innerText
  document.getElementById('task-category').innerText = document.getElementById('task-category-edit').innerText
})*/

/*
      <form id="task-edit-form">
        <label for="task-name-edit">Task Name:</label>
        <input type="text" id="task-name-edit" name="task-name-edit"><br><br>
        <label for="task-category-edit">Task Name:</label>
        <input type="text" id="task-category-edit" name="task-category-edit"><br><br>
        <input type="submit" value="Submit">
      </form>
      <button id="task-edit-button">Edit</button>
*/


const div1 = document.createElement("div")
const h2 = document.createElement("h2")
const p = document.createElement("p")

div1.id = "new-div"
div1.className = "new-div-class"
div1.textContent = "Hello World"
div1.style.color = 'blue'
div1.style.padding = '10px'

h2.innerText = "Assignment 2"
p.innerHTML = "CSCE 3444"
//div1.appendChild(h2)
//div1.appendChild(p)

document.body.appendChild(div1)
document.getElementById('my-div').appendChild(p)

//console.log(document.body.childNodes)