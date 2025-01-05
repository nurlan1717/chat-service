import userManager from './userManager.js';

export function setupSocketHandlers(io, socket) {
  console.log('User connected:', socket.id);

  socket.on('user:join', (user) => {
    const activeUsers = userManager.addUser(socket.id, user);
    io.emit('users:active', activeUsers);
  });

  socket.on('message:private', ({ to, message }) => {
    const timestamp = new Date().toISOString();
    socket.to(to).emit('message:receive', {
      from: socket.id,
      message,
      timestamp
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    const activeUsers = userManager.removeUser(socket.id);
    io.emit('users:active', activeUsers);
  });
}