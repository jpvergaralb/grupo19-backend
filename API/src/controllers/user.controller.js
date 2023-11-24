const db = require('../../models');
const allowedAdminEmails = require('../../config/adminList');

const User = db.user;

const postUser = async (req, res) => {
  try {
    const user = await User.create(req.body);

    res.status(201).json({ user });
  } catch (error) {
    console.log(error);
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

const getUserByAuthId = async (req, res) => {
  console.log('📠| GET request recibida a /users/auth/:id');

  try {
    const { id } = req.params;
    const user = await User.findOne({
      where: {
        auth0Id: id,
      },
    });

    if (user) {
      res.status(200).json({ foundUser: true, user });
    } else {
      res.status(200).json({ foundUser: false });
    }
  } catch (error) {
    res.status(500).json({ error });
  }

  console.log('📞| Fin del mensaje a /users/:id');
};

const getUserRequests = async (req, res) => {
  console.log('📠| GET request recibida a /users/:id/requests');

  try {
    const { id } = req.params;
    const user = await User.findOne({
      where: {
        id,
      },
    });

    if (user) {
      const requests = await user.getRequests();
      res.status(200).json({ requests });
    } else {
      res.status(404).json({ message: 'No user found' });
    }
  } catch (error) {
    res.status(500).json({ error });
  }

  console.log('📞| Fin del mensaje a /users/:id/requests');
};

const getUserPredictions = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: 'Missing parameters: id.' });
  }

  try {
    const user = await User.findByPk(id);
    if (user) {
      const predictions = await user.getPredictions({
        attributes: { exclude: ['data'] },
      });
      return res.status(200).json({ predictions });
    }
    return res.status(404).json({ message: 'No user found' });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

const postUpdateWallet = async (req, res) => {
  const { amount } = req.body;
  const { id } = req.params;

  if (!amount || !id || Number.isNaN(amount)) {
    return res.status(400).json({ message: 'Missing parameters: either id or amount.' });
  }

  try {
    const user = await User.findOne({ where: { id } });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    let newAmount;
    try {
      newAmount = parseFloat(user.cash) + parseFloat(amount);
    } catch (err) {
      return res.status(400).json({ message: 'Invalid amount or user cash value.' });
    }

    if (newAmount < 0) {
      return res.status(400).json({ message: 'Not enough cash to complete this operation.' });
    }

    const updatedValues = { cash: newAmount };
    const [, [updatedUser]] = await User.update(updatedValues, {
      where: { id },
      returning: true,
    });

    return res.status(200).json({
      message: `Wallet updated from ${user.cash} to ${updatedUser.cash} to user ${id}`,
      currentBalance: updatedUser.cash,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const updateUsersPhone = async (req, res) => {
  const { auth0Id, phone } = req.body;

  if (!auth0Id || !phone) {
    return res.status(400).json({ message: 'Missing parameters: either auth0Id or phone.' });
  }

  try {
    const user = await User.findOne({ where: { auth0Id } });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const updatedValues = { phone };
    const [, [updatedUser]] = await User.update(updatedValues, {
      where: { auth0Id },
      returning: true,
    });

    return res.status(200).json({
      message: `Phone updated from ${user.phone} to ${updatedUser.phone} to user ${auth0Id}`,
      currentPhone: updatedUser.phone,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const updateUserRole = async (req, res) => {
  try {
    console.log(allowedAdminEmails);
    const { id } = req.params;
    const user = await User.findOne({
      where: {
        id,
      },
    });
    if (user && allowedAdminEmails.includes(user.email)) {
      const updatedUser = await user.update({ role: 'admin' });
      res.status(200).json({ updatedUser });
    } else {
      res.status(401).json({ message: 'User not allowed.' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

module.exports = {
  getUsers,
  getUser,
  getUserByAuthId,
  getUserRequests,
  getUserPredictions,
  postUser,
  postUpdateWallet,
  updateUserRole,
  updateUsersPhone,
};
