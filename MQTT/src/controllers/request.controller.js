
const postRequests = async (req, res) => {
  console.log("📠| POST request recibida a /requests")
  
  try {
    const request = req.body;
    
    if (!request) {
      return res.status(400).json({ message: "Request body is missing" });
    }
    
    const { request_id, group_id, symbol, datetime, deposit_token, quantity, seller } = request;
    
    if (
      !request_id ||
      !group_id ||
      !symbol ||
      !datetime ||
      deposit_token === undefined ||
      !quantity ||
      seller === undefined
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    
    await Request.create({
      request_id,
      group_id,
      symbol,
      datetime,
      deposit_token,
      quantity,
      seller,
    });
    
    res.status(201).json({ message: `Request ${request_id} @ ${datetime} created successfully` });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
  
  console.log("📞| Fin del mensaje a /requests")
};




module.exports = {
  postRequests,
}
