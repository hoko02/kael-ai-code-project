// Task management functionality

// DOM elements
const taskForm = document.getElementById('taskForm');
const taskTitle = document.getElementById('taskTitle');
const taskDescription = document.getElementById('taskDescription');
const taskDueDate = document.getElementById('taskDueDate');
const taskPriority = document.getElementById('taskPriority');
const taskList = document.getElementById('taskList');
const filterButtons = document.querySelectorAll('.filter-btn');

// Array to store tasks
let tasks = [];

// Load tasks from localStorage on page load
window.addEventListener('DOMContentLoaded', () => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
        renderTasks();
    }
    // Set minimum date for due date input to today
    const today = new Date().toISOString().split('T')[0];
    taskDueDate.min = today;
});

// Function to add a new task
function addTask(event) {
    event.preventDefault();
    
    const title = taskTitle.value.trim();
    const description = taskDescription.value.trim();
    const dueDate = taskDueDate.value;
    const priority = taskPriority.value;
    
    if (!title || !dueDate) {
        alert('Please fill in the title and due date.');
        return;
    }
    
    const newTask = {
        id: Date.now(), // Simple unique ID
        title,
        description,
        dueDate,
        priority,
        completed: false
    };
    
    tasks.push(newTask);
    saveTasks();
    renderTasks();
    taskForm.reset();
    // Reset due date min to today after form reset
    const today = new Date().toISOString().split('T')[0];
    taskDueDate.min = today;
}

// Function to render tasks based on filter
function renderTasks(filter = 'all') {
    taskList.innerHTML = '';
    
    const filteredTasks = tasks.filter(task => {
        if (filter === 'pending') return !task.completed;
        if (filter === 'completed') return task.completed;
        return true; // 'all'
    });
    
    if (filteredTasks.length === 0) {
        taskList.innerHTML = '<li class="task-item">No tasks found.</li>';
        return;
    }
    
    filteredTasks.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.className = `task-item ${task.priority} ${task.completed ? 'completed' : ''}`;
        taskItem.dataset.id = task.id;
        
        const formattedDate = new Date(task.dueDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        
        taskItem.innerHTML = `
            <div class="task-content">
                <h3>${task.title}</h3>
                ${task.description ? `<p>${task.description}</p>` : ''}
                <p class="due-date">Due: ${formattedDate}</p>
            </div>
            <div class="task-actions">
                <button class="complete-btn">${task.completed ? 'Undo' : 'Complete'}</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;
        
        taskList.appendChild(taskItem);
    });
}

// Function to save tasks to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to handle task actions (complete/delete)
function handleTaskAction(event) {
    const target = event.target;
    const taskItem = target.closest('.task-item');
    if (!taskItem) return;
    
    const taskId = parseInt(taskItem.dataset.id);
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    
    if (target.classList.contains('complete-btn')) {
        tasks[taskIndex].completed = !tasks[taskIndex].completed;
        saveTasks();
        // Re-render with current filter
        const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
        renderTasks(activeFilter);
    } else if (target.classList.contains('delete-btn')) {
        tasks.splice(taskIndex, 1);
        saveTasks();
        const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
        renderTasks(activeFilter);
    }
}

// Function to handle filter changes
function handleFilterChange(event) {
    const target = event.target;
    if (!target.classList.contains('filter-btn')) return;
    
    filterButtons.forEach(btn => btn.classList.remove('active'));
    target.classList.add('active');
    
    const filter = target.dataset.filter;
    renderTasks(filter);
}

// Event listeners
taskForm.addEventListener('submit', addTask);
taskList.addEventListener('click', handleTaskAction);
filterButtons.forEach(btn => btn.addEventListener('click', handleFilterChange));