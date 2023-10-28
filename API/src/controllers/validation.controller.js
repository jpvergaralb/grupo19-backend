const db = require('../../models');

const Validation = db.validation;
const { sequelize } = db;

const getValidations = async (req, res) => {
  console.log('📠| GET request recibida a /validations');

  const page = Math.max(1, req.query.page) || 1;
  const size = Math.max(1, req.query.size) || 25;
  const offset = (page - 1) * size;

  try {
    const validations = await Validation.findAll({
      limit: size,
      offset,
    });

    if (validations.length > 0) {
      res.status(200).json({ validations });
    } else {
      res.status(404).json({ message: 'No validations found' });
    }
  } catch (error) {
    res.status(500).json({ error });
  }

  console.log('📞| Fin del mensaje a /validations');
};

const getValidationsByGroup = async (req, res) => {
  console.log('📠| GET request recibida a /validations/group/:group');

  const page = Math.max(1, req.query.page) || 1;
  const size = Math.min(1, req.query.size) || 25;
  const offset = (page - 1) * size;

  try {
    const { group } = req.params;
    const validations = await Validation.findAll({
      where: {
        group_id: group,
      },
      limit: size,
      offset,
    });

    if (validations.length > 0) {
      res.status(200).json({ validations });
    } else {
      res.status(404).json({ message: 'No validations found' });
    }
  } catch (error) {
    res.status(500).json({ error });
  }

  console.log('📞| Fin del mensaje a /validations/group/:group');

  return null;
};

const getValidationsBySeller = async (req, res) => {
  console.log('📠| GET request recibida a /validations/seller/:seller');

  const page = Math.max(1, req.query.page) || 1;
  const size = Math.min(1, req.query.size) || 25;
  const offset = (page - 1) * size;

  try {
    const { seller } = req.params;

    const validations = await Validation.findAll({
      where: {
        seller: parseInt(seller, 10),
      },
      limit: size,
      offset,
    });

    if (validations.length > 0) {
      res.status(200).json({ validations });
    } else {
      res.status(404).json({ message: 'No validations found' });
    }
  } catch (error) {
    res.status(500).json({ error });
  }

  console.log('📞| Fin del mensaje a /validations/seller/:seller');
  return null;
};

const getValidationsByValid = async (req, res) => {
  console.log('📠| GET request recibida a /validations/valid/:is_valid');

  // http(s)://host:port/validation/valid/is_valid=<true/false>
  const page = Math.max(1, req.query.page) || 1;
  const size = Math.min(1, req.query.size) || 25;
  const offset = (page - 1) * size;

  try {
    const { is_valid } = req.params;
    let validations = [];

    if (is_valid.toLowerCase() !== 'true' && is_valid.toLowerCase() !== 'false') {
      return res.status(400).json({ message: "Invalid value for is_valid. Must be 'true' or 'false'" });
    } if (is_valid.toLowerCase() === 'true') {
      validations = await Validation.findAll({
        where: {
          valid: true,
        },
        limit: size,
        offset,
      });
    } else {
      validations = await Validation.findAll({
        where: {
          valid: false,
        },
        limit: size,
        offset,
      });
    }

    if (validations.length > 0) {
      res.status(200).json({ validations });
    } else {
      res.status(404).json({ message: 'No validations found' });
    }
  } catch (error) {
    res.status(500).json({ error });
  }

  console.log('📞| Fin del mensaje a /validations/valid/:is_valid');
  return null;
};

const postValidation = async (req, res) => {
  console.log('📠| POST request recibida a /validations');
  const transaction = await sequelize.transaction();
  try {
    const validation = req.body;

    if (!validation) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Request body is missing. Rolling back ...' });
    }

    if (validation.valid === null) {
      return res.status(400).json({ message: 'Null recieved on valid status.' });
    }

    const {
      request_id, group_id, seller, valid,
    } = validation;

    if (!request_id || !group_id || seller === undefined || valid === undefined) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Missing required fields. Rolling back ...' });
    }

    const createdValidation = await Validation.create({
      request_id,
      group_id,
      seller,
      valid,
    }, { transaction });

    if (!createdValidation) {
      await transaction.rollback();
      console.error('Failed to create validation in the database. ');
      return res.status(500).json({ message: 'Failed to register validation. Rolling back ...' });
    }

    const validationRequests = await createdValidation.getRequest({ transaction });
    if (validationRequests) {
      if (valid) {
        await validationRequests.update({ status: 'filled' }, { transaction });
        const requestStock = await validationRequests.getStock({ transaction });
        // const requestUser = await validationRequests.getUser({ transaction });
        // await requestUser.updateBalance(
        //   requestStock.price,
        //   validationRequests.quantity,
        //   transaction,
        // );
        console.log(`😁 | User ${validationRequests.user_id} bought ${validationRequests.quantity}
        stocks of ${requestStock.symbol} @ ${requestStock.price}$ 
        (total: ${validationRequests.quantity * requestStock.price}$)`);
      } else {
        await validationRequests.update({ status: 'cancelled' }, { transaction });
      }
    } else {
      console.log('🤔 | This request comes from another group.');
      await transaction.commit();
      return res.status(201).json({ message: 'This request comes from another group.' });
    }

    await transaction.commit();
    res.status(201).json({ message: `Validation ${request_id} (group ${group_id}) changed to status: ${validationRequests.status}` });
  } catch (error) {
    await transaction.rollback();
    console.error('Error in postValidation:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }

  console.log('📞| Fin del mensaje a /validations/');
  return null;
};

module.exports = {
  getValidations,
  getValidationsByGroup,
  getValidationsBySeller,
  getValidationsByValid,
  postValidation,
};
