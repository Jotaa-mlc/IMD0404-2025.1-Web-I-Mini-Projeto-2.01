const tasks = JSON.parse(localStorage.getItem('taskListJSON') || '[]');

function renderTaskDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const taskId = urlParams.get('id');
    const task = tasks.find(task => task.id == taskId);
    console.log(tasks);
    if (task) {
        console.log('Rendering task details for task ID:', taskId);
        document.getElementsByTagName('main')[0].classList.add('task-item');
        document.getElementsByTagName('main')[0].id = `task-${task.id}`;
        document.getElementsByTagName('title')[0].innerText += task.title;

        document.getElementById('task-title').innerText = task.title;
        document.getElementById('notification-icon').src = `../img/notification-${task.notification ? 'on' : 'off'}.svg`;
        document.getElementById('task-description').innerText = task.description;
        document.getElementById('task-comment').innerText = task.comment;
        document.getElementById('task-date').innerText = new Date(task.date).toLocaleDateString('pt-BR');
        document.getElementById('task-created-date').innerText = new Date(task.createdAt).toLocaleDateString('pt-BR');
        document.getElementById('task-priority').innerText = task.priority;

        if (!task.completed) {
            var toDay = new Date();
            var late = task.date < toDay;
            document.getElementById('task-status').innerText = late ? 'Atrasada' : 'Pendente';
            document.getElementById('task-status').style.color = late ? 'red' : 'orange';
        }
        else {
            document.getElementById('task-status').innerText = 'Concluída';
            document.getElementById('task-status').style.color = 'green';
        }
    }
    else {
        console.error(`Task with id = ${taskId} not found`);
        document.getElementById('task-details').innerText = 'Tarefa não encontrada';
    }
}