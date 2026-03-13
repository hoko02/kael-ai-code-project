// Task management functionality
const taskForm = document.getElementById('taskForm');
const tasksContainer = document.getElementById('tasksContainer');
const filterButtons = document.querySelectorAll('.filter-btn');

// Array to store tasks
let tasks = [];

// Function to add a new task
function addTask(event) {
    event.preventDefault(); // Prevent form submission

    // Get form values
    const title = document.getElementById('taskTitle').value.trim();
    const description = document.getElementById('taskDescription').value.trim();
    const dueDate = document.getElementById('taskDueDate').value;
    const priority = document.getElementById('taskPriority').value;

    // Validate title and due date
    if (!title || !dueDate) {
        alert('Please fill in the task title and due date.');
        return;
    }

    // Create task object
    const task = {
        id: Date.now(), // Unique ID based on timestamp
        title,
        description,
        dueDate,
        priority,
        completed: false
    };

    // Add task to array
    tasks.push(task);

    // Clear form
    taskForm.reset();
    document.getElementById('taskPriority').value = 'medium'; // Reset to default

    // Render tasks
    renderTasks();
}

// Function to render tasks based on filter
function renderTasks(filter = 'all') {
    // Clear container
    tasksContainer.innerHTML = '';

    // Filter tasks
    let filteredTasks = tasks;
    if (filter !== 'all') {
        filteredTasks = tasks.filter(task => task.priority === filter);
    }

    // Create task elements
    filteredTasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.className = `task-item ${task.priority} ${task.completed ? 'completed' : ''}`;
        taskElement.dataset.id = task.id;

        // Format due date
        const dueDateFormatted = new Date(task.dueDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        taskElement.innerHTML = `
            <h3>${task.title}</h3>
            <p>${task.description || 'No description provided.'}</p>
            <p class="due-date">Due: ${dueDateFormatted}</p>
            <div class="actions">
                <button class="complete-btn">${task.completed ? 'Undo' : 'Complete'}</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;

        // Add event listeners for buttons
        const completeBtn = taskElement.querySelector('.complete-btn');
        const deleteBtn = taskElement.querySelector('.delete-btn');

        completeBtn.addEventListener('click', () => toggleComplete(task.id));
        deleteBtn.addEventListener('click', () => deleteTask(task.id));

        // Add to container
        tasksContainer.appendChild(taskElement);
    });
}

// Function to toggle task completion
function toggleComplete(id) {
    const task = tasks.find(task => task.id === id);
    if (task) {
        task.completed = !task.completed;
        renderTasks(document.querySelector('.filter-btn.active').dataset.filter);
    }
}

// Function to delete a task
function deleteTask(id) {
    if (confirm('Are you sure you want to delete this task?')) {
        tasks = tasks.filter(task => task.id !== id);
        renderTasks(document.querySelector('.filter-btn.active').dataset.filter);
    }
}

// Function to handle filter button clicks
function handleFilterClick(event) {
    // Remove active class from all buttons
    filterButtons.forEach(btn => btn.classList.remove('active'));
    // Add active class to clicked button
    event.target.classList.add('active');
    // Render tasks with selected filter
    renderTasks(event.target.dataset.filter);
}

// Event listeners
taskForm.addEventListener('submit', addTask);
filterButtons.forEach(btn => btn.addEventListener('click', handleFilterClick));

// Initial render
renderTasks();