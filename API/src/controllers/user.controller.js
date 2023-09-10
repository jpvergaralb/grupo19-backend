const User = require('../models/user.model');

const postUser = async (req, res) => {
    const {username, password, email, firstName, lastName, phone} = req.body;

    try {
        const user = await User.create({
            username,
            password,
            email,
            firstName,
            lastName,
            phone
        })

        res.status(201).json({user})
        
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}



module.exports = {
    postUser
}
