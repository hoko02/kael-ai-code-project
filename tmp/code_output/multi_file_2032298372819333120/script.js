// Task management logic
const taskForm = document.getElementById('taskForm');
const tasksContainer = document.getElementById('tasksContainer');
const filterButtons = document.querySelectorAll('.filter-btn');

// Array to store tasks
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Function to save tasks to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to render tasks based on filter
function renderTasks(filter = 'all') {
    tasksContainer.innerHTML = '';
    const filteredTasks = tasks.filter(task => {
        if (filter === 'all') return true;
        if (filter === 'pending') return !task.completed;
        if (filter === 'completed') return task.completed;
        return true;
    });

    filteredTasks.forEach((task, index) => {
        const taskItem = document.createElement('li');
        taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
        taskItem.dataset.id = task.id;

        taskItem.innerHTML = `
            <div class="task-header">
                <span class="task-title">${task.title}</span>
                <span class="task-priority ${task.priority}">${task.priority.toUpperCase()}</span>
            </div>
            <p class="task-description">${task.description}</p>
            <div class="task-due-date">Due: ${task.dueDate}</div>
            <div class="task-actions">
                <button class="complete-btn">${task.completed ? 'Undo' : 'Complete'}</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;

        // Add event listeners for buttons
        const completeBtn = taskItem.querySelector('.complete-btn');
        const deleteBtn = taskItem.querySelector('.delete-btn');

        completeBtn.addEventListener('click', () => {
            task.completed = !task.completed;
            saveTasks();
            renderTasks(filter);
        });

        deleteBtn.addEventListener('click', () => {
            tasks = tasks.filter(t => t.id !== task.id);
            saveTasks();
            renderTasks(filter);
        });

        tasksContainer.appendChild(taskItem);
    });
}

// Function to add a new task
function addTask(event) {
    event.preventDefault();

    const title = document.getElementById('taskTitle').value.trim();
    const description = document.getElementById('taskDescription').value.trim();
    const dueDate = document.getElementById('taskDueDate').value;
    const priority = document.getElementById('taskPriority').value;

    if (!title || !dueDate) {
        alert('Please fill in required fields: title and due date.');
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

    tasks.push(newTask);
    saveTasks();
    renderTasks();

    // Reset form
    taskForm.reset();
    document.getElementById('taskPriority').value = 'medium'; // Reset to default
}

// Function to handle filter button clicks
function handleFilterClick(event) {
    const filter = event.target.dataset.filter;
    if (!filter) return;

    // Update active button
    filterButtons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    // Render tasks with selected filter
    renderTasks(filter);
}

// Event listeners
taskForm.addEventListener('submit', addTask);
filterButtons.forEach(btn => btn.addEventListener('click', handleFilterClick));

// Initial render
renderTasks();