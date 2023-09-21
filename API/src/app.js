require('dotenv').config();
const express = require('express');
const stockRoutes = require('./routes/stock.routes');
const userRoutes = require('./routes/user.routes');
const validationRoutes = require('./routes/validation.routes');
const requestRoutes = require('./routes/request.routes');
// const syncDatabase = require('./db/syncDatabase') // 👈🏻

const cors = require('cors');
const app = express();

app.use(cors());

app.use(express.json());
app.use('/stocks', stockRoutes);
app.use('/users', userRoutes);
app.use('/validations', validationRoutes);
app.use('/requests', requestRoutes);

module.exports = app;
