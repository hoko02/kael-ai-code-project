// Task Tracker Application

// DOM Elements
const taskForm = document.getElementById('task-form');
const taskTitleInput = document.getElementById('task-title');
const taskDescriptionInput = document.getElementById('task-description');
const tasksContainer = document.getElementById('tasks-container');

// Task array to store tasks
let tasks = [];

// Load tasks from localStorage on page load
window.addEventListener('DOMContentLoaded', () => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
        renderTasks();
    }
});

// Function to render tasks to the DOM
function renderTasks() {
    tasksContainer.innerHTML = ''; // Clear current tasks
    tasks.forEach((task, index) => {
        const taskElement = document.createElement('div');
        taskElement.className = `task-item ${task.completed ? 'completed' : ''}`;
        taskElement.innerHTML = `
            <div class="task-content">
                <h3>${task.title}</h3>
                <p>${task.description || 'No description provided.'}</p>
            </div>
            <div class="task-actions">
                <button class="complete-btn" data-index="${index}">
                    ${task.completed ? 'Undo' : 'Complete'}
                </button>
                <button class="delete-btn" data-index="${index}">Delete</button>
            </div>
        `;
        tasksContainer.appendChild(taskElement);
    });
}

// Function to add a new task
function addTask(title, description) {
    const newTask = {
        title: title.trim(),
        description: description.trim(),
        completed: false,
        id: Date.now() // Simple unique ID
    };
    tasks.push(newTask);
    saveTasks();
    renderTasks();
}

// Function to toggle task completion
function toggleTaskCompletion(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
}

// Function to delete a task
function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
}

// Function to save tasks to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Event listener for form submission
taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = taskTitleInput.value;
    const description = taskDescriptionInput.value;
    if (title) {
        addTask(title, description);
        taskTitleInput.value = '';
        taskDescriptionInput.value = '';
    } else {
        alert('Please enter a task title.');
    }
});

// Event delegation for task actions (complete and delete buttons)
tasksContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('complete-btn')) {
        const index = e.target.getAttribute('data-index');
        toggleTaskCompletion(index);
    } else if (e.target.classList.contains('delete-btn')) {
        const index = e.target.getAttribute('data-index');
        deleteTask(index);
    }
});