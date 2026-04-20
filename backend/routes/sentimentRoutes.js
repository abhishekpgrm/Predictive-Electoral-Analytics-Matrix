const express = require('express');
const router = express.Router();
const {
  getSentiments,
  createSentiment,
  updateSentiment
} = require('../controllers/sentimentController');

router.get('/', getSentiments);
router.post('/', createSentiment);
router.put('/update', updateSentiment);

module.exports = router;
