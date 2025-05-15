class Task {
    static PRIORITY ={
        alta: 'Alta',
        media: 'Média',
        baixa: 'Baixa'
    };

    constructor(id, title, description, date, priority, notification) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.date = date;
        this.createdAt = new Date();
        this.priority = priority;
        this.notification = notification;
        this.completed = false;
    }

    static comparePriorities(a, b) {
        const priorities = ['Alta', 'Média', 'Baixa'];
        return priorities.indexOf(a.priority) - priorities.indexOf(b.priority);
    }
}


const tasks = [];

const taskList = document.getElementById('task-list');
const addTaskButton = document.getElementById('add-task-button');
const orderBySelector = document.getElementById('order-select');

const test = true;
if (test) {
    console.log('Test mode is enabled');
    tasks.push(new Task(1, 'Tarefa 1', 'Descrição da tarefa 1', '2025-10-04', Task.PRIORITY.alta, true));
    tasks.push(new Task(2, 'Tarefa 2', 'Descrição da tarefa 2', '2025-10-03', Task.PRIORITY.media, false));
    tasks.push(new Task(3, 'Tarefa 3', 'Descrição da tarefa 3', '2025-10-02', Task.PRIORITY.baixa, true));
    tasks.push(new Task(4, 'Tarefa 4', 'Descrição da tarefa 4', '2025-10-01', Task.PRIORITY.alta, false));
}

function renderTaskForm() {
    const newTaskDiv = document.createElement('div');
    newTaskDiv.innerHTML = `
    <div id="new-task-form-background">
        <div id="new-task-form">
            <h2 id="task-form-title"></h2>
            <form id="task-form">
                <div class="mb-3">
                    <label for="task-title" class="form-label">Título</label>
                    <input type="text" class="form-control" id="task-title" required>
                </div>
                <div class="mb-3">
                    <label for="task-description" class="form-label">Descrição</label>
                    <textarea class="form-control" id="task-description" rows="3" required></textarea>
                </div>
                <div class="row">
                    <div class="col">
                        <div class="mb-3">
                            <label for="task-priority" class="form-label">Prioridade</label>
                            <select class="form-select" id="task-priority">
                                <option value="Alta">Alta</option>
                                <option value="Média">Média</option>
                                <option value="Baixa">Baixa</option>
                            </select>
                        </div>
                    </div>
                    <div class="col">
                        <div class="mb-3">
                            <label for="task-date" class="form-label">Data de Entrega</label>
                            <input type="date" class="form-control" id="task-date" required>
                        </div>
                    </div>
                    <div class="col" style="align-items: center; display: flex;">
                        <div class="form-check form-switch">
                            <label class="form-check-label" for="task-notification">Notificação</label>
                            <input class="form-check-input" type="checkbox" role="switch" id="task-notification">
                        </div>
                    </div>
                </div>
                <button type="submit" class="btn btn-primary" id="submit-task-button"></button>
                <button type="button" class="btn btn-secondary" id="cancel-task-button">Cancelar</button>
            </form>
        </div>
    </div>
    `;
    document.body.appendChild(newTaskDiv);
    const cancelButton = document.getElementById('cancel-task-button');
    cancelButton.addEventListener('click', closeTaskForm);
}

function closeTaskForm() {
    const newTaskDiv = document.getElementById('new-task-form-background');
    if (newTaskDiv) {
        newTaskDiv.remove();
    }
}

function gerarIdTarefa() {
    return Math.floor(Math.random() * 9999) + 1;
}

function renderTasks() {
    console.log('Rendering tasks...');
    console.log('Tasks:', tasks);
    sortTasks()
    taskList.innerHTML = '';
    if (tasks.length === 0) {
        const emptyListMessage = document.createElement('li');
        emptyListMessage.className = 'empty-list-message';
        emptyListMessage.innerHTML = `
        <img src="img/empty-list.png" alt="Lista vazia" id="empty-list-icon">
        <p id="empty-list-text">Nenhuma tarefa cadastrada</p>
        `;
        taskList.appendChild(emptyListMessage);
    }
    for (let index = 0; index < tasks.length; index++) {
        const taskItem = document.createElement('li');
        taskItem.innerHTML = `
            <div id="${tasks[index].id}" class="task-item">
                <div>
                    <div class="task-header">
                        <h3>${tasks[index].title}</h3>
                        <img src="img/notification-${tasks[index].notification ? 'on' : 'off'}.svg" alt="Notificação" class="notification-icon">
                    </div>
                    <p>${tasks[index].description}</p>
                </div>
                <div class="task-footer">
                    <button class="btn btn-light"><img src="img/edit-ui-svgrepo-com.svg" alt="Editar tarefa" class="edit-task-button"></button>
                    <button class="btn btn-light"><img src="img/delete-2-svgrepo-com.svg" alt="Excluir tarefa" class="delete-task-button"></button>
                    <div>
                        <img src="img/sort-descending-svgrepo-com.svg" alt="Prioridade" class="priority-icon">
                        <span class="priority-text">${tasks[index].priority}</span>
                    </div>
                    <div>
                        <img src="img/clock-two-svgrepo-com.svg" alt="Data de entrega" class="due-date-icon">
                        <span class="due-date-text">${tasks[index].date}</span>
                    </div>
                    <button class="btn btn-light"><img src="img/dropdown-arrow-svgrepo-com.svg" alt="Expandir" class="expand-task-button"></button>
                </div>
            </div>
        `;
        taskList.appendChild(taskItem);
    };
}

function sortTasks() {
    var orderBy = orderBySelector.value;
    if (orderBy === 'prioridade') {
        tasks.sort(Task.comparePriorities);
    } else if (orderBy === 'dt-tarefa') {
        tasks.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (orderBy === 'dt-criacao') {
        tasks.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (orderBy === 'alfabetica') {
        tasks.sort((a, b) => a.title.localeCompare(b.title));
    }
}

function newTask() {
    renderTaskForm();
    document.getElementById('task-form-title').innerText = 'Nova tarefa';
    document.getElementById('submit-task-button').innerText = 'Adicionar';

    const taskForm = document.getElementById('task-form');
    taskForm.addEventListener('submit', (event) => {
        event.preventDefault();
        addTask();
    });
}

function addTask() {
    const taskId = gerarIdTarefa();
    const title = document.getElementById('task-title').value;
    const description = document.getElementById('task-description').value;
    const date = document.getElementById('task-date').value;
    const priority = document.getElementById('task-priority').value;
    const notification = document.getElementById('task-notification').checked;

    if (title && date) {
        const task = new Task(taskId, title, description, date, priority, notification);
        tasks.push(task);
        renderTasks();
        closeTaskForm();
    } else {
        alert('Please fill in all fields.');
    }
}

function editTask(taskId) {
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
        const task = tasks[taskIndex];
        renderTaskForm();
        document.getElementById('task-form-title').innerText = 'Editar tarefa';
        document.getElementById('submit-task-button').innerText = 'Salvar';
        
        document.getElementById('task-title').value = task.title;
        document.getElementById('task-description').value = task.description;
        document.getElementById('task-date').value = task.date;
        document.getElementById('task-priority').value = task.priority;
        document.getElementById('task-notification').checked = task.notification;
        
        const cancelButton = document.getElementById('cancel-task-button');
        cancelButton.addEventListener('click', closeTaskForm);
        const taskForm = document.getElementById('task-form');
        taskForm.addEventListener('submit', (event) => {
            event.preventDefault();
            task.title = document.getElementById('task-title').value;
            task.description = document.getElementById('task-description').value;
            task.date = document.getElementById('task-date').value;
            task.priority = document.getElementById('task-priority').value;
            task.notification = document.getElementById('task-notification').checked;
            renderTasks();
            closeTaskForm();
        });
    }
}

// Event listeners
addTaskButton.addEventListener('click', newTask);
orderBySelector.addEventListener('change', renderTasks);
document.body.addEventListener('onload', renderTasks);

document.getElementById("task-list").addEventListener("click", function(event) {
    if (event.target.classList.contains("delete-task-button")) {
        const item = event.target.closest(".task-item");
        const taskId = parseInt(item.id);
        const taskIndex = tasks.findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {
            tasks.splice(taskIndex, 1);
            renderTasks();
        }
    }
});

document.getElementById("task-list").addEventListener("click", function(event) {
    if (event.target.classList.contains("edit-task-button")) {
        const item = event.target.closest(".task-item");
        const taskId = parseInt(item.id);
        editTask(taskId);
  }
});