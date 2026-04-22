const ApplicationService = require("../services/applicationService");
const catchAsync = require("../utils/catchAsync");
const Company = require("../models/Company");

const applyForJob = catchAsync(async (req, res) => {
  const { jobId, resume } = req.body;
  const application = await ApplicationService.applyForJob(
    req.user.id,
    jobId,
    resume,
  );

  res.status(201).json({
    status: "success",
    data: { application },
  });
});

const getMyApplications = catchAsync(async (req, res) => {
  const applications = await ApplicationService.getApplicationsByUser(
    req.user.id,
  );
  res.status(200).json({
    status: "success",
    results: applications.length,
    data: { applications },
  });
});

const getCompanyApplications = catchAsync(async (req, res) => {
  console.log("Fetching company applications for user:", req.user.id);

  // Find company by owner (user ID)
  const company = await Company.findOne({ owner: req.user.id });

  if (!company) {
    console.log("No company found for user:", req.user.id);
    return res.status(200).json({
      status: "success",
      results: 0,
      data: { applications: [] },
    });
  }

  console.log("Company found:", company._id);
  const applications = await ApplicationService.getApplicationsByCompany(
    company._id,
  );
  console.log("Applications found:", applications.length);

  res.status(200).json({
    status: "success",
    results: applications.length,
    data: { applications },
  });
});

const updateApplicationStatus = catchAsync(async (req, res) => {
  const { status } = req.body;
  // Basic validation
  if (!["pending", "accepted", "rejected", "interview"].includes(status)) {
    // Optionally throw error or let service handle it if validation logic exists there
  }

  const application = await ApplicationService.updateStatus(
    req.params.id,
    status,
  );

  res.status(200).json({
    status: "success",
    data: { application },
  });
});

module.exports = {
  applyForJob,
  getMyApplications,
  getCompanyApplications,
  updateApplicationStatus,
};
