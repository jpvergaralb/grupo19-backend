const db = require('../../models');
const { postMQTT } = require('../utils/postToMQTT.util');

const Offer = db.offer;
const Proposal = db.proposal;
const OUR_GROUP_ID = 19;

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

module.exports = {
  saveProposal,
  getOwnProposals,
  getReceivedProposals,
  createOffer,
  getOurOffers,
  getOtherOffers,
};
