const express = require('express');
const router = express.Router();
const { predict, simulate, turnoutScenario } = require('../controllers/predictController');

router.post('/', predict);
router.post('/simulate', simulate);
router.post('/turnout', turnoutScenario);

module.exports = router;
