const API_URL = `http://localhost:3500/reservas`;
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
                addUserToTable(message.reserva);
                break;
            case 'update' :
                updateUserIntable(message.reserva);
                break;
            case 'delete':
                removeUserFromTable(message.reserva.id);
                break;
        }
    });

    socket.addEventListener('close', () => {
        console.log('desconectado del servidor WS');
        setTimeout(initWebSocket, 5000);
    });
}

async function loadreservas() {
    try {
        const response = await fetch(API_URL);
        const reservas = await response.json();

        const reservasList = document.getElementById('resarvas-list');
        reservasList.innerHTML = '';

        salas.forEach(addUserToTable);         
    } catch (error) {
        alert('Error al cargar : ' + error.message);
    }
}

function addUserToTable(reserva) {
    const reservasList = document.getElementById('reservas-list');
    const row = document.createElement('tr');

    row.setAttribute('data-id', reserva.id);
    row.innerHTML = `
        <td>${reserva.id}</td>
        <td>${reserva.nombre}</td>
        <td>${reserva.rol}</td> 
        <td>
            <button onclick="editUser(${reserva.id})">Edita</button>
            <button onclick="deleteUser(${reserva.id})">Elimina</button>
        </td>
        `;

        salasList.appendChild(row);
}

function updateUserIntable(reserva) {
    const row = document.querySelector(`tr[data-id="${reserva.id}"]`);
    if (row) {
        row.children[1].textContent = reserva.nombre;
        row.children[2].textContent = reserva.rol;
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

    const id = document.getElementById('user-id').value;
    const nombre = document.getElementById('user-name').value;
    const rol = document.getElementById('user-role').value;

    if (!id || !nombre || !rol) {
        alert('por favor, completa todos los campos. ');
        return;
    }
    
    const sala = { id: parseInt(id), nombre, rol };

    try {
        if(editingUserId) {
            const response = await fetch (`${API_URL}/${editingUserId}`, {
                method: 'PUT',
                headers: {
                    'content-Type': 'application/json',
                },
                body: JSON.stringify(reserva),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.mensaje);
        }

        alert('reserva actualizada correctamente');
        editingUserId = null; 
      } else {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(reserva),
        });
  
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.mensaje);
        }
  
        alert('reserva guardada correctamente');
      }
  
      document.getElementById('user-form').reset();
    } catch (error) {
      alert('Error al guardar la reserva: ' + error.message);
    }
  }
  
  function editUser(id) {
    const sala = Array.from(document.querySelectorAll('#user-list tr')).find(
      (row) => parseInt(row.children[0].textContent) === id
    );
  
    if (sala) {
      document.getElementById('user-id').value = usuario.children[0].textContent;
      document.getElementById('user-name').value = usuario.children[1].textContent;
      document.getElementById('user-role').value = usuario.children[2].textContent;
  
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