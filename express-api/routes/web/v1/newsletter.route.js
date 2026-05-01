const express = require('express');
const { subscribeNewsletter } = require('../../../controllers/web/newsletter.controller.js');

const router = express.Router();

router.post('/subscribe', subscribeNewsletter);

module.exports = router;
