require('dotenv').config();
const axios = require('axios');

module.exports = function (client) {
  const subscribeToChannel = (channel) => {
    client.subscribe(channel, (err) => {
      if (err) {
        console.log(`💢| Error suscribiéndose a ${channel}`);
        console.log(err);
      }
      else {
        console.log(`✅ | Suscrito a ${channel}`)
      }
    });
  };
  
  client.on('error', (err) => {
    console.log('💢| Error conectándose al broker MQTT.');
    console.log(err);
  });
  
  client.on('connect', () => {
    console.log("🔗| Conexión al broker MQTT activa");
    
    // Suscribirse a los canales usando la función
    [process.env.MQTT_API_INFO_CHANNEL, process.env.MQTT_API_VALIDATION_CHANNEL, process.env.MQTT_API_REQUEST_CHANNEL].forEach(subscribeToChannel);
  });
  
  client.on('message', async (topic, message) => {
    let msg = message.toString();
    
    // Dirigir el post en función de canal al que se suscribió
    const topicToApiPath = {
      [process.env.MQTT_API_INFO_CHANNEL]: '/stocks',
      [process.env.MQTT_API_VALIDATION_CHANNEL]: '/validations',
      [process.env.MQTT_API_REQUEST_CHANNEL]: '/requests'
    };
    
    const apiPath = topicToApiPath[topic];
    
    if (!apiPath) {
      console.log("🤷| Tópico desconocido:", topic);
      return;
    }
    
    const url = `${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}${apiPath}`;
    
    let data = {}
    
    if (topic === process.env.MQTT_API_INFO_CHANNEL) {
      // Si es de stocks/info debe ir con message.
      // ... está hardcodeado
      data = {message: msg};
      
    } else {
      // ... caso contraro, va como JSON.
      // ... caso genérico
      msg = JSON.parse(message.toString());
      data = msg;
    }
    
    try {
      console.log(`📨| Enviando datos a ${url}`);
      const response = await axios.post(url, data);
      console.log("📫| Se recibió respuesta", response.data);
    } catch (error) {
      console.log(`⛔ | Error enviando datos a ${url}`);
      console.log(error);
    }
  });
};
