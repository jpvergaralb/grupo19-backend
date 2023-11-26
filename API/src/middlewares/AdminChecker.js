const db = require('../../models');

const User = db.user;

const checkAdmin = async (req, res, next) => {
  console.log('👮‍♂️👮‍♂️👮‍♂️👮‍♂️👮‍♂️ | Checking admin');
  try {
    const { user_id } = req.body;
    if (!user_id) {
      return res.status(403).json({ message: 'user_id missing' });
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
