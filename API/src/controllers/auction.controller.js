const db = require('../../models');
const { postMQTT } = require('../utils/postToMQTT.util');
const { addStocksToTheGroup, reduceStocksToTheGroup, addStocksToAUser } = require('../utils/groupStocksManipulation.util');

const Offer = db.offer;
const Proposal = db.proposal;
const OUR_GROUP_ID = 19;
const OurStocks = db.ourStocks;
const StocksOwners = db.stocksOwners;

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

const saveProposal = async (req, res, next) => {
  try {
    const newProposal = await Proposal.create(req.body);
    const response = await postMQTT('auctions/proposals', newProposal);
    console.log(`Recibi del posteo a mqtt/auctions/proposal: ${response}`);
    res.status(201).json(newProposal);
  } catch (error) {
    next(error);
  }
};

const createOffer = async (req, res, next) => {
  try {
    const newOffer = await Offer.create(req.body);
    const response = await postMQTT('auctions/offers', newOffer);
    console.log(`Recibi del posteo a mqtt/auctions/offer: ${response}`);
    res.status(201).json(newOffer);
  } catch (error) {
    next(error);
  }
};

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
    await addStocksToTheGroup('TST1', 1000);

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
  createOffer,
  getOurOffers,
  getOtherOffers,
  groupStocksTesting,
};
