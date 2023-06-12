const express = require('express');
const app = express();
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors')
const bodyParser = require("body-parser");

// const server = require('http').createServer(app);
// const io = require('socket.io')(server);

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


io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('/hello', async (requestData) => {
        try {
            console.log("heloooooooo");            // Simulate asynchronous API call
            const response = await someAsyncAPIFunction(requestData);

            // Send the API response back to the client
            socket.emit('response', response);
        } catch (error) {
            console.error('API request failed:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Start the server
const port = 5000;
server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

async function someAsyncAPIFunction(requestData) {
    // Simulate a delay before returning the response
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Process the request and return the response
    return `Response from server: ${requestData.message}`;
}
