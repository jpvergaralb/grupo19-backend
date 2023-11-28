const express = require('express');

const auctionRoutes = express.Router();

const { checkAdmin } = require('../middlewares/AdminChecker');

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
  getOfferByAuctionId,
  respondToAnothersGroupProposal,
} = require('../controllers/auction.controller');

auctionRoutes.route('/proposals/own')
  .post(checkAdmin, saveProposal)
  .get(checkAdmin, getOwnProposals);

auctionRoutes.route('/proposals/others')
  .post(saveAnothersGroupProposal);

auctionRoutes.route('/proposals/others/respond')
  .post(checkAdmin, respondToAnothersGroupProposal);

auctionRoutes.route('/proposals/simulate')
  .post(checkAdmin, simulateProposal);

auctionRoutes.route('/proposals/received')
  .get(checkAdmin, getReceivedProposals);

auctionRoutes.route('/offers/simulate')
  .post(checkAdmin, simulateOffer);

auctionRoutes.route('/offers/own')
  .get(checkAdmin, getOurOffers)
  .post(checkAdmin, createOurOffer);

auctionRoutes.route('/offers/others')
  .get(getOtherOffers)
  .post(saveOthersOffer);

auctionRoutes.route('/offers/:auction_id')
  .get(checkAdmin, getOfferByAuctionId);

auctionRoutes.route('/stocks/testing')
  .get(checkAdmin, groupStocksTesting);

module.exports = auctionRoutes;
