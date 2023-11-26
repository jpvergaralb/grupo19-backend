require('dotenv').config();
const express = require('express');
const cors = require('cors');
const stockRoutes = require('./routes/stock.routes');
const userRoutes = require('./routes/user.routes');
const validationRoutes = require('./routes/validation.routes');
const requestRoutes = require('./routes/request.routes');
const predictionRoutes = require('./routes/prediction.routes');
const auctionRoutes = require('./routes/auctions.routes');
const errorHandler = require('./middlewares/errorhandler.middleware');

/* ------------------------------------------------------ */
// Añadir módulos de websocket
const http = require('http');
const socketIo = require('socket.io');
/* ------------------------------------------------------ */

const app = express();

app.use(cors());
app.use(express.json());
app.use('/stocks', stockRoutes);
app.use('/users', userRoutes);
app.use('/validations', validationRoutes);
app.use('/requests', requestRoutes);
app.use('/predictions', predictionRoutes);
app.use('/auctions', auctionRoutes);
app.use(errorHandler);

/* ------------------------------------------------------ */
const server = http.createServer(app);
const io = socketIo(server); // Instancia de socket.io

/* ------------------------------------------------------ */

module.exports = app;
