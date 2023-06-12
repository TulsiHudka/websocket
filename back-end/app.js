const express = require("express");
const app = express();
// const app = require('express')();
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors')
const bodyParser = require("body-parser");

app.use(cors({
    origin: 'http://localhost:3001',
    methods: ['GET', 'POST']
    // Other options if needed
}));
app.use(bodyParser.json());
app.use(express.json());

app.use((req, res, next) => {
    console.log('hello')
    res.json({ "success": true })
});
const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
        origin: "http://localhost:3001",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });

    // Emit a notification to the client
    const notification = { message: 'New notification' };
    socket.emit('notification', notification);
});

server.listen(3000, () => {
    console.log('WebSocket server is running on http://localhost:3000');
});
