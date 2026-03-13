// Task Tracker Application

// DOM Elements
const taskForm = document.getElementById('taskForm');
const taskTitle = document.getElementById('taskTitle');
const taskDescription = document.getElementById('taskDescription');
const taskDueDate = document.getElementById('taskDueDate');
const taskPriority = document.getElementById('taskPriority');
const tasksContainer = document.getElementById('tasksContainer');
const filterButtons = document.querySelectorAll('.filter-btn');

// Set minimum due date to today
const today = new Date().toISOString().split('T')[0];
taskDueDate.min = today;

// Sample initial tasks (for demonstration)
let tasks = [
    {
        id: 1,
        title: "Complete project report",
        description: "Write the final report for the Q3 project and submit to manager.",
        dueDate: "2023-12-15",
        priority: "high",
        completed: false
    },
    {
        id: 2,
        title: "Buy groceries",
        description: "Milk, eggs, bread, fruits, and vegetables.",
        dueDate: "2023-12-10",
        priority: "medium",
        completed: true
    },
    {
        id: 3,
        title: "Schedule dentist appointment",
        description: "Call Dr. Smith's office to schedule a check-up.",
        dueDate: "2023-12-20",
        priority: "low",
        completed: false
    }
];

// Current filter state
let currentFilter = 'all';

// Initialize the app
function init() {
    renderTasks();
    setupEventListeners();
}

// Set up event listeners
function setupEventListeners() {
    // Form submission
    taskForm.addEventListener('submit', function(e) {
        e.preventDefault();
        addTask();
    });

    // Filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Update filter and re-render
            currentFilter = this.getAttribute('data-filter');
            renderTasks();
        });
    });
}

// Add a new task
function addTask() {
    const title = taskTitle.value.trim();
    const description = taskDescription.value.trim();
    const dueDate = taskDueDate.value;
    const priority = taskPriority.value;

    if (!title || !dueDate) {
        alert('Please fill in at least the title and due date.');
        return;
    }

    const newTask = {
        id: Date.now(), // Simple unique ID
        title,
        description: description || 'No description provided.',
        dueDate,
        priority,
        completed: false
    };

    tasks.unshift(newTask); // Add to beginning of array
    renderTasks();
    taskForm.reset();
    taskDueDate.min = today; // Reset min date after form reset
}

// Toggle task completion
function toggleTaskCompletion(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        renderTasks();
    }
}

// Delete a task
function deleteTask(taskId) {
    if (confirm('Are you sure you want to delete this task?')) {
        tasks = tasks.filter(t => t.id !== taskId);
        renderTasks();
    }
}

// Render tasks based on current filter
function renderTasks() {
    // Filter tasks
    let filteredTasks = tasks;
    if (currentFilter === 'pending') {
        filteredTasks = tasks.filter(task => !task.completed);
    } else if (currentFilter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    }

    // Clear container
    tasksContainer.innerHTML = '';

    // If no tasks
    if (filteredTasks.length === 0) {
        const noTasksMsg = document.createElement('div');
        noTasksMsg.className = 'no-tasks';
        noTasksMsg.innerHTML = `<p>No tasks found. Add a new task to get started!</p>`;
        tasksContainer.appendChild(noTasksMsg);
        return;
    }

    // Render each task
    filteredTasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.className = `task-item ${task.completed ? 'completed' : ''}`;
        taskElement.innerHTML = `
            <div class="task-header">
                <h3 class="task-title">${task.title}</h3>
                <span class="task-priority priority-${task.priority}">${task.priority.toUpperCase()}</span>
            </div>
            <p class="task-description">${task.description}</p>
            <div class="task-footer">
                <div class="task-due-date">
                    <i class="far fa-calendar-alt"></i>
                    Due: ${formatDate(task.dueDate)}
                </div>
                <div class="task-actions">
                    <button class="complete-btn" onclick="toggleTaskCompletion(${task.id})">
                        <i class="fas ${task.completed ? 'fa-undo' : 'fa-check'}"></i>
                        ${task.completed ? 'Mark Pending' : 'Mark Complete'}
                    </button>
                    <button class="delete-btn" onclick="deleteTask(${task.id})">
                        <i class="fas fa-trash"></i>
                        Delete
                    </button>
                </div>
            </div>
        `;
        tasksContainer.appendChild(taskElement);
    });
}

// Format date to readable string
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);