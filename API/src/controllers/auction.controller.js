const db = require('../../models');
const { postMQTT } = require('../utils/postToMQTT.util');
const { addStocksToTheGroup, reduceStocksToTheGroup, addStocksToAUser } = require('../utils/groupStocksManipulation.util');

const Offer = db.offer;
const Proposal = db.proposal;
const OUR_GROUP_ID = 19;
const OurStocks = db.ourStocks;
const StocksOwners = db.stocksOwners;

// * UNUSED
const getOwnProposals = async (req, res, next) => {
  try {
    const proposals = await Proposal.findAll({
      where: {
        group_id: OUR_GROUP_ID,
      },
    });
    res.status(200).json(proposals);
  } catch (error) {
    next(error);
  }
};

// * UNUSED
const getReceivedProposals = async (req, res, next) => {
  try {
    const proposals = await Proposal.findAll({
      where: {
        group_id: {
          [db.Sequelize.Op.ne]: OUR_GROUP_ID,
        },
      },
    });
    res.status(200).json(proposals);
  } catch (error) {
    next(error);
  }
};

// * UNUSED
const saveProposal = async (req, res, next) => {
  try {
    console.log(req.body);
    const newProposal = await Proposal.create(req.body);
    const response = await postMQTT('auctions/proposals', newProposal);
    console.log(`Recibi del posteo a mqtt/auctions/proposal: ${response}`);
    res.status(201).json(newProposal);
  } catch (error) {
    next(error);
  }
};

const createOurOffer = async (req, res, next) => {
  console.log('😪 No te enojes | Creando una offer.');
  try {
    const newOffer = await Offer.create(req.body);
    const response = await postMQTT('auctions/offers', newOffer);
    if (response.status !== 200) {
      return res.status(500).json({ message: 'Error posting to MQTT' });
    }
    res.status(201).json({ created: newOffer, mqttResponseStatus: response.status });
  } catch (error) {
    next(error);
  }
};

const simulateOffer = async (req, res, next) => {
  console.log('😪 No te enojes | Simulando una offer.');
  try {
    const simulatedOffer = req.body;
    const response = await postMQTT('auctions/offers', simulatedOffer);
    if (response.status !== 200) {
      return res.status(500).json({ message: 'Error posting to MQTT' });
    }
    res.status(201).json({ created: simulatedOffer, mqttResponseStatus: response.status });
  } catch (error) {
    next(error);
  }
};

// doing
const saveOthersOffer = async (req, res, next) => {
  console.log(`😊😊😊😊😊😊 | Recibi del posteo a mqtt/auctions/offers: ${req.body}`);
  const { group_id } = req.body;
  try {
    if (group_id === OUR_GROUP_ID) {
      return res.status(200).json({ message: 'Es nuestra oferta, no la guardo.' });
    }
    const newOffer = await Offer.create(req.body);
    console.log(`📧 | Recibi del posteo a mqtt/auctions/offerd del grupo ${group_id}. Oferta guardada`);
    res.status(201).json(newOffer);
  } catch (error) {
    next(error);
  }
};

// * UNUSED
const getOurOffers = async (req, res, next) => {
  try {
    const offers = await Offer.findAll({
      where: {
        group_id: OUR_GROUP_ID,
      },
    });
    res.status(200).json(offers);
  } catch (error) {
    next(error);
  }
};

// * UNUSED
const getOtherOffers = async (req, res, next) => {
  try {
    const offers = await Offer.findAll({
      where: {
        group_id: {
          [db.Sequelize.Op.ne]: OUR_GROUP_ID,
        },
      },
    });
    res.status(200).json(offers);
  } catch (error) {
    next(error);
  }
};

const groupStocksTesting = async (req, res, next) => {
  let message;
  try {
    await addStocksToTheGroup('TST1', 'Testing stock', 1000);

    const exito = await reduceStocksToTheGroup('TST1', 500);
    if (exito) {
      await addStocksToAUser('8a04cb0b-9c2a-4895-8e5c-95626ad9d1f0', 'TST1', 500);
    }
    const stockTest = await OurStocks.findOne({ where: { stock_symbol: 'TST1' } });
    const cantidadActual = stockTest.quantity;

    const userStocks = await StocksOwners.findOne({
      where: { user_id: '8a04cb0b-9c2a-4895-8e5c-95626ad9d1f0', stock_symbol: 'TST1' },
    });
    const cantidadStocksUsuario = userStocks.quantity;
    message = `Testing group stocks ended at: ${cantidadActual}. And user now has: ${cantidadStocksUsuario}`;
  } catch (error) {
    next(error);
    message = 'Error testing group stocks';
  }
  res.status(200).json({ message });
};

module.exports = {
  saveProposal,
  getOwnProposals,
  getReceivedProposals,
  getOurOffers,
  getOtherOffers,
  saveOthersOffer,
  groupStocksTesting,
  createOurOffer,
  simulateOffer,
};
