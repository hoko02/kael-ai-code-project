// Task management application

// DOM elements
const taskForm = document.getElementById('taskForm');
const taskTitle = document.getElementById('taskTitle');
const taskDescription = document.getElementById('taskDescription');
const taskDueDate = document.getElementById('taskDueDate');
const taskPriority = document.getElementById('taskPriority');
const taskList = document.getElementById('taskList');
const filterButtons = document.querySelectorAll('.filter-btn');

// Set default due date to today
const today = new Date().toISOString().split('T')[0];
taskDueDate.value = today;

// Task array to store tasks
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all'; // Default filter

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
            currentFilter = this.dataset.filter;
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

    if (!title) {
        alert('Please enter a task title');
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
    resetForm();
}

// Reset the form
function resetForm() {
    taskForm.reset();
    taskDueDate.value = today; // Reset to today
    taskPriority.value = 'medium'; // Reset to default
}

// Render tasks based on current filter
function renderTasks() {
    taskList.innerHTML = '';

    let filteredTasks = tasks;
    if (currentFilter === 'pending') {
        filteredTasks = tasks.filter(task => !task.completed);
    } else if (currentFilter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    }

    if (filteredTasks.length === 0) {
        const emptyMessage = document.createElement('li');
        emptyMessage.textContent = currentFilter === 'all' ? 'No tasks yet. Add your first task!' : `No ${currentFilter} tasks.`;
        emptyMessage.style.textAlign = 'center';
        emptyMessage.style.color = '#7f8c8d';
        emptyMessage.style.padding = '20px';
        taskList.appendChild(emptyMessage);
        return;
    }

    filteredTasks.forEach(task => {
        const taskItem = createTaskElement(task);
        taskList.appendChild(taskItem);
    });
}

// Create a task element
function createTaskElement(task) {
    const li = document.createElement('li');
    li.className = `task-item ${task.priority}-priority ${task.completed ? 'completed' : ''}`;
    li.dataset.id = task.id;

    // Task content
    const contentDiv = document.createElement('div');
    contentDiv.className = 'task-content';

    const title = document.createElement('div');
    title.className = 'task-title';
    title.textContent = task.title;
    if (task.completed) {
        title.style.textDecoration = 'line-through';
    }

    const description = document.createElement('div');
    description.className = 'task-description';
    description.textContent = task.description || 'No description';

    const metaDiv = document.createElement('div');
    metaDiv.className = 'task-meta';

    const dueDate = document.createElement('span');
    dueDate.textContent = `Due: ${task.dueDate || 'No due date'}`;

    const priority = document.createElement('span');
    priority.textContent = `Priority: ${task.priority}`;

    metaDiv.appendChild(dueDate);
    metaDiv.appendChild(priority);

    contentDiv.appendChild(title);
    contentDiv.appendChild(description);
    contentDiv.appendChild(metaDiv);

    // Task actions
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'task-actions';

    const completeBtn = document.createElement('button');
    completeBtn.className = 'complete-btn';
    completeBtn.innerHTML = task.completed ? '<i class="fas fa-undo"></i> Undo' : '<i class="fas fa-check"></i> Complete';
    completeBtn.addEventListener('click', () => toggleComplete(task.id));

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i> Delete';
    deleteBtn.addEventListener('click', () => deleteTask(task.id));

    actionsDiv.appendChild(completeBtn);
    actionsDiv.appendChild(deleteBtn);

    li.appendChild(contentDiv);
    li.appendChild(actionsDiv);

    return li;
}

// Toggle task completion
function toggleComplete(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            return { ...task, completed: !task.completed };
        }
        return task;
    });
    saveTasks();
    renderTasks();
}

// Delete a task
function deleteTask(id) {
    if (confirm('Are you sure you want to delete this task?')) {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks();
    }
}

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);