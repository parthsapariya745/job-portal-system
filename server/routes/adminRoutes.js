const express = require('express');
const router = express.Router();
const { getStats, approveCompany, rejectCompany } = require('../controllers/adminController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.use(protect);
router.use(authorize('Admin', 'Super Admin'));

router.get('/stats', getStats);
router.patch('/companies/:id/approve', approveCompany);
router.patch('/companies/:id/reject', rejectCompany);

module.exports = router;
