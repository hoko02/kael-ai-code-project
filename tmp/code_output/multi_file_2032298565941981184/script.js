// Task management application

// Task data structure and storage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// DOM elements
const taskForm = document.getElementById('taskForm');
const taskTitle = document.getElementById('taskTitle');
const taskDescription = document.getElementById('taskDescription');
const taskDueDate = document.getElementById('taskDueDate');
const taskPriority = document.getElementById('taskPriority');
const tasksContainer = document.getElementById('tasksContainer');
const filterButtons = document.querySelectorAll('.filter-btn');

// Initialize the application
function init() {
    renderTasks();
    setupEventListeners();
}

// Set up event listeners
function setupEventListeners() {
    // Form submission for adding new tasks
    taskForm.addEventListener('submit', function(e) {
        e.preventDefault();
        addTask();
    });

    // Filter buttons for task filtering
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter tasks
            const filter = this.getAttribute('data-filter');
            renderTasks(filter);
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
        alert('Please fill in required fields: Title and Due Date');
        return;
    }
    
    const newTask = {
        id: Date.now(), // Simple unique ID
        title,
        description,
        dueDate,
        priority,
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    tasks.push(newTask);
    saveTasks();
    renderTasks();
    
    // Reset form
    taskForm.reset();
    taskPriority.value = 'medium'; // Reset to default
}

// Render tasks based on filter
function renderTasks(filter = 'all') {
    // Clear current tasks
    tasksContainer.innerHTML = '';
    
    // Filter tasks
    let filteredTasks = tasks;
    if (filter === 'pending') {
        filteredTasks = tasks.filter(task => !task.completed);
    } else if (filter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    }
    
    // Render each task
    filteredTasks.forEach(task => {
        const taskElement = createTaskElement(task);
        tasksContainer.appendChild(taskElement);
    });
    
    // Show message if no tasks
    if (filteredTasks.length === 0) {
        const noTasksMsg = document.createElement('p');
        noTasksMsg.textContent = filter === 'all' ? 'No tasks yet. Add a new task!' : `No ${filter} tasks.`;
        noTasksMsg.style.textAlign = 'center';
        noTasksMsg.style.color = '#666';
        tasksContainer.appendChild(noTasksMsg);
    }
}

// Create HTML element for a task
function createTaskElement(task) {
    const taskDiv = document.createElement('div');
    taskDiv.className = `task-item ${task.completed ? 'completed' : ''}`;
    taskDiv.dataset.id = task.id;
    
    // Format due date for display
    const dueDate = new Date(task.dueDate);
    const formattedDueDate = dueDate.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
    
    taskDiv.innerHTML = `
        <div class="task-header">
            <span class="task-title">${escapeHtml(task.title)}</span>
            <span class="task-priority ${task.priority}">${task.priority.toUpperCase()}</span>
        </div>
        ${task.description ? `<p class="task-description">${escapeHtml(task.description)}</p>` : ''}
        <div class="task-due-date">Due: ${formattedDueDate}</div>
        <div class="task-actions">
            <button class="complete-btn">${task.completed ? 'Undo' : 'Complete'}</button>
            <button class="delete-btn">Delete</button>
        </div>
    `;
    
    // Add event listeners to action buttons
    const completeBtn = taskDiv.querySelector('.complete-btn');
    const deleteBtn = taskDiv.querySelector('.delete-btn');
    
    completeBtn.addEventListener('click', () => toggleTaskCompletion(task.id));
    deleteBtn.addEventListener('click', () => deleteTask(task.id));
    
    return taskDiv;
}

// Toggle task completion status
function toggleTaskCompletion(taskId) {
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
        tasks[taskIndex].completed = !tasks[taskIndex].completed;
        saveTasks();
        
        // Re-render with current filter
        const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
        renderTasks(activeFilter);
    }
}

// Delete a task
function deleteTask(taskId) {
    if (confirm('Are you sure you want to delete this task?')) {
        tasks = tasks.filter(task => task.id !== taskId);
        saveTasks();
        
        // Re-render with current filter
        const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
        renderTasks(activeFilter);
    }
}

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Helper function to escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);