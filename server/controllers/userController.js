const UserService = require("../services/userService");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

const getProfile = catchAsync(async (req, res, next) => {
  const user = await UserService.getUserById(req.user.id);
  res.status(200).json({
    status: "success",
    data: { user },
  });
});

const updateProfile = catchAsync(async (req, res, next) => {
  const user = await UserService.updateProfile(req.user.id, req.body);
  res.status(200).json({
    status: "success",
    data: { user },
  });
});

const { uploadToCloudinary } = require("../utils/cloudinary");

const uploadResume = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError("Please upload a file", 400));
  }
  
  const result = await uploadToCloudinary(req.file.buffer, "resumes", true);
  const resumeUrl = result.secure_url;
  
  const user = await UserService.uploadResume(req.user.id, resumeUrl);
  res.status(200).json({
    status: "success",
    data: {
      resumeUrl,
      user,
    },
  });
});

const uploadAvatar = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError("Please upload an image", 400));
  }
  
  const result = await uploadToCloudinary(req.file.buffer, "avatars", false);
  const avatarUrl = result.secure_url;

  // Check if it's a company uploading their logo
  const currentUser = req.user;
  let updateData = { avatar: avatarUrl };
  
  // If we wanted to also update company logo simultaneously
  if (currentUser.role === "Company" || currentUser.role === "Company HR") {
    // We could update companyProfile.logo, but since setting avatar implies user avatar, we'll keep it as avatar or update both
    const fullUser = await UserService.getUserById(req.user.id);
    if (fullUser.companyProfile) {
       fullUser.companyProfile.logo = avatarUrl;
       await fullUser.save();
    }
  }

  const user = await UserService.updateProfile(req.user.id, updateData);

  res.status(200).json({
    status: "success",
    data: { avatarUrl, user },
  });
});

const uploadCoverImage = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError("Please upload an image", 400));
  }
  
  const result = await uploadToCloudinary(req.file.buffer, "covers", false);
  const coverUrl = result.secure_url;

  const User = require("../models/User");
  const user = await User.findByIdAndUpdate(req.user.id, { coverImage: coverUrl }, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: "success",
    data: { coverUrl, user },
  });
});

const saveJob = catchAsync(async (req, res, next) => {
  const user = await UserService.saveJob(req.user.id, req.params.jobId);
  res.status(200).json({ status: "success", data: { user } });
});

const unsaveJob = catchAsync(async (req, res, next) => {
  const user = await UserService.unsaveJob(req.user.id, req.params.jobId);
  res.status(200).json({ status: "success", data: { user } });
});

const getSavedJobs = catchAsync(async (req, res, next) => {
  const savedJobs = await UserService.getSavedJobs(req.user.id);
  res.status(200).json({
    status: "success",
    results: savedJobs.length,
    data: { savedJobs },
  });
});

// Job Alerts
const getJobAlerts = catchAsync(async (req, res, next) => {
  const alerts = await UserService.getJobAlerts(req.user.id);
  res.status(200).json({
    status: "success",
    results: alerts.length,
    data: { alerts },
  });
});

const addJobAlert = catchAsync(async (req, res, next) => {
  const alerts = await UserService.addJobAlert(req.user.id, req.body);
  res.status(201).json({
    status: "success",
    results: alerts.length,
    data: { alerts },
  });
});

const deleteJobAlert = catchAsync(async (req, res, next) => {
  const alerts = await UserService.deleteJobAlert(
    req.user.id,
    req.params.alertId,
  );
  res.status(200).json({
    status: "success",
    results: alerts.length,
    data: { alerts },
  });
});

module.exports = {
  getProfile,
  updateProfile,
  uploadResume,
  uploadAvatar,
  uploadCoverImage,
  saveJob,
  unsaveJob,
  getSavedJobs,
  getJobAlerts,
  addJobAlert,
  deleteJobAlert,
};
