const db = require('../../models');
const { use } = require('../routes/auctions.routes');

const User = db.user;

const checkAdmin = async (req, res, next) => {
  console.log('👮‍♂️👮‍♂️👮‍♂️👮‍♂️👮‍♂️ | Checking admin');
  try {
    let { user_id } = req.body.data || req.body;
    if (!user_id) {
      console.log(req.query, req.body);
      user_id = req.query.user_id;
      console.log(`📝 | user_id from query: ${user_id}`);
    }
    console.log(user_id)

    if (!user_id) {
      return res.status(403).json({ message: 'missing user_id in body or user-id in query' });
    }
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    console.log('👮‍♂️👮‍♂️👮‍♂️👮‍♂️👮‍♂️ | Admin checked, you can pass');
    next();
  } catch (error) {
    console.log('👮‍♂️👮‍♂️👮‍♂️👮‍♂️👮‍♂️ | Error checking admin');
    console.error(error);
  }
};
exports.checkAdmin = checkAdmin;
