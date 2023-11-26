/* ------------------------------------------------------ */
// Añadir módulos de websocket
const { WebSocketServer } = require('ws');
const pollDatabase = require('./utils/dbPolling');
const http = require('http');

const { uuidv4 } = require('uuid');
/* ------------------------------------------------------ */

const app = require('./app');

const port = process.env.API_PORT || 8000;

/* ------------------------------------------------------ */
// Spinning the HTTP server and the WebSocket server.
// Crear el servidor HTTP con la aplicación Express
const server = http.createServer(app);
// Configurar el servidor WebSocket para utilizar el mismo servidor HTTP
const wsServer = new WebSocketServer({ server });

// I'm maintaining all active connections in this object
const clients = {};

wsServer.on('connection', (connection) => {
  // Manejar los eventos de WebSocket
  console.log('Cliente WebSocket conectado');
  // Generate a unique code for every user
  const userId = uuidv4();
  console.log(`Recieved a new connection.`);
  
  // Store the new connection and handle messages
  clients[userId] = connection;
  console.log(`${userId} connected.`);
  // --> AQUÍ <--
  
});



/* ------------------------------------------------------ */

// // eslint-disable-next-line
// process.env.NODE_ENV === 'test' ? null : app.listen(port, () => {
//   console.log(`🚀| Servidor corriendo en http://localhost:${port}`);
// });

// Iniciar el servidor HTTP y WebSocket
process.env.NODE_ENV === 'test' ? null : server.listen(port, () => {
  console.log(`🚀| Servidor Express y WebSocket corriendo en el puerto ${port}`);
});
