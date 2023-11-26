/* ------------------------------------------------------ */
// Añadir módulos de websocket
const { WebSocketServer } = require('ws');
const http = require('http');
/* ------------------------------------------------------ */

const app = require('./app');

const port = process.env.API_PORT || 8000;

/* ------------------------------------------------------ */
// Spinning the HTTP server and the WebSocket server.
// Crear el servidor HTTP con la aplicación Express
const server = http.createServer(app);
// Configurar el servidor WebSocket para utilizar el mismo servidor HTTP
const wsServer = new WebSocketServer({ server });


wsServer.on('connection', (ws) => {
  // Manejar los eventos de WebSocket
  console.log('Cliente WebSocket conectado');
  // --> AQUÍ <--
});

/* ------------------------------------------------------ */

// // eslint-disable-next-line
// process.env.NODE_ENV === 'test' ? null : app.listen(port, () => {
//   console.log(`🚀| Servidor corriendo en http://localhost:${port}`);
// });

// Iniciar el servidor HTTP y WebSocket
server.listen(port, () => {
  console.log(`Servidor Express y WebSocket corriendo en el puerto ${port}`);
});
