const { Op } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const db = require('../../models');

const Validation = db.validation;
const Prediction = db.prediction;
const { sequelize } = db;

const makePrediction = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { timeFrame, symbol } = req.query;
    const { userId } = req.body;

    if (!timeFrame || !symbol || !userId) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    // eslint-disable-next-line no-use-before-define
    const amountValidated = await getValidatedPurchasesCount(symbol);
    const jobId = uuidv4();
    const endDate = new Date();
    const startingDate = new Date();
    startingDate.setDate(endDate.getDate() - timeFrame);

    await Prediction.create({
      userId,
      jobId,
      status: 'pending',
      prediction: -1,
      timeFrame,
      data: '',
      symbol,
    }, { transaction });

    const body = {
      jobId, symbol, amountValidated, startingDate,
    };
    const response = await axios.post(process.env.WORKERS_API_JOB_URL, body);

    if (response.status === 201) {
      res.status(200).json({ response: response.data, message: 'Prediction created successfully. Now polling for results.' });
      // eslint-disable-next-line no-use-before-define
      getPredictionPolling(jobId);
      return await transaction.commit();
    }
    throw new Error('Error creating prediction');
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    return res.status(500).json({ message: error.message });
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

const getPredictions = async (req, res) => {
  try {
    const predictions = await Prediction.findAll({
      attributes: { exclude: ['data'] },
    });
    return res.status(200).json(predictions);
  } catch (error) {
    return res.status(500).json({ error });
  }
};

const getPrediction = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: 'Missing parameters: id.' });
  }

  try {
    const prediction = await Prediction.findByPk(id);

    if (!prediction) {
      return res.status(404).json({ message: 'Prediction not found.' });
    }
    return res.status(200).json({ prediction });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

const updatePredictionInDatabase = async (jobId, data, transaction) => {
  try {
    const prediction = await Prediction.findOne({
      where: {
        jobId,
      },
      transaction,
    });

    if (!prediction) {
      console.error(`Prediction not found for jobId: ${jobId}`);
      await transaction.rollback();
      return;
    }

    const { status, stocks_predictions } = data;

    await prediction.update({
      prediction: stocks_predictions,
      status: status === 'SUCCESS' ? 'completed'
        : (status === 'PENDING' ? 'pending'
          : (status === 'FAILURE' ? 'failed' : 'unknown')),
    }, { transaction });
  } catch (error) {
    await transaction.rollback();
    console.error(`An error occurred while updating prediction in database: ${error.message}`);
  }
};

const getPredictionPolling = async (jobId, startTime = Date.now()) => {
  const transaction = await sequelize.transaction();
  try {
    console.log(`Polling for jobId: ${jobId}`);
    const MAX_WAIT_TIME = 1 * 60 * 1000;
    const currentTime = Date.now();

    if (currentTime - startTime > MAX_WAIT_TIME) {
      console.error(`Polling timed out after 1 minute for jobId: ${jobId}`);
      await transaction.rollback();
      return;
    }

    const response = await axios.get(`${process.env.WORKERS_API_JOB_URL}/${jobId}`);
    const { data } = response;

    if (data.status === 'SUCCESS') {
      await updatePredictionInDatabase(jobId, data, transaction);
      await transaction.commit();
      return data.data;
    } if (data.status === 'PENDING') {
      // eslint-disable-next-line no-promise-executor-return
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return getPredictionPolling(jobId, startTime);
    }
    console.error(`Received unexpected status: ${data.status}`);
    await updatePredictionInDatabase(jobId, data, transaction);
    await transaction.commit();
    return data.data;
  } catch (error) {
    await transaction.rollback();
    console.error(`An error occurred while polling: ${error.message}`);
    return null;
  }
};

module.exports = {
  makePrediction,
  getPredictions,
  getPrediction,
};
