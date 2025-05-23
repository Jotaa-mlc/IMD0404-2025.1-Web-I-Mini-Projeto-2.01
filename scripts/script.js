class Task {
    static PRIORITY = {
        alta: 'Alta',
        media: 'Média',
        baixa: 'Baixa'
    };

    constructor(id, title, description, comment, date, priority, notification, completed = false) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.comment = comment;
        this.date = new Date(date);
        this.createdAt = new Date();
        this.priority = priority;
        this.notification = notification;
        this.completed = completed;
    }

    static comparePriorities(a, b) {
        const priorities = ['Alta', 'Média', 'Baixa'];
        return priorities.indexOf(a.priority) - priorities.indexOf(b.priority);
    }
}

const taskList = document.getElementById('task-list');
const addTaskButton = document.getElementById('add-task-button');
const orderBySelector = document.getElementById('order-select');

const tasks = [];
const test = true;
if (test) {
    console.log('Test mode is enabled');
    tasks.push(new Task('1', 'Tarefa 1', 
        'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Praesentium rerum a debitis possimus. Optio dicta ullam voluptatibus neque, eaque rerum vel dolore fuga quaerat sequi delectus cumque nobis iure cupiditate!'.repeat(8), 
        'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Praesentium rerum a debitis possimus. Optio dicta ullam voluptatibus neque, eaque rerum vel dolore fuga quaerat sequi delectus cumque nobis iure cupiditate!'.repeat(8), 
        '2025-05-29T10:00:00', Task.PRIORITY.alta, true, true));
    tasks.push(new Task('2', 'Tarefa 2', 'Descrição da tarefa 2', 'Comentário da tarefa 2', '2025-05-19T10:00:00', Task.PRIORITY.media, false, true));
    tasks.push(new Task('3', 'Tarefa 3', 'Descrição da tarefa 3', 'Comentário da tarefa 3', '2025-05-25T10:00:00', Task.PRIORITY.baixa, true));
    tasks.push(new Task('4', 'Tarefa 4', 'Descrição da tarefa 4', 'Comentário da tarefa 4', '2025-05-17T10:00:00', Task.PRIORITY.alta, false));
    tasks[2].createdAt = new Date('2025-05-09T12:00:00');
    tasks[0].createdAt = new Date('2025-05-10T10:00:00');
    tasks[3].createdAt = new Date('2025-05-11T13:00:00');
    tasks[1].createdAt = new Date('2025-05-12T11:00:00');
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
                <div class="mb-3">
                    <label for="task-comment" class="form-label">Comentário</label>
                    <textarea class="form-control" id="task-comment" rows="2"></textarea>
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

function renderTasks() {
    console.log('Rendering tasks...');
    console.log('Tasks:', tasks);
    sortTasks()
    taskList.innerHTML = '';
    if (tasks.length === 0) {
        const emptyListMessage = document.createElement('li');
        emptyListMessage.className = 'empty-list-message';
        emptyListMessage.innerHTML = `
        <img src="../img/empty-list.png" alt="Lista vazia" id="empty-list-icon">
        <p id="empty-list-text">Nenhuma tarefa cadastrada</p>
        `;
        taskList.appendChild(emptyListMessage);
    }
    for (let index = 0; index < tasks.length; index++) {
        const taskItem = document.createElement('li');
        const task = tasks[index];
        taskItem.innerHTML = `
            <div id="task-${task.id}" class="task-item">
                <div class="task-main">
                    <div class="task-header">
                        <h3>${task.title}</h3>
                        <img src="../img/notification-${task.notification ? 'on' : 'off'}.svg" alt="Notificação" class="notification-icon">
                    </div>
                    <div class="task-text">
                        <p>${task.description}</p>
                    </div>
                </div>
                <div class="task-expand">
                    <hr>
                    <span><strong>Criada em: </strong></span>
                    <span class="task-created-date">${task.createdAt.toLocaleDateString('pt-BR')} às ${task.createdAt.toTimeString().split(' ')[0]}</span>
                    <hr>
                    <p>Comentário: </p>
                    <div class="task-text">
                        <p>${task.comment}</p>
                    </div>
                </div>
                <div class="task-footer">
                    <button class="btn btn-light"><img src="../img/edit.svg" alt="Editar tarefa" class="edit-task-button"></button>
                    <button class="btn btn-light"><img src="../img/trash.svg" alt="Excluir tarefa" class="delete-task-button"></button>
                    <div>
                        <img src="../img/sort-descending.svg" alt="Prioridade" class="priority-icon">
                        <span class="priority-text">${task.priority}</span>
                    </div>
                    <div>
                        <img src="../img/clock.svg" alt="Data de entrega" class="due-date-icon">
                        <span class="due-date-text">${task.date.toLocaleDateString('pt-BR')}</span>
                    </div>
                    <button class="btn btn-light"><img src="../img/dropdown-arrow.png" alt="Expandir" class="toggle-expand-task-button"></button>
                </div>
            </div>
        `;
        taskList.appendChild(taskItem);
    };
    localStorage.setItem('taskListJSON', JSON.stringify(tasks));
}

function sortTasks() {
    var orderBy = orderBySelector.value;
    if (orderBy === 'prioridade') {
        tasks.sort(Task.comparePriorities);
    } else if (orderBy === 'dt-tarefa') {
        tasks.sort((a, b) => a.date - b.date);
    } else if (orderBy === 'dt-criacao') {
        tasks.sort((a, b) => a.createdAt - b.createdAt);
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
    const comment = document.getElementById('task-comment').value;
    const taskComment = comment ? comment : 'Sem comentários';
    const date = document.getElementById('task-date').value;
    const priority = document.getElementById('task-priority').value;
    const notification = document.getElementById('task-notification').checked;

    const task = new Task(taskId, title, description, taskComment, date, priority, notification);
    tasks.push(task);
    renderTasks();
    closeTaskForm();
}

function gerarIdTarefa() {
    return (Math.floor(Math.random() * 9999) + 1).toString();
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
        document.getElementById('task-date').value = task.date.toLocaleDateString('pt-BR').split('/').reverse().join('-');
        document.getElementById('task-comment').value = task.comment;
        document.getElementById('task-priority').value = task.priority;
        document.getElementById('task-notification').checked = task.notification;
        
        const cancelButton = document.getElementById('cancel-task-button');
        cancelButton.addEventListener('click', closeTaskForm);
        const taskForm = document.getElementById('task-form');
        taskForm.addEventListener('submit', (event) => {
            event.preventDefault();
            task.title = document.getElementById('task-title').value;
            task.description = document.getElementById('task-description').value;
            task.date = new Date(document.getElementById('task-date').value);
            task.priority = document.getElementById('task-priority').value;
            task.notification = document.getElementById('task-notification').checked;
            renderTasks();
            closeTaskForm();
        });
    }
}

function toggleExpandTask(taskItem) {
    const taskExpand = taskItem.querySelector('.task-expand');
    const isExpanded = taskExpand.classList.contains('expanded');
    
    taskExpand.classList.toggle('expanded');
    
    const expandButton = taskItem.querySelector('.toggle-expand-task-button');
    expandButton.src = isExpanded ? '../img/dropdown-arrow.png' : '../img/dropup-arrow.png';
}

// Event listeners
addTaskButton.addEventListener('click', newTask);
orderBySelector.addEventListener('change', renderTasks);

document.getElementById("task-list").addEventListener("click", function(event) {
    if (event.target.classList.contains("delete-task-button")) {
        const taskItem = event.target.closest(".task-item");
        const taskId = taskItem.id.split('-')[1];
        console.log('Deleting task with ID:', taskId);
        const taskIndex = tasks.findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {
            tasks.splice(taskIndex, 1);
            renderTasks();
        }
    }
});

document.getElementById("task-list").addEventListener("click", function(event) {
    if (event.target.classList.contains("edit-task-button")) {
        const taskItem = event.target.closest(".task-item");
        const taskId = taskItem.id.split('-')[1];
        console.log('Editing task with ID:', taskId);
        editTask(taskId);
  }
});

document.getElementById("task-list").addEventListener("click", function(event) {
    if (event.target.classList.contains("toggle-expand-task-button")) {
        const taskItem = event.target.closest(".task-item");
        toggleExpandTask(taskItem);
  }
});

document.addEventListener('click', function(event) {
    const taskItem = event.target.closest('.task-item');
    if (!taskItem) return;
    if (event.target.closest('button')) return;

    const taskId = taskItem.id.split('-')[1];
    console.log("Redirecting to:", `/pages/task.html?id=${taskId}`);
    window.open(`/pages/task.html?id=${taskId}`, '_blank');
    event.preventDefault();
});