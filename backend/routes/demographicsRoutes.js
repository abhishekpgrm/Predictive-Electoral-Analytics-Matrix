const express = require('express');
const router = express.Router();
const { getDemographics } = require('../controllers/demographicsController');

router.get('/', getDemographics);

module.exports = router;
