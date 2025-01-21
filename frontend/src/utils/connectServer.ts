import { io } from "socket.io-client"

export const connectServer = io('http://localhost:3001');
