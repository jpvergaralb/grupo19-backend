const express = require('express')

const {
  postOfferToMQTT,
  postProposalToMQTT,
} = require('../controllers/auctions.controller')

const auctionRoutes = express.Router()

auctionRoutes.route('/offers')
  .post(postOfferToMQTT)

  auctionRoutes.route('/proposals')
  .post(postProposalToMQTT)

module.exports = auctionRoutes
