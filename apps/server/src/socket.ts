import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';

let io: SocketIOServer;

export function initializeSocket(httpServer: HTTPServer): SocketIOServer {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  io.on('connection', (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    // ---- Lobby Events ----
    socket.on('lobby:create', (data) => {
      const roomCode = generateRoomCode();
      socket.join(roomCode);
      socket.emit('lobby:update', {
        code: roomCode,
        players: [{ id: socket.id, ...data }],
        status: 'WAITING',
      });
      console.log(`🏠 Room created: ${roomCode}`);
    });

    socket.on('lobby:join', (roomCode: string) => {
      const room = io.sockets.adapter.rooms.get(roomCode);
      if (room) {
        socket.join(roomCode);
        io.to(roomCode).emit('lobby:update', {
          code: roomCode,
          players: Array.from(room),
          status: 'WAITING',
        });
        console.log(`👤 Player joined room: ${roomCode}`);
      } else {
        socket.emit('error', { message: 'Room not found' });
      }
    });

    socket.on('lobby:ready', (roomCode: string) => {
      io.to(roomCode).emit('lobby:player_ready', { playerId: socket.id });
    });

    socket.on('lobby:leave', (roomCode: string) => {
      socket.leave(roomCode);
      io.to(roomCode).emit('lobby:player_left', { playerId: socket.id });
    });

    // ---- Game Events ----
    socket.on('game:place_system', (data) => {
      const rooms = Array.from(socket.rooms).filter(r => r !== socket.id);
      rooms.forEach(room => {
        socket.to(room).emit('game:system_placed', {
          playerId: socket.id,
          ...data,
        });
      });
    });

    socket.on('game:launch_threat', (data) => {
      const rooms = Array.from(socket.rooms).filter(r => r !== socket.id);
      rooms.forEach(room => {
        socket.to(room).emit('game:threat_launched', {
          playerId: socket.id,
          ...data,
        });
      });
    });

    socket.on('game:state_update', (data) => {
      const rooms = Array.from(socket.rooms).filter(r => r !== socket.id);
      rooms.forEach(room => {
        socket.to(room).emit('game:state_update', data);
      });
    });

    // ---- Chat ----
    socket.on('chat:message', (data) => {
      const rooms = Array.from(socket.rooms).filter(r => r !== socket.id);
      rooms.forEach(room => {
        io.to(room).emit('chat:message', {
          ...data,
          senderId: socket.id,
          timestamp: Date.now(),
        });
      });
    });

    // ---- Disconnect ----
    socket.on('disconnect', (reason) => {
      console.log(`🔌 Client disconnected: ${socket.id} (${reason})`);
    });
  });

  return io;
}

export function getIO(): SocketIOServer {
  if (!io) throw new Error('Socket.IO not initialized');
  return io;
}

function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}
