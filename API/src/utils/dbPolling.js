// TODO:Remove

const express = require('express');
const db = require('../../models');

let lastKnownRow = null;
let myTable = db.ourStocks;

async function pollDatabase(wss) {
  try {
    // Consulta la última fila de la tabla
    const latestRow = await myTable.findOne({ order: [['createdAt', 'DESC']] });
    
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
// setInterval(pollDatabase, 1000);

module.exports = pollDatabase;
