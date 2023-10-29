const axios = require('axios');

function publishDataMQTT(client, request) {
	console.log("📰| Publicando datos al broker MQTT...");
	client.publish(process.env.MQTT_API_REQUEST_CHANNEL,
	  JSON.stringify(request))
	console.log("🗞️| Publicación de datos al broker MQTT finalizada...");
  }
  
  
  const postValidations = async (req, res) => {
	console.log("📠| POST request recibida a /validations")
	
	try {
	  const validation = req.body;
	  
	  console.log(validation)
	  
	  if (!validation) {
		return res.status(400).json({ message: "Validation body is missing" });
	  }
  
	  if (
		!(validation.request_id || validation.id) ||
		!validation.group_id ||
		validation.seller === undefined ||
		validation.valid === undefined
	  ) {
		console.log("📠| Missing fields")
		return res.status(400).json({ message: "Missing required fields" });
	  }
	  
	  const validationMessage = {
		request_id: validation.id || validation.request_id,
		group_id: validation.group_id,
		seller: validation.seller,
		valid: validation.valid,
	  }
  
	  const mqttClient = req.mqttClient;
	  
	  publishDataMQTT(mqttClient, validationMessage);

	  const urlApi = `${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}/validations`;
      await axios.post(urlApi, validationMessage);


	  res.status(201).json({ message: `Request ${validation.request_id} from group ${validation.group_id} created successfully` });
	} catch (error) {
	  res.status(500).json({ message: "Internal Server Error from MQTT", error: error.message });
	}
	
	console.log("📞| Fin del mensaje a /validations")
  };
  
  module.exports = {
	postValidations,
  }
  