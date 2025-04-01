const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// En développement, on laisse Vite gérer le frontend
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
}

// Gestion des connexions Socket.IO
io.on('connection', (socket) => {
  console.log('Un nouveau client est connecté');

  socket.on('joinGame', (role) => {
    socket.role = role; // 'bomb' ou 'manual'
    socket.join(role);
    console.log(`Un joueur a rejoint le jeu en tant que ${role}`);
  });

  socket.on('updateBombState', (state) => {
    socket.to('manual').emit('bombStateUpdate', state);
  });

  socket.on('disconnect', () => {
    console.log('Un client est déconnecté');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
}); 