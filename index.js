import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { PORT, CORS_ORIGIN } from './config.js';
import { setupSocketHandlers } from './socketHandlers.js';

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: CORS_ORIGIN,
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => setupSocketHandlers(io, socket));

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});