let tasksList : Task[]= JSON.parse(localStorage.getItem("tasks")!) || [];
type Task= {id:number,title:string}
const formSubmitBtn = document.querySelector("form button[type='submit']");
const formSubmit = document.querySelector("form");
const tasksContainer = document.querySelector("#tasks");
const statusBar = document.querySelector("#status");
const x:any=document.forms;
const taskFormElement = x.taskForm;
const taskInput = taskFormElement.taskInput;

async function getTasks() {
  const response = await fetch("https://jsonplaceholder.typicode.com/todos");

  const result = await response.json();
  tasksList = result;
  renderTaskList();
  updateLocalStorage();
}

async function deleteRemoteTask(taskId:number) {
  const response = await fetch(
    "https://jsonplaceholder.typicode.com/todos/" + taskId,
    {
      method: "DELETE",
    }
  );
}

getTasks();

async function createRemoteTask(newTaskData: { title: string }) {
  const response = await fetch("https://jsonplaceholder.typicode.com/todos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newTaskData),
  });

  const createdTask = await response.json();
  tasksList.push(createdTask);
  renderTaskList();
  updateLocalStorage();
}

function displayTask(task:Task) {
  const taskParagraphElement = document.createElement("div");
  taskParagraphElement.innerText = task.title;
  taskParagraphElement.className = task.title;

  const deleteBtn = document.createElement("button");
  deleteBtn.innerText = "Delete";
  deleteBtn.addEventListener("click", () => {
   
      removeFromTaskList(task);
      deleteRemoteTask(task.id);
      renderTaskList();
      updateLocalStorage();
    
  });

  //update btn
  const updateBtn = document.createElement("button");
  updateBtn.innerText = "Update";
  updateBtn.addEventListener("click", () => {
  
    taskInput.value = task.title;
    taskInput.dataset.updateTask = task.id;
    });

  taskParagraphElement.append(deleteBtn, updateBtn);
  tasksContainer!.prepend(taskParagraphElement);
}

function updateLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasksList));
}

function renderTaskList() {
  tasksContainer!.innerHTML = "";
  tasksList.forEach((task) => {
    displayTask(task);
  });
}

function addToTaskList(task:Task) {
  tasksList.push(task);
}

function removeFromTaskList(task:Task) {
  tasksList = tasksList.filter((item) => item.id !== task.id);
}

function addTaskHandler(event:Event) {
  event.preventDefault();

  const taskValue = taskInput.value.trim();

  if (taskValue !== "") {
    const newTaskData = {
      title: taskValue,
    };

    createRemoteTask(newTaskData);

    taskInput.value = "";
  }
}

formSubmit!.addEventListener("submit", (e) => {
  e.preventDefault();
});

formSubmitBtn!.addEventListener("click", (e) => {
  e.preventDefault();
  addTaskHandler(e);
});

//update task btn

const updateTaskBtn = document.createElement("button");
updateTaskBtn.innerText = "Update Task";
updateTaskBtn.addEventListener("click", () => {
  updateTaskHandler();
});
statusBar!.appendChild(updateTaskBtn);

//update using api

async function updateRemoteTask(taskId:number, updatedTaskData:string) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/todos/${taskId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({title: updatedTaskData}),
    }
  );

  const updatedTask = await response.json();

  const taskIndex = tasksList.findIndex((task) => task.id === taskId);
  if (taskIndex > -1) {
    tasksList[taskIndex] = updatedTask;
  }
  renderTaskList();
  updateLocalStorage();
}

function updateTaskHandler() {
  const taskValue = taskInput.value.trim();
  const taskId = taskInput.dataset.updateTask;

  if (taskValue === "" || !taskId) return;

  updateRemoteTask(Number(taskId), taskValue);
  taskInput.value = "";
  delete taskInput.dataset.updateTask;
}
