const express = require('express');
const router = express.Router();
const {
  getAllCandidates,
  getCandidate,
  createCandidate
} = require('../controllers/candidateController');

router.get('/', getAllCandidates);
router.get('/:id', getCandidate);
router.post('/', createCandidate);

module.exports = router;
