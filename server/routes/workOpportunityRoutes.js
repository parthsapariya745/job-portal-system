const express = require('express');
const router = express.Router();
const {
  createWorkOpportunity,
  getWorkOpportunities,
  getWorkOpportunity,
  updateWorkOpportunity,
  deleteWorkOpportunity,
  getNonEducatedOpportunities,
  incrementInterest
} = require('../controllers/workOpportunityController');

// Public routes
router.get('/', getWorkOpportunities);
router.get('/type/non-educated', getNonEducatedOpportunities);
router.get('/:id', getWorkOpportunity);
router.post('/:id/interested', incrementInterest);

// Protected routes (optional - employers can post without login too)
router.post('/', createWorkOpportunity);
router.patch('/:id', updateWorkOpportunity);
router.delete('/:id', deleteWorkOpportunity);

module.exports = router;
