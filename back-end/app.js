const express = require("express");
const app = express();
// const app = require('express')();
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors')
const bodyParser = require("body-parser");
const { Pool } = require('pg');

app.use(cors({
    origin: 'http://localhost:3001',
    methods: ['GET', 'POST', 'DELETE']
    // Other options if needed
}));
app.use(bodyParser.json());

const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
        origin: "http://localhost:3001",
        methods: ["GET", "POST", "DELETE"]
    }
});

const pool = new Pool({
    user: 'postgres',
    password: 'postgres',
    host: 'localhost',
    database: 'postgres'
});


io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Notify all clients when users data is updated
    const notifyUsersUpdated = () => {
        io.emit('usersUpdated');
    };

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });

    // Emit a notification to the client
    const notification = { message: 'New notification' };
    socket.emit('notification', notification);
});

app.use(express.json());

app.get('/api/getusers', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM users');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/api/users', async (req, res) => {
    const { name, email } = req.body;

    try {
        await pool.query('INSERT INTO users ( name, email) VALUES ($1, $2)', [name, email]);
        io.emit('usersUpdated'); // Notify all clients about the update
        res.sendStatus(201);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.delete('/api/users/:id', async (req, res) => {
    const id = req.params.id;
    console.log(id);

    try {
        await pool.query('DELETE FROM users WHERE id = $1', [id]);
        io.emit('usersUpdated'); // Notify all clients about the update
        res.sendStatus(200);
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

server.listen(3000, () => {
    console.log('WebSocket server is running on http://localhost:3000');
});
