const express = require('express');
const router = express.Router();
const { getJobs, getJob, createJob, updateJob, deleteJob } = require('../controllers/jobController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const validateRequest = require('../middlewares/validateRequest');
const { createJobSchema, updateJobSchema } = require('../validators/joiSchemas');

router.get('/', getJobs);
router.get('/:id', getJob);
router.post('/', protect, authorize('Company', 'Company HR', 'Admin'), validateRequest(createJobSchema), createJob);
router.patch('/:id', protect, authorize('Company', 'Company HR', 'Admin'), validateRequest(updateJobSchema), updateJob);
router.delete('/:id', protect, authorize('Company', 'Company HR', 'Admin'), deleteJob);

module.exports = router;
