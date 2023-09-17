const db = require('../../models');

const User = db.user;

const postUser = async (req, res) => {
  try {
    const user = await User.create(req.body);

    res.status(201).json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUsers = async (req, res) => {
  console.log('📠| GET request recibida a /users');

  const page = Math.max(1, req.query.page) || 1;
  const size = Math.max(1, req.query.size) || 25;

  try {
    const users = await User.findAll({
      limit: size,
      offset: (page - 1) * size,
    });

    if (users.length > 0) {
      res.status(200).json({ users });
    } else {
      res.status(404).json({ message: 'No users found' });
    }
  } catch (error) {
    res.status(500).json({ error });
  }

  console.log('📞| Fin del mensaje a /users');
};

const getUser = async (req, res) => {
  console.log('📠| GET request recibida a /users/:id');

  try {
    const { id } = req.params;
    const user = await User.findOne({
      where: {
        id,
      },
    });

    if (user) {
      res.status(200).json({ user });
    } else {
      res.status(404).json({ message: 'No user found' });
    }
  } catch (error) {
    res.status(500).json({ error });
  }

  console.log('📞| Fin del mensaje a /users/:id');
};

const postIncreaseWallet = async (req, res) => {
  const { amount } = req.body;

  try {
    const { id } = req.params;

    const user = await User.findOne({
      where: {
        id,
      },
    });

    const new_amount = parseFloat(user.cash) + parseFloat(amount);

    const updatedValues = {
      cash: new_amount,
    };

    const [, [updatedUser]] = await User.update(updatedValues, {
      where: {
        id,
      },
      returning: true,
    });

    res.status(201).send(`Wallet increased to ${updatedUser.cash} to user ${id}`);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getUsers,
  getUser,
  postUser,
  postIncreaseWallet,
};
