const express = require("express");
const router = express.Router();
const offerController = require("../../../controllers/offer.controller");

router.get("/", offerController.getActiveOffers);

module.exports = router;
