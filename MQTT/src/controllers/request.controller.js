function publishDataMQTT(client, request) {
  console.log("📰| Publicando datos al broker MQTT...");
  client.publish(process.env.MQTT_API_REQUEST_CHANNEL,
    JSON.stringify(request))
  console.log("🗞️| Publicación de datos al broker MQTT finalizada...");
}


const postRequests = async (req, res) => {
  console.log("📠| POST request recibida a /requests")
  
  try {
    const request = req.body;
    
    console.log(request)
    
    if (!request) {
      return res.status(400).json({ message: "Request body is missing" });
    }

    if (
      !(request.request_id || request.id) ||
      !request.group_id ||
      !request.symbol ||
      !request.datetime ||
      request.deposit_token === undefined ||
      !request.quantity ||
      request.seller === undefined
    ) {
      console.log("📠| Missing fields")
      return res.status(400).json({ message: "Missing required fields" });
    }
    
    const buyRequest = {
      request_id: request.id || request.request_id,
      group_id: request.group_id,
      symbol: request.symbol,
      datetime: request.datetime,
      deposit_token: request.deposit_token,
      quantity: request.quantity,
      seller: request.seller,
    }

    const mqttClient = req.mqttClient;
    
    publishDataMQTT(mqttClient, buyRequest);
    res.status(201).json({ message: `Request ${buyRequest.request_id} @ ${buyRequest.datetime} created successfully` });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error from MQTT", error: error.message });
  }
  
  console.log("📞| Fin del mensaje a /requests")
};

module.exports = {
  postRequests,
}
