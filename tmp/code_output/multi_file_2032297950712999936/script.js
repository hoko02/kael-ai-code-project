// Task management functionality
let tasks = []; // Array to store tasks

// DOM elements
const taskForm = document.getElementById('taskForm');
const taskList = document.getElementById('taskList');
const filterButtons = document.querySelectorAll('.filter-btn');

// Initialize the app
function init() {
    loadTasks(); // Load tasks from localStorage
    renderTasks(); // Render tasks to the UI
    setupEventListeners(); // Set up event listeners
}

// Load tasks from localStorage
function loadTasks() {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
    }
}

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Render tasks based on current filter
function renderTasks(filter = 'all') {
    taskList.innerHTML = ''; // Clear current list
    
    const filteredTasks = tasks.filter(task => {
        if (filter === 'all') return true;
        if (filter === 'pending') return !task.completed;
        if (filter === 'completed') return task.completed;
        return true;
    });
    
    filteredTasks.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
        taskItem.dataset.id = task.id;
        
        taskItem.innerHTML = `
            <div class="task-info">
                <h3>${task.title}</h3>
                <p>${task.description || 'No description'}</p>
                <span class="due-date">Due: ${task.dueDate}</span>
            </div>
            <div class="task-actions">
                <button class="complete-btn">${task.completed ? 'Undo' : 'Complete'}</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;
        
        taskList.appendChild(taskItem);
    });
}

// Add a new task
function addTask(title, description, dueDate) {
    const newTask = {
        id: Date.now(), // Simple unique ID
        title: title.trim(),
        description: description.trim(),
        dueDate: dueDate,
        completed: false
    };
    
    tasks.push(newTask);
    saveTasks();
    renderTasks(getActiveFilter());
}

// Toggle task completion status
function toggleTaskCompletion(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks(getActiveFilter());
    }
}

// Delete a task
function deleteTask(taskId) {
    tasks = tasks.filter(t => t.id !== taskId);
    saveTasks();
    renderTasks(getActiveFilter());
}

// Get the currently active filter
function getActiveFilter() {
    const activeBtn = document.querySelector('.filter-btn.active');
    return activeBtn ? activeBtn.dataset.filter : 'all';
}

// Set up event listeners
function setupEventListeners() {
    // Form submission for adding new task
    taskForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const title = document.getElementById('taskTitle').value;
        const description = document.getElementById('taskDescription').value;
        const dueDate = document.getElementById('taskDueDate').value;
        
        if (title && dueDate) {
            addTask(title, description, dueDate);
            taskForm.reset(); // Clear the form
        } else {
            alert('Please fill in at least the title and due date.');
        }
    });
    
    // Event delegation for task actions (complete and delete)
    taskList.addEventListener('click', function(e) {
        const taskItem = e.target.closest('.task-item');
        if (!taskItem) return;
        
        const taskId = parseInt(taskItem.dataset.id);
        
        if (e.target.classList.contains('complete-btn')) {
            toggleTaskCompletion(taskId);
        } else if (e.target.classList.contains('delete-btn')) {
            if (confirm('Are you sure you want to delete this task?')) {
                deleteTask(taskId);
            }
        }
    });
    
    // Filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            // Render tasks with new filter
            renderTasks(this.dataset.filter);
        });
    });
}

// Initialize the app when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', init);