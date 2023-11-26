const express = require('express');
const db = require('../../models');
const { Sequelize, Model, DataTypes } = require('sequelize');

let lastKnownRow = null;

async function pollDatabase(wss) {
  try {
    // Consulta la última fila de la tabla
    const latestRow = await MySampleTable.findOne({ order: [['createdAt', 'DESC']] });
    
    // Compara la última fila conocida con la fila actual
    if (!lastKnownRow || lastKnownRow.id !== latestRow.id) {
      // Actualiza la última fila conocida
      lastKnownRow = latestRow;
      
      // Envía los datos a los clientes a través de WebSocket
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(latestRow));
        }
      });
    }
  } catch (error) {
    console.error('Error al realizar polling:', error);
  }
}

// Intervalo de 1 segundo
setInterval(pollDatabase, 1000);
