const express = require("express");
const router = express.Router();
const {
  applyForJob,
  getMyApplications,
  getCompanyApplications,
  updateApplicationStatus,
} = require("../controllers/applicationController");
const { protect, authorize } = require("../middlewares/authMiddleware");

router.use(protect);

router.post("/", applyForJob); // Body: jobId, resume
router.get("/my", getMyApplications);
router.get("/company", authorize("Company", "Company HR", "Admin"), getCompanyApplications);
router.patch("/:id", authorize("Company", "Company HR", "Admin"), updateApplicationStatus);

module.exports = router;
