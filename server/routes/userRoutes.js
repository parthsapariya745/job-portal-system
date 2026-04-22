const express = require("express");
const router = express.Router();
const {
  uploadResume,
  uploadAvatar: uploadAvatarMiddleware,
} = require("../middlewares/uploadMiddleware");
const {
  getProfile,
  updateProfile,
  uploadResume: uploadResumeController,
  uploadAvatar,
  uploadCoverImage,
  saveJob,
  unsaveJob,
  getSavedJobs,
  getJobAlerts,
  addJobAlert,
  deleteJobAlert,
} = require("../controllers/userController");

const { protect } = require("../middlewares/authMiddleware");

router.get("/profile", protect, getProfile);
router.patch("/profile", protect, updateProfile);
router.post(
  "/profile/resume",
  protect,
  uploadResume.single("resume"),
  uploadResumeController,
);
router.post(
  "/profile/avatar",
  protect,
  uploadAvatarMiddleware.single("avatar"),
  uploadAvatar,
);
router.post(
  "/profile/cover",
  protect,
  uploadAvatarMiddleware.single("cover"),
  uploadCoverImage,
);

// Saved Jobs
router.get("/saved-jobs", protect, getSavedJobs);
router.post("/saved-jobs/:jobId", protect, saveJob);
router.delete("/saved-jobs/:jobId", protect, unsaveJob);

// Job Alerts
router.get("/alerts", protect, getJobAlerts);
router.post("/alerts", protect, addJobAlert);
router.delete("/alerts/:alertId", protect, deleteJobAlert);

module.exports = router;
