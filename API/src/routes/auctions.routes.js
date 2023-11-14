const express = require('express');

const auctionRoutes = express.Router();

const {
  saveProposal,
  getOwnProposals,
  getReceivedProposals,
  createOffer,
  getOtherOffers,
  getOurOffers,
} = require('../controllers/auction.controller');

auctionRoutes.route('/proposals')
  .post(saveProposal)

auctionRoutes.route('/proposals/own')
  .get(getOwnProposals)

auctionRoutes.route('/proposals/received')
  .get(getReceivedProposals)

auctionRoutes.route('/offers')
  .post(createOffer)

auctionRoutes.route('/offers/own')
  .get(getOurOffers)

auctionRoutes.route('/offers/other')
  .get(getOtherOffers)


module.exports = auctionRoutes;
