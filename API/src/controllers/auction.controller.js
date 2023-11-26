const { v4: uuidv4 } = require('uuid');
const db = require('../../models');
const { postMQTT } = require('../utils/postToMQTT.util');
const { addStocksToTheGroup, reduceStocksToTheGroup, addStocksToAUser } = require('../utils/groupStocksManipulation.util');

const Offer = db.offer;
const Proposal = db.proposal;
const OUR_GROUP_ID = 19;
const OurStocks = db.ourStocks;
const StocksOwners = db.stocksOwners;
const User = db.user;

const getOwnProposals = async (req, res, next) => {
  try {
    console.log('😊😊😊😊😊😊 | Recibi un get a mqtt/auctions/proposals')
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
        type: 'proposal',
      },
    });

    const associatedOffers = [];
    
    for (const proposal of proposals) {
      const offer = await Offer.findOne({
        where: {
          auction_id: proposal.auction_id,
          group_id: OUR_GROUP_ID,
        },
      });
      
      if (offer) {
        console.log(`trying to find...`);
        const proposalOfferPair = {
          offer: offer,
          proposal: proposal
        };
        associatedOffers.push(proposalOfferPair);
      }
    }
    res.status(200).json(associatedOffers);
  } catch (error) {
    next(error);
  }
};



// Esto esta bien
// A partir de una offer ajena generamos una proposal
const saveProposal = async (req, res, next) => {
  const transaction = await db.sequelize.transaction();
  try {
    const { quantity, stock_id } = req.body.data;
    const stock = await OurStocks.findOne({ where: { stock_symbol: stock_id } }, { transaction });
    if (stock.quantity < quantity) {
      await transaction.rollback();
      return res.status(400).json({ message: 'There are not enough stocks.' });
    }
    stock.quantity -= quantity;
    await stock.save({ transaction });
    const proposal = await Proposal.create(req.body.data, { transaction });
    const response = await postMQTT('auctions/proposals', proposal);
    if (response.status !== 200) {
      await transaction.rollback();
      return res.status(500).json({ message: 'Error posting to MQTT' });
    }
    await transaction.commit();
    res.status(201).json({ created: proposal, mqttResponseStatus: response.status });
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

const saveAnothersGroupProposal = async (req, res, next) => {
  const { group_id, auction_id } = req.body;
  const { type } = req.body;
  const { proposal_id, stock_id } = req.body;
  console.log(`😊😊😊😊😊😊 | Recibi una proposal del grupo ${group_id}`);
  try {
    if (group_id === OUR_GROUP_ID) {
      return res.status(200).json({ message: 'Es nuestra oferta, no la guardo.' });
    } 
    const stock = await OurStocks.findOne({ where: { stock_symbol: stock_id } });
    const offer = await Offer.findOne({
      where: {
        auction_id,
      },
    });
    if (!offer) {
      return res.status(404).json({ message: 'No existe la oferta' });
    }
    if (type === 'proposal') {
      const newProposal = await Proposal.create(req.body);
      console.log(`Recibi el posteo a mqtt/auctions/proposal del grupo ${group_id}}`);
      return res.status(201).json(newProposal);
    }

    if (type === 'acceptance') {
      const newProposal = await Proposal.findOne({
        where: {
          proposal_id,
        },
      });
      if (!newProposal) {
        return res.status(404).json({ message: 'No existe la proposal' });
      }
      newProposal.type = type;
      await newProposal.save();
      if (newProposal.group_id === OUR_GROUP_ID) {
        stock.quantity += newProposal.quantity;
        await stock.save();
      }

      const allProposals = await Proposal.findAll({
        where: {
          auction_id,
          group_id: OUR_GROUP_ID,
        },
      });

      allProposals.forEach(async (proposal) => {
        if (proposal.id !== newProposal.id) {
          // eslint-disable-next-line no-param-reassign
          proposal.type = 'rejection';
          await proposal.save();
          const ourStock = await OurStocks.findOne({ where: { stock_symbol: proposal.stock_id } });
          ourStock.quantity += proposal.quantity;
          await ourStock.save();
        }
      });
      await offer.destroy();
      return res.status(201).json({ updatedProposal: newProposal, type });
    }

    if (type === 'rejection') {
      const newProposal = await Proposal.findOne({
        where: {
          proposal_id,
        },
      });
      if (!newProposal) {
        return res.status(404).json({ message: 'No existe la proposal' });
      }
      newProposal.type = type;
      await newProposal.save();
      const ourStock = await OurStocks.findOne({ where: { stock_symbol: newProposal.stock_id } });
      ourStock.quantity += newProposal.quantity;
      await ourStock.save();
      return res.status(201).json({ updatedProposal: newProposal, type });
    } else {
      return res.status(400).json({ message: 'Invalid type' });
    }
  } catch (error) {
    next(error);
  }
};

const simulateProposal = async (req, res, next) => {
  console.log('😪 No te enojes | Simulando una proposal.');
  try {
    const simulatedProposal = req.body;
    const response = await postMQTT('auctions/proposals', simulatedProposal);
    if (response.status !== 200) {
      return res.status(500).json({ message: 'Error posting to MQTT' });
    }
    res.status(201).json({ created: simulatedProposal, mqttResponseStatus: response.status });
  } catch (error) {
    next(error);
  }
};

const createOurOffer = async (req, res, next) => {
  console.log('😪 No te enojes | Creando una offer.');
  try {
    const request = req.body;

    if (!request) {
      return res.status(400).json({ message: 'Request body is missing' });
    }

    const {
      user_id, stock_symbol, quantity,
    } = request;

    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ message: `User ${user_id} not found` });
    }

    if (user.role !== 'admin') {
      return res.status(404).json({ message: 'User is not an admin' });
    }

    const ourStocks = await OurStocks.findOne({ where: { stock_symbol } });

    if (!ourStocks || ourStocks.quantity < quantity) {
      return res.status(400).json({ message: 'Not enough stocks' });
    }

    const offerBody = {
      auction_id: uuidv4(),
      proposal_id: '',
      stock_id: stock_symbol,
      quantity,
      group_id: 19,
      type: 'offer',
    };

    const newOffer = await Offer.create(offerBody);
    console.log(`Oferta que se enviará al mqtt: ${newOffer}`);
    const response = await postMQTT('auctions/offers', newOffer);
    if (response.status !== 200) {
      return res.status(500).json({ message: 'Error posting to MQTT' });
    }

    const todoBien = await reduceStocksToTheGroup(stock_symbol, quantity);
    if (!todoBien) {
      return res.status(500).json({ message: 'Error updating the group stocks' });
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

// -------------- ----------------
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

const getOfferByAuctionId = async (req, res, next) => {
  try {
    const { auction_id } = req.params;
    const offer = await Offer.findOne({
      where: {
        auction_id,
      },
    });
    res.status(200).json(offer);
  } catch (error) {
    next(error);
  }
};

const groupStocksTesting = async (req, res, next) => {
  try {
    await addStocksToTheGroup('AAPL', 1000);
    res.status(200).json({ msg: 'Creado con exito' });
  } catch (error) {
    next(error);
    res.status(500).json({msg: 'Error testing group stocks' });

  }
};  

module.exports = {
  saveProposal,
  getOwnProposals,
  getOfferByAuctionId,
  getReceivedProposals,
  getOurOffers,
  getOtherOffers,
  saveOthersOffer,
  groupStocksTesting,
  createOurOffer,
  simulateOffer,
  saveAnothersGroupProposal,
  simulateProposal,
};
