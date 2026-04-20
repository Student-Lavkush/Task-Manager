const taskCount = document.querySelector("#taskCount");
const searchInput = document.querySelector("#searchInput");
const filterSelect = document.querySelector("#filterSelect");
const taskInput = document.querySelector("#taskInput");
const btnAddTask = document.querySelector("#btnAddTask");
const taskList = document.querySelector("#taskList");
const mode = document.querySelector("#mode");
const emptyState = document.querySelector("#emptyState");
const taskElements = new Map();
const storageKey = "tasks";
let tasks = [];

function saveTasks() {
  localStorage.setItem(storageKey, JSON.stringify(tasks));
}

function loadTasks() {
  try {
    const storedTasks = JSON.parse(localStorage.getItem(storageKey)) || [];

    if (!Array.isArray(storedTasks)) {
      tasks = [];
      return;
    }

    tasks = storedTasks.filter(
      (task) =>
        task &&
        typeof task.id === "number" &&
        typeof task.text === "string" &&
        typeof task.completed === "boolean"
    );
  } catch {
    tasks = [];
  }
}

function updateTaskCount() {
  taskCount.innerText = tasks.length;
}

function updateEmptyState() {
  emptyState.style.display = tasks.length === 0 ? "block" : "none";
}

function applyFilters() {
  const searchValue = searchInput.value.trim().toLowerCase();
  const filterValue = filterSelect.value;

  tasks.forEach((task) => {
    const listItem = taskElements.get(task.id);
    if (!listItem) return;

    const matchesSearch = task.text.toLowerCase().includes(searchValue);
    const matchesFilter =
      filterValue === "all" ||
      (filterValue === "completed" && task.completed) ||
      (filterValue === "pending" && !task.completed);

    listItem.style.display = matchesSearch && matchesFilter ? "flex" : "none";
  });
}

function addTask() {
  const taskValue = taskInput.value.trim();
  if (!taskValue) return;

  const taskObj = {
    id: Date.now(),
    text: taskValue,
    completed: false,
  };

  tasks.push(taskObj);
  renderTask(taskObj);
  taskInput.value = "";
  saveTasks();
  updateTaskCount();
  updateEmptyState();
  applyFilters();
  taskInput.focus();
}

function createTaskElement(taskObj) {
  const checkBox = document.createElement("input");
  const span = document.createElement("span");
  const li = document.createElement("li");
  const deleteBtn = document.createElement("button");

  span.innerText = taskObj.text;
  checkBox.type = "checkbox";
  checkBox.checked = taskObj.completed;
  span.classList.toggle("completed", taskObj.completed);
  deleteBtn.innerText = "Delete";

  li.appendChild(checkBox);
  li.appendChild(span);
  li.appendChild(deleteBtn);

  taskElements.set(taskObj.id, li);

  deleteBtn.addEventListener("click", () => {
    tasks = tasks.filter((task) => task.id !== taskObj.id);
    taskElements.delete(taskObj.id);
    li.remove();
    saveTasks();
    updateTaskCount();
    updateEmptyState();
    applyFilters();
  });

  checkBox.addEventListener("change", () => {
    taskObj.completed = checkBox.checked;
    span.classList.toggle("completed", checkBox.checked);
    saveTasks();
    applyFilters();
  });

  return li;
}

function renderTask(taskObj) {
  const taskItem = createTaskElement(taskObj);
  taskList.appendChild(taskItem);
}

// for dark mode
mode.addEventListener("click", () => {
  const isDarkMode = document.body.classList.toggle("dark-mode");
  mode.textContent = isDarkMode ? "☀️" : "🌙";
});

// event listner for add task
btnAddTask.addEventListener("click", () => {
  addTask();
});

taskInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addTask();
  }
});

// event listner for search task
searchInput.addEventListener("input", () => {
  applyFilters();
});
// event listner for filter task
filterSelect.addEventListener("change", () => {
  applyFilters();
});

loadTasks();
tasks.forEach((task) => {
  renderTask(task);
});
updateTaskCount();
updateEmptyState();
applyFilters();
