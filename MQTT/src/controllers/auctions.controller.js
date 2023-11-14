function publishDataMQTT(client, request) {
  console.log("📰| Publicando datos al auctions del broker MQTT...");
  client.publish(process.env.MQTT_API_AUCTIONS_CHANNEL,
    JSON.stringify(request))
  console.log("🎄| Publicación de datos al auctions del broker MQTT finalizada...");
}

const postOfferToMQTT = async (req, res) => {
  try {
    console.log(req.body)
    const mqttClient = req.mqttClient;
    const response = publishDataMQTT(mqttClient, req.body);
    res.status(200).json(response)
  } catch (error) {
    
  }
}

const postProposalToMQTT = async (req, res) => {
  try {
    console.log(req.body)       
    const mqttClient = req.mqttClient;
    const response = publishDataMQTT(mqttClient, console.log(req.body));
    res.status(200).json(response)
  } catch (error) {
    
  }
}

module.exports = {
  postOfferToMQTT,
  postProposalToMQTT,
}
