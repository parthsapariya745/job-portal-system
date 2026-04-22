const CompanyService = require('../services/companyService');
const catchAsync = require('../utils/catchAsync');

const getCompanies = catchAsync(async (req, res) => {
    const companies = await CompanyService.getCompanies(req.query);
    res.status(200).json({
        status: 'success',
        results: companies.length,
        data: companies
    });
});

const registerCompany = catchAsync(async (req, res) => {
    const company = await CompanyService.registerCompany(req.body, req.user.id);
    res.status(201).json({
        status: 'success',
        data: company
    });
});

const addRecruiter = catchAsync(async (req, res) => {
    const { email } = req.body;
    const company = await CompanyService.addRecruiter(req.user.id, email);
    res.status(200).json({
        status: 'success',
        data: company
    });
});

module.exports = {
    getCompanies,
    registerCompany,
    addRecruiter
};
