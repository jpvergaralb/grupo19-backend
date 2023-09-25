const getMQTT = async (req, res) => {
  console.log("📠| GET request recibida a /")
  
  try {
    res.status(200).json({message: "MQTT Server API (backend)"})
    
  } catch (error) {
    res.status(500).json({error})
  }
  
  console.log("📞| Fin del mensaje a /requests")
}

module.exports = {
  getMQTT
}
