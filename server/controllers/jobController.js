const JobService = require('../services/jobService');
const catchAsync = require('../utils/catchAsync');

// @desc    Get all jobs
// @route   GET /api/v1/jobs
// @access  Public
const getJobs = catchAsync(async (req, res) => {
    const result = await JobService.getJobs(req.query);

    res.status(200).json({
        status: 'success',
        ...result
    });
});

// @desc    Get single job
// @route   GET /api/v1/jobs/:id
// @access  Public
const getJob = catchAsync(async (req, res) => {
    const job = await JobService.getJobById(req.params.id);

    res.status(200).json({
        status: 'success',
        data: job
    });
});

// @desc    Create new job
// @route   POST /api/v1/jobs
// @access  Private (Company/Admin)
const createJob = catchAsync(async (req, res) => {
    const job = await JobService.createJob(req.body, req.user.id);

    res.status(201).json({
        status: 'success',
        data: job
    });
});

// @desc    Update job
// @route   PATCH /api/v1/jobs/:id
// @access  Private (Company/Admin - owner only)
const updateJob = catchAsync(async (req, res) => {
    const job = await JobService.updateJob(req.params.id, req.user.id, req.body);

    res.status(200).json({
        status: 'success',
        data: job
    });
});

// @desc    Delete job (soft delete)
// @route   DELETE /api/v1/jobs/:id
// @access  Private (Company/Admin - owner only)
const deleteJob = catchAsync(async (req, res) => {
    await JobService.deleteJob(req.params.id, req.user.id);

    res.status(200).json({
        status: 'success',
        data: null,
        message: 'Job deleted successfully'
    });
});

module.exports = {
    getJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob
};
