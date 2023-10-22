const { Op } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const db = require('../../models');

const Validation = db.validation;
const Prediction = db.prediction;
const { sequelize } = db;

const makePrediction = async (req, res) => {
  console.log(` 📠| GET request recibida a /predictions?timeFrame=${req.query.timeFrame}&symbol=${req.query.symbol}`);

  const transaction = await sequelize.transaction();
  const { timeFrame, symbol } = req.query;
  const { userId } = req.body;

  if (!timeFrame || !symbol || !userId) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  try {
    // eslint-disable-next-line no-use-before-define
    const amountValidated = await getValidatedPurchasesCount(symbol);
    // eslint-disable-next-line no-use-before-define
    const jobId = uuidv4();

    const endDate = new Date();
    const startingDate = new Date();
    startingDate.setDate(endDate.getDate() - timeFrame);

    await Prediction.create({
      userId,
      jobId,
      status: 'pending',
    }, { transaction });

    // axios.post('http://workers:7777/path', { stocks, validatedPurchasesCount })
    await transaction.commit();
    return res.status(200).json({
      jobId, symbol, amountValidated, startingDate,
    });
  } catch (error) {
    await transaction.rollback();
    console.log(error);
    return res.status(500).json(error);
  }
};

const getValidatedPurchasesCount = async (symbol) => {
  const endDate = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(endDate.getDate() - 7);

  const validations = await Validation.findAll({
    where: {
      valid: true,
      createdAt: {
        [Op.between]: [sevenDaysAgo, endDate],
      },
    },
  });

  const requests = await Promise.all(validations.map((validation) => validation.getRequest()));
  const validationsRequests = requests.filter((request) => request.symbol === symbol);

  return validationsRequests.length;
};

module.exports = {
  makePrediction,
};
