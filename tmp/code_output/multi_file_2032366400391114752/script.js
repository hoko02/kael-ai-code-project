// Task management application

// Task data structure
let tasks = [];

// DOM elements
const taskForm = document.getElementById('taskForm');
const taskTitleInput = document.getElementById('taskTitle');
const taskDescriptionInput = document.getElementById('taskDescription');
const taskDueDateInput = document.getElementById('taskDueDate');
const taskPrioritySelect = document.getElementById('taskPriority');
const taskList = document.getElementById('taskList');
const filterPrioritySelect = document.getElementById('filterPriority');
const clearCompletedButton = document.getElementById('clearCompleted');

// Initialize with today's date as default due date
const today = new Date().toISOString().split('T')[0];
taskDueDateInput.value = today;
taskDueDateInput.min = today;

// Function to create a new task object
function createTask(title, description, dueDate, priority) {
    return {
        id: Date.now(), // Simple unique ID based on timestamp
        title: title,
        description: description,
        dueDate: dueDate,
        priority: priority,
        completed: false,
        createdAt: new Date().toISOString()
    };
}

// Function to render a single task item
function renderTask(task) {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''}`;
    li.dataset.id = task.id;
    li.dataset.priority = task.priority;

    // Priority badge
    const priorityClass = `priority-${task.priority}`;
    const priorityText = task.priority.charAt(0).toUpperCase() + task.priority.slice(1);

    // Format due date
    const dueDate = new Date(task.dueDate);
    const formattedDueDate = dueDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    li.innerHTML = `
        <div class="task-info">
            <h3>${task.title}</h3>
            <p>${task.description || 'No description provided.'}</p>
            <span class="due-date">Due: ${formattedDueDate}</span>
        </div>
        <div class="task-actions">
            <span class="task-priority ${priorityClass}">${priorityText}</span>
            <button class="complete-btn">${task.completed ? 'Undo' : 'Complete'}</button>
            <button class="delete-btn">Delete</button>
        </div>
    `;

    // Add event listeners to buttons
    const completeBtn = li.querySelector('.complete-btn');
    const deleteBtn = li.querySelector('.delete-btn');

    completeBtn.addEventListener('click', () => toggleTaskCompletion(task.id));
    deleteBtn.addEventListener('click', () => deleteTask(task.id));

    return li;
}

// Function to render all tasks based on current filter
function renderTasks() {
    taskList.innerHTML = '';
    const filterValue = filterPrioritySelect.value;
    
    const filteredTasks = tasks.filter(task => {
        if (filterValue === 'all') return true;
        return task.priority === filterValue;
    });

    filteredTasks.forEach(task => {
        taskList.appendChild(renderTask(task));
    });
}

// Function to add a new task
function addTask(title, description, dueDate, priority) {
    const newTask = createTask(title, description, dueDate, priority);
    tasks.push(newTask);
    renderTasks();
    saveTasksToLocalStorage();
}

// Function to toggle task completion
function toggleTaskCompletion(taskId) {
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
        tasks[taskIndex].completed = !tasks[taskIndex].completed;
        renderTasks();
        saveTasksToLocalStorage();
    }
}

// Function to delete a task
function deleteTask(taskId) {
    tasks = tasks.filter(task => task.id !== taskId);
    renderTasks();
    saveTasksToLocalStorage();
}

// Function to clear all completed tasks
function clearCompletedTasks() {
    tasks = tasks.filter(task => !task.completed);
    renderTasks();
    saveTasksToLocalStorage();
}

// Function to save tasks to localStorage
function saveTasksToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to load tasks from localStorage
function loadTasksFromLocalStorage() {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
        renderTasks();
    }
}

// Event listeners
// Form submission for adding new task
taskForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const title = taskTitleInput.value.trim();
    const description = taskDescriptionInput.value.trim();
    const dueDate = taskDueDateInput.value;
    const priority = taskPrioritySelect.value;
    
    if (title && dueDate) {
        addTask(title, description, dueDate, priority);
        
        // Reset form
        taskForm.reset();
        taskDueDateInput.value = today;
        taskPrioritySelect.value = 'medium';
    } else {
        alert('Please fill in at least the task title and due date.');
    }
});

// Filter tasks by priority
filterPrioritySelect.addEventListener('change', renderTasks);

// Clear completed tasks
clearCompletedButton.addEventListener('click', clearCompletedTasks);

// Initialize the application
loadTasksFromLocalStorage();