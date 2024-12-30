"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let tasksList = JSON.parse(localStorage.getItem("tasks")) || [];
const formSubmitBtn = document.querySelector("form button[type='submit']");
const formSubmit = document.querySelector("form");
const tasksContainer = document.querySelector("#tasks");
const statusBar = document.querySelector("#status");
const x = document.forms;
const taskFormElement = x.taskForm;
const taskInput = taskFormElement.taskInput;
function getTasks() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch("https://jsonplaceholder.typicode.com/todos");
        const result = yield response.json();
        tasksList = result;
        renderTaskList();
        updateLocalStorage();
    });
}
function deleteRemoteTask(taskId) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch("https://jsonplaceholder.typicode.com/todos/" + taskId, {
            method: "DELETE",
        });
    });
}
getTasks();
function createRemoteTask(newTaskData) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch("https://jsonplaceholder.typicode.com/todos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newTaskData),
        });
        const createdTask = yield response.json();
        tasksList.push(createdTask);
        renderTaskList();
        updateLocalStorage();
    });
}
function displayTask(task) {
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
    tasksContainer.prepend(taskParagraphElement);
}
function updateLocalStorage() {
    localStorage.setItem("tasks", JSON.stringify(tasksList));
}
function renderTaskList() {
    tasksContainer.innerHTML = "";
    tasksList.forEach((task) => {
        displayTask(task);
    });
}
function addToTaskList(task) {
    tasksList.push(task);
}
function removeFromTaskList(task) {
    tasksList = tasksList.filter((item) => item.id !== task.id);
}
function addTaskHandler(event) {
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
formSubmit.addEventListener("submit", (e) => {
    e.preventDefault();
});
formSubmitBtn.addEventListener("click", (e) => {
    e.preventDefault();
    addTaskHandler(e);
});
//update task btn
const updateTaskBtn = document.createElement("button");
updateTaskBtn.innerText = "Update Task";
updateTaskBtn.addEventListener("click", () => {
    updateTaskHandler();
});
statusBar.appendChild(updateTaskBtn);
//update using api
function updateRemoteTask(taskId, updatedTaskData) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`https://jsonplaceholder.typicode.com/todos/${taskId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ title: updatedTaskData }),
        });
        const updatedTask = yield response.json();
        const taskIndex = tasksList.findIndex((task) => task.id === taskId);
        if (taskIndex > -1) {
            tasksList[taskIndex] = updatedTask;
        }
        renderTaskList();
        updateLocalStorage();
    });
}
function updateTaskHandler() {
    const taskValue = taskInput.value.trim();
    const taskId = taskInput.dataset.updateTask;
    if (taskValue === "" || !taskId)
        return;
    updateRemoteTask(Number(taskId), taskValue);
    taskInput.value = "";
    delete taskInput.dataset.updateTask;
}
//# sourceMappingURL=script.js.map