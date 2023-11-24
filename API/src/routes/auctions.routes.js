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
  saveAnothersGroupProposal,
  simulateProposal,
} = require('../controllers/auction.controller');

auctionRoutes.route('/proposals/own')
  .post(saveProposal);

auctionRoutes.route('/proposals/own')
  .get(getOwnProposals);

auctionRoutes.route('/proposals/others')
  .post(saveAnothersGroupProposal);

auctionRoutes.route('/proposals/simulate')
  .post(simulateProposal);

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

auctionRoutes.route('/stocks/testing')
  .get(groupStocksTesting);

module.exports = auctionRoutes;
