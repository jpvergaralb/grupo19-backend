require('dotenv').config();
const axios = require('axios');

module.exports = function (client) {
  const subscribeToChannel = (channel) => {
    client.subscribe(channel, (err) => {
      if (err) {
        console.log(`💢 | Error suscribiéndose a ${channel}`, err);
      }
      else {
        console.log(`✅ | Suscrito a ${channel}`)
      }
    });
  };
  
  client.on('error', (err) => {
    console.log('💢 | Error conectándose al broker MQTT.', err);
  });
  
  client.on('connect', () => {
    console.log("🔗 | Conectado exitosamente al broker MQTT");
    
    // Suscribirse a los canales usando la función
    [process.env.CHANNEL, process.env.VALIDATIONS_CHANNEL, process.env.REQUESTS_CHANNEL].forEach(subscribeToChannel);
  });
  
  client.on('message', async (topic, message) => {
    let msg = message.toString();
    
    // Dirigir el post en función de canal al que se suscribió
    const topicToApiPath = {
      [process.env.CHANNEL]: '/stocks',
      [process.env.VALIDATIONS_CHANNEL]: '/validations',
      [process.env.REQUESTS_CHANNEL]: '/requests'
    };
    
    const apiPath = topicToApiPath[topic];
    
    if (!apiPath) {
      console.log("🤷 | Tópico desconocido:", topic);
      return;
    }
    
    const url = `${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.LOCAL_PORT}${apiPath}`;
    
    let data = {}
    
    if (topic === process.env.CHANNEL) {
      data = {message: msg};
      
    } else {
      msg = JSON.parse(message.toString());
      data = msg;
    }
    
    try {
      console.log(`📨 | Posting to ${url}`);
      const response = await axios.post(url, data);
      console.log(response.data);
    } catch (error) {
      console.log(`⛔ | Error posting to ${url}`, error);
    }
  });
};
