// Task data storage (in-memory for this demo)
let tasks = [];

// DOM elements
const taskForm = document.getElementById('taskForm');
const taskTitleInput = document.getElementById('taskTitle');
const taskDescriptionInput = document.getElementById('taskDescription');
const taskDueDateInput = document.getElementById('taskDueDate');
const taskList = document.getElementById('taskList');
const filterButtons = document.querySelectorAll('.filter-btn');

// Initialize with sample tasks for demonstration
function initSampleTasks() {
    tasks = [
        { id: 1, title: 'Finish project report', description: 'Complete the final draft and submit.', dueDate: '2023-12-01', completed: false },
        { id: 2, title: 'Buy groceries', description: 'Milk, eggs, bread, and fruits.', dueDate: '2023-11-20', completed: true },
        { id: 3, title: 'Call dentist', description: 'Schedule an appointment for check-up.', dueDate: '2023-11-25', completed: false }
    ];
    renderTasks();
}

// Add a new task
function addTask(event) {
    event.preventDefault();
    const title = taskTitleInput.value.trim();
    const description = taskDescriptionInput.value.trim();
    const dueDate = taskDueDateInput.value;
    
    if (!title) {
        alert('Please enter a task title.');
        return;
    }
    
    const newTask = {
        id: Date.now(), // Simple unique ID
        title,
        description,
        dueDate,
        completed: false
    };
    
    tasks.push(newTask);
    renderTasks();
    taskForm.reset();
}

// Render tasks based on current filter
function renderTasks(filter = 'all') {
    taskList.innerHTML = '';
    
    const filteredTasks = tasks.filter(task => {
        if (filter === 'all') return true;
        if (filter === 'pending') return !task.completed;
        if (filter === 'completed') return task.completed;
        return true;
    });
    
    filteredTasks.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
        taskItem.innerHTML = `
            <div class="task-info">
                <h3>${task.title}</h3>
                <p>${task.description || 'No description'}</p>
                ${task.dueDate ? `<span class="due-date">Due: ${task.dueDate}</span>` : ''}
            </div>
            <div class="task-actions">
                <button class="complete-btn" data-id="${task.id}">${task.completed ? 'Undo' : 'Complete'}</button>
                <button class="delete-btn" data-id="${task.id}">Delete</button>
            </div>
        `;
        taskList.appendChild(taskItem);
    });
    
    // Re-attach event listeners for dynamic buttons
    attachTaskEventListeners();
}

// Toggle task completion status
function toggleTaskCompletion(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        renderTasks(getCurrentFilter());
    }
}

// Delete a task
function deleteTask(taskId) {
    tasks = tasks.filter(t => t.id !== taskId);
    renderTasks(getCurrentFilter());
}

// Get current active filter
function getCurrentFilter() {
    const activeButton = document.querySelector('.filter-btn.active');
    return activeButton ? activeButton.dataset.filter : 'all';
}

// Set active filter button
function setActiveFilter(filter) {
    filterButtons.forEach(btn => {
        if (btn.dataset.filter === filter) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// Attach event listeners to task action buttons
function attachTaskEventListeners() {
    document.querySelectorAll('.complete-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const taskId = parseInt(btn.dataset.id);
            toggleTaskCompletion(taskId);
        });
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const taskId = parseInt(btn.dataset.id);
            deleteTask(taskId);
        });
    });
}

// Event listeners
function setupEventListeners() {
    taskForm.addEventListener('submit', addTask);
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;
            setActiveFilter(filter);
            renderTasks(filter);
        });
    });
}

// Initialize the application
function init() {
    initSampleTasks();
    setupEventListeners();
}

// Start the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);