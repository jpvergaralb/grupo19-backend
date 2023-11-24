const express = require('express');

const auctionRoutes = express.Router();

const {
  saveProposal,
  getOwnProposals,
  getReceivedProposals,
  saveOthersOffer,
  getOtherOffers,
  getOurOffers,
  groupStocksTesting,
  createOurOffer,
  simulateOffer,
} = require('../controllers/auction.controller');

// * UNUSED
auctionRoutes.route('/proposals')
  .post(saveProposal);

// * UNUSED
auctionRoutes.route('/proposals/own')
  .get(getOwnProposals);

// * UNUSED
auctionRoutes.route('/proposals/received')
  .get(getReceivedProposals);


auctionRoutes.route('/offers/simulate')
  .post(simulateOffer);

auctionRoutes.route('/offers/own')
  .get(getOurOffers)
  .post(createOurOffer);

auctionRoutes.route('/offers/others')
  .get(getOtherOffers)
  .post(saveOthersOffer);

// * UNUSED
auctionRoutes.route('/stocks/testing')
  .get(groupStocksTesting);

module.exports = auctionRoutes;
