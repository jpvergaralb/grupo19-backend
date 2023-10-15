require('dotenv').config();
const axios = require('axios');

module.exports = function (client) {
  console.log("🖐 | Entrando al handler de MQTT")
  
  let connectionTimeout;
  
  const subscribeToChannel = (channel) => {
    console.log('⌛ | Suscribiéndose a', channel);
    
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
    // Cancelar el timeout, ya que el cliente se ha conectado
    clearTimeout(connectionTimeout);
    
    // Suscribirse a los canales usando la función
    [process.env.MQTT_API_INFO_CHANNEL,
      process.env.MQTT_API_VALIDATION_CHANNEL, 
      process.env.MQTT_API_REQUEST_CHANNEL
    ].forEach(subscribeToChannel);
  });
  
  // Establecer el timeout para verificar la conexión
  connectionTimeout = setTimeout(() => {
    console.log('⏲️| No se pudo conectar al broker MQTT en el tiempo especificado.');
    console.log('🚪| Saliendo de la aplicación');
    process.exit(1)
  }, process.env.MQTT_CONNECTION_TIMEOUT);
  
  client.on('message', async (topic, message) => {
    let msg = message.toString();
    
    // Dirigir el post en función de canal al que se suscribió
    const topicToApiPath = {
      [process.env.MQTT_API_INFO_CHANNEL]: '/stocks',
      [process.env.MQTT_API_VALIDATION_CHANNEL]: '/validations',
      [process.env.MQTT_API_REQUEST_CHANNEL]: '/requests',
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
