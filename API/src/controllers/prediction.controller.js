const { Op } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const db = require('../../models');

const Validation = db.validation;

const makePrediction = async (req, res) => {
  const { timeFrame, symbol } = req.query;

  if (!timeFrame || !symbol) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  try {
    // eslint-disable-next-line no-use-before-define
    const amountValidated = await getValidatedPurchasesCount(symbol);
    // eslint-disable-next-line no-use-before-define
    const jobId = uuidv4();

    // calculate starting date in ISO8601 format
    const endDate = new Date();
    const startingDate = new Date();
    startingDate.setDate(endDate.getDate() - timeFrame);
    // axios.post('http://workers:7777/path', { stocks, validatedPurchasesCount })
    return res.status(200).json({
      jobId, symbol, amountValidated, startingDate,
    });
  } catch (error) {
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
