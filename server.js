const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const wss =  new WebSocket.Server({server});

app.use(cors());
app.use(bodyParser.json());

let salas = [];
let reservas = [];

app.get("/salas", (req,res) => {
    res.json(salas);
});

app.post("/salas", (req,res)=>{
    const sala = req.body;
    salas.push(sala);
    broadcast({action: "add", sala});
    res.status(201).json(sala);
});

app.put('/salas/: id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = salas.findIndex(s => s.id === id);

    if(index === -1) {
        return res.status(404).json({mensaje: "la sala no existe"});
    }

    salas[index] = req.body;
    broadcast({ action: 'update', sala: salas[index] });
    res.json(salas[index]);
});

app.delete('/salas/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = salas.findIndex(s => s.id === id);

    if (index === -1) {
        return res.status(404).json({mensaje: 'sala no existe o no encontrada'});
    }

    const salaEliminada = salas.splice(index, 1)[0];
    broadcast({ action: 'delete', sala: salaEliminada});
    res.json(salaEliminada);
});

//reservas

app.get("/reservas", (req,res) => {
    res.json(reservas);
});

app.post("/reservas", (req,res)=>{
    const sala = req.body;
    reservas.push(reserva);
    broadcast({action: "add", reserva});
    res.status(201).json(reserva);
});

app.put('/reservas/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = reservas.findIndex(r => r.id === id);

    if(index === -1) {
        return res.status(404).json({mensaje: "la reserva no existe"});
    }

    reservas[index] = req.body;
    broadcast({ action: 'update', reserva: reservas[index] });
    res.json(reservas[index]);
});

app.delete('/reservas/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = reservas.findIndex(r => r.id === id);

    if (index === -1) {
        return res.status(404).json({mensaje: 'la reserva no existe o no encontrada'});
    }

    const reservaEliminada = reservas.splice(index, 1)[0];
    broadcast({ action: 'delete', reserva: reservaEliminadaEliminada});
    res.json(reservaEliminadaEliminada);
});

wss.on('connection', (ws) => {
    console.log('Conectado');

    ws.on('close', () => {
        console.log('Desconectdo');
    });
});

function broadcast(data) {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN){
            client.send(JSON.stringify(data));
        }
    });
}

const PORT = 3500; 
server.listen(PORT, () => {
    console.log(`servidor escuchando en http://localhost:${PORT}`)
});

