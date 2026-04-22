const express = require('express');
const router = express.Router();

const { 
    getCompanies, 
    registerCompany, 
    addRecruiter 
} = require('../controllers/companyController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const validateRequest = require('../middlewares/validateRequest');
const { companySchema } = require('../validators/joiSchemas');

router.get('/', getCompanies);
router.post('/', protect, authorize('Company', 'Admin'), validateRequest(companySchema), registerCompany);
router.post('/recruiters', protect, authorize('Company'), addRecruiter);

module.exports = router;
