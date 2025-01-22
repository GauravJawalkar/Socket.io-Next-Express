import express from 'express'
import http from 'http'
import { Server } from 'socket.io'

const app = express();

const server = http.createServer(app);
const PORT = 3001;
const HOSTNAME = "localhost";


const io = new Server(server, {
    cors: {
        origin: "*",
    }
})

io.on('connection', (socket) => {
    // Join room socket event
    socket.on('join-room', ({ roomId, userName }) => {
        // Join the room coming from the frontend
        socket.join(roomId);
        console.log(`User ${userName}.SocketID :${socket.id} joined room with roomId ${roomId}`)
        socket.to(roomId).emit('user-joined', `${userName} joined the room ${roomId}`)
    })

    socket.on('message', ({ roomId, message, sender }) => {
        socket.to(roomId).emit("message", { sender, message })
        console.log(`sender is ${sender} message is ${message}`)
    })

    socket.on("disconnect", () => {
        console.log(`User disconnectes : ${socket.id}`)
    })
})



server.listen(PORT, () => {
    console.log(`Server running at http://${HOSTNAME}:${PORT}`)
})