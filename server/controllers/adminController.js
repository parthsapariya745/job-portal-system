const AdminService = require('../services/adminService');
const catchAsync = require('../utils/catchAsync');

const getStats = catchAsync(async (req, res) => {
    const stats = await AdminService.getDashboardStats();
    res.status(200).json({
        status: 'success',
        data: stats
    });
});

const approveCompany = catchAsync(async (req, res) => {
    const company = await AdminService.approveCompany(req.params.id);
    res.status(200).json({
        status: 'success',
        data: { company }
    });
});

const rejectCompany = catchAsync(async (req, res) => {
    const company = await AdminService.rejectCompany(req.params.id);
    res.status(200).json({
        status: 'success',
        data: { company }
    });
});

module.exports = {
    getStats,
    approveCompany,
    rejectCompany
};
