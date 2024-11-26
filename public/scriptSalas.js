const API_URL = `http://localhost:3500/salas`;
const WS_URL = `ws://localhost:3500`;

let editingUserId = null; 
let socket;

function initWebSocket() {
    socket = new WebSocket(WS_URL);

    socket.addEventListener('open', () => {
        console.log('conectado al servidor WebSocket');
    });

    socket.addEventListener('mensaje', (event) => {
        const message = JSON.parse(event.data);

        switch(message, action){
            case 'add':
                addUserToTable(message.sala);
                break;
            case 'update' :
                updateUserIntable(message.sala);
                break;
            case 'delete':
                removeUserFromTable(message.sala.id);
                break;
        }
    });

    socket.addEventListener('close', () => {
        console.log('desconectado del servidor WS');
        setTimeout(initWebSocket, 5000);
    });
}

async function loadsalas() {
    try {
        const response = await fetch(API_URL);
        const salas = await response.json();

        const salasList = document.getElementById('salas-list');
        salasList.innerHTML = '';

        salas.forEach(addUserToTable);         
    } catch (error) {
        alert('Error al cargar salas: ' + error.message);
    }
}

function addUserToTable(sala) {
    const salasList = document.getElementById('salas-list');
    const row = document.createElement('tr');

    row.setAttribute('data-id', sala.id);
    row.innerHTML = `
        <td>${sala.id}</td>
        <td>${sala.estado}</td>
        <td>${sala.capacidad}</td> 
        <td>
            <button onclick="editUser(${sala.id})">Edita</button>
            <button onclick="deleteUser(${sala.id})">Elimina</button>
        </td>
        `;

        salasList.appendChild(row);
}

function updateUserIntable(sala) {
    const row = document.querySelector(`tr[data-id="${sala.id}"]`);
    if (row) {
        row.children[1].textContent = sala.estado;
        row.children[2].textContent = sala.capacidad;
    }
}

function removeUserFromTable(id) {
    const row = document.querySelector(`tr[data-id="${id}"]`);
    if (row) {
        row.remove();
    }
}

async function saveUser(event) {
    event.preventDefault();

    const id = document.getElementById('sala-id').value;
    const estado = document.getElementById('sala-est').value;
    const capacidad = document.getElementById('sala-cap').value;

    if (!id || !estado || !capacidad) {
        alert('por favor, completa todos los campos. ');
        return;
    }
    
    const sala = { id: parseInt(id), estado, capacidad };

    try {
        if(editingUserId) {
            const response = await fetch (`${API_URL}/${editingUserId}`, {
                method: 'PUT',
                headers: {
                    'content-Type': 'application/json',
                },
                body: JSON.stringify(sala),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.mensaje);
        }

        alert('sala actualizada correctamente');
        editingUserId = null; 
      } else {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(sala),
        });
  
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.mensaje);
        }
  
        alert('sala guardada correctamente');
      }
  
      document.getElementById('user-form').reset();
    } catch (error) {
      alert('Error al guardar la sala: ' + error.message);
    }
  }
  
  function editUser(id) {
    const sala = Array.from(document.querySelectorAll('#salas-list tr')).find(
      (row) => parseInt(row.children[0].textContent) === id
    );
  
    if (sala) {
      document.getElementById('user-id').value = usuario.children[0].textContent;
      document.getElementById('user-est').value = usuario.children[1].textContent;
      document.getElementById('user-cap').value = usuario.children[2].textContent;
  
      editingUserId = id; 
    }
  }
  
  async function deleteUser(id) {
    if (!confirm('¿Estás seguro de eliminar este usuario?')) return;
  
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.mensaje);
      }
  
      alert('sala eliminada correctamente');
    } catch (error) {
      alert('Error al eliminar la sala: ' + error.message);
    }
  }
  
  document.getElementById('user-form').addEventListener('submit', saveUser);
  
  initWebSocket();
  loadUsers();