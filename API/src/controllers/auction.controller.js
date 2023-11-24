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
    res.status(201).json({created: newProposal, mqttResponseStatus: response.status});
  } catch (error) {
    next(error);
  }
};

const saveAnothersGroupProposal = async (req, res, next) => {
  const group_id = req.body.group_id;
  const type = req.body.type;
  const proposal_id = req.body.proposal_id;
  console.log(`😊😊😊😊😊😊 | Recibi una proposal del grupo ${group_id} a mqtt/auctions/proposals`)
  try {
    if (group_id === OUR_GROUP_ID) {
      return res.status(200).json({ message: 'Es nuestra oferta, no la guardo.' });
    }
    const offer = await Offer.findOne({
      where: {
        auction_id,
      },
    });
    if (!offer) {
      return res.status(404).json({ message: 'No existe la oferta' });
    }
    
    if (type === 'proposal'){
      const newProposal = await Proposal.create(req.body);
      console.log(`Recibi el posteo a mqtt/auctions/proposal del grupo ${group_id}}`);
      res.status(201).json(newProposal);
    } 

    if ( type === 'acceptance') {
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

      const allProposals = await Proposal.findAll({
        where: {
          auction_id,
          group_id: OUR_GROUP_ID,
        },
      });
      allProposals.forEach(async (proposal) => {
        if (proposal.id !== newProposal.id) {
          proposal.type = 'rejection';
          await proposal.save();
        }
      })
      res.status(201).json({updatedProposal: newProposal, type});
    }

    if ( type === 'rejection') {
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
      res.status(201).json({updatedProposal: newProposal, type});
    }
    else {
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
  saveAnothersGroupProposal,
  simulateProposal,
};
