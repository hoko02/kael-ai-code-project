// Task data storage (in-memory for this example)
let tasks = [];

// DOM elements
const taskForm = document.getElementById('task-form');
const taskTitleInput = document.getElementById('task-title');
const taskDescriptionInput = document.getElementById('task-description');
const taskDueInput = document.getElementById('task-due');
const tasksContainer = document.getElementById('tasks-container');
const filterButtons = document.querySelectorAll('.filter-btn');

// Initialize with current date for due date input
function initializeDate() {
    const today = new Date().toISOString().split('T')[0];
    taskDueInput.value = today;
    taskDueInput.min = today; // Prevent past dates
}

// Add a new task
function addTask(title, description, dueDate) {
    const task = {
        id: Date.now(), // Simple unique ID
        title: title.trim(),
        description: description.trim(),
        dueDate: dueDate,
        completed: false
    };
    tasks.push(task);
    renderTasks();
}

// Render tasks based on current filter
function renderTasks(filter = 'all') {
    tasksContainer.innerHTML = '';
    let filteredTasks = tasks;
    if (filter === 'pending') {
        filteredTasks = tasks.filter(task => !task.completed);
    } else if (filter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    }
    filteredTasks.forEach(task => {
        const taskElement = document.createElement('li');
        taskElement.className = `task-item ${task.completed ? 'completed' : ''}`;
        taskElement.dataset.id = task.id;
        taskElement.innerHTML = `
            <div class="task-content">
                <h3>${escapeHtml(task.title)}</h3>
                <p>${escapeHtml(task.description) || 'No description'}</p>
                <span class="due-date">Due: ${task.dueDate}</span>
            </div>
            <div class="task-actions">
                <button class="complete-btn">${task.completed ? 'Undo' : 'Complete'}</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;
        tasksContainer.appendChild(taskElement);
    });
    attachTaskEventListeners();
}

// Attach event listeners to task buttons
function attachTaskEventListeners() {
    document.querySelectorAll('.complete-btn').forEach(button => {
        button.addEventListener('click', function() {
            const taskId = parseInt(this.closest('.task-item').dataset.id);
            toggleTaskCompletion(taskId);
        });
    });
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', function() {
            const taskId = parseInt(this.closest('.task-item').dataset.id);
            deleteTask(taskId);
        });
    });
}

// Toggle task completion status
function toggleTaskCompletion(id) {
    const task = tasks.find(task => task.id === id);
    if (task) {
        task.completed = !task.completed;
        renderTasks(getCurrentFilter());
    }
}

// Delete a task
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    renderTasks(getCurrentFilter());
}

// Get current active filter
function getCurrentFilter() {
    const activeButton = document.querySelector('.filter-btn.active');
    return activeButton ? activeButton.dataset.filter : 'all';
}

// Simple HTML escaping to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Event listeners
function setupEventListeners() {
    // Form submission
    taskForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const title = taskTitleInput.value;
        const description = taskDescriptionInput.value;
        const dueDate = taskDueInput.value;
        if (title) {
            addTask(title, description, dueDate);
            taskForm.reset();
            initializeDate(); // Reset date to today
        }
    });
    // Filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            renderTasks(this.dataset.filter);
        });
    });
}

// Initialize the app
function init() {
    initializeDate();
    setupEventListeners();
    renderTasks(); // Initial render with all tasks
}

// Start the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);