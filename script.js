document.addEventListener('DOMContentLoaded', () => {
    const registerContainer = document.getElementById('register-container');
    const loginContainer = document.getElementById('login-container');
    const tasksContainer = document.getElementById('tasks-container');

    const showRegisterButton = document.getElementById('show-register-button');
    const backToLoginButton = document.getElementById('back-to-login-button');
    const registerButton = document.getElementById('register-button');
    const loginButton = document.getElementById('login-button');
    const addTaskButton = document.getElementById('add-task-button');
    const logoutButton = document.getElementById('logout-button');

    const registerUsername = document.getElementById('register-username');
    const registerPassword = document.getElementById('register-password');
    const loginUsername = document.getElementById('login-username');
    const loginPassword = document.getElementById('login-password');

    const taskName = document.getElementById('task-name');
    const taskDate = document.getElementById('task-date');
    const tasksList = document.getElementById('tasks-list');

    let users = JSON.parse(localStorage.getItem('users')) || {};
    let currentUser = null;
    let editingTaskIndex = null;

    showRegisterButton.addEventListener('click', () => {
        loginContainer.style.display = 'none';
        registerContainer.style.display = 'block';
    });

    backToLoginButton.addEventListener('click', () => {
        registerContainer.style.display = 'none';
        loginContainer.style.display = 'block';
    });

    registerButton.addEventListener('click', () => {
        const username = registerUsername.value;
        const password = registerPassword.value;
        if (username && password) {
            if (users[username]) {
                alert('El usuario ya existe');
            } else {
                users[username] = { password, tasks: [] };
                localStorage.setItem('users', JSON.stringify(users));
                alert('Usuario registrado con éxito');
                registerContainer.style.display = 'none';
                loginContainer.style.display = 'block';
            }
        } else {
            alert('Por favor complete todos los campos');
        }
    });

    loginButton.addEventListener('click', () => {
        const username = loginUsername.value;
        const password = loginPassword.value;
        if (username && password) {
            if (users[username] && users[username].password === password) {
                currentUser = username;
                loginContainer.style.display = 'none';
                registerContainer.style.display = 'none';
                tasksContainer.style.display = 'block';
                renderTasks();
            } else {
                alert('Usuario o contraseña incorrectos');
            }
        } else {
            alert('Por favor complete todos los campos');
        }
    });

    logoutButton.addEventListener('click', () => {
        currentUser = null;
        tasksContainer.style.display = 'none';
        loginContainer.style.display = 'block';
        loginUsername.value = '';
        loginPassword.value = '';
    });

    addTaskButton.addEventListener('click', () => {
        const name = taskName.value;
        const date = taskDate.value;
        if (name && date) {
            if (editingTaskIndex !== null) {
                users[currentUser].tasks[editingTaskIndex] = { name, date };
                editingTaskIndex = null;
                addTaskButton.textContent = 'Agregar Tarea';
            } else {
                users[currentUser].tasks.push({ name, date });
            }
            localStorage.setItem('users', JSON.stringify(users));
            renderTasks();
            taskName.value = '';
            taskDate.value = '';
        } else {
            alert('Por favor complete todos los campos');
        }
    });

    function renderTasks() {
        tasksList.innerHTML = '';
        users[currentUser].tasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>
                    <strong>${task.name}</strong>
                    <small>${task.date}</small>
                </span>
                <div>
                    <button class="edit-button" onclick="editTask(${index})">Editar</button>
                    <button onclick="deleteTask(${index})">Eliminar</button>
                </div>
            `;
            tasksList.appendChild(li);
        });
    }

    window.editTask = function(index) {
        const task = users[currentUser].tasks[index];
        taskName.value = task.name;
        taskDate.value = task.date;
        editingTaskIndex = index;
        addTaskButton.textContent = 'Guardar Cambios';
    };

    window.deleteTask = function(index) {
        users[currentUser].tasks.splice(index, 1);
        localStorage.setItem('users', JSON.stringify(users));
        renderTasks();
    };
});