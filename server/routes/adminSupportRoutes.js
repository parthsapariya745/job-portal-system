const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middlewares/authMiddleware");

// Import controllers
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/supportCategoryController");

const {
  getServices,
  getService,
  createService,
  updateService,
  deleteService,
} = require("../controllers/supportServiceController");

const {
  getOrganizations,
  getOrganization,
  createOrganization,
  updateOrganization,
  deleteOrganization,
} = require("../controllers/supportOrganizationController");

const {
  getRequests,
  getRequest,
  updateRequestStatus,
  getRequestStats,
} = require("../controllers/supportRequestController");

// ==================== ADMIN CATEGORY ROUTES ====================
router.get("/categories", protect, authorize("admin"), getCategories);
router.post("/category", protect, authorize("admin"), createCategory);
router.get("/categories/:id", protect, authorize("admin"), getCategory);
router.patch("/categories/:id", protect, authorize("admin"), updateCategory);
router.delete("/categories/:id", protect, authorize("admin"), deleteCategory);

// ==================== ADMIN SERVICE ROUTES ====================
router.get("/services", protect, authorize("admin"), getServices);
router.post("/service", protect, authorize("admin"), createService);
router.get("/services/:id", protect, authorize("admin"), getService);
router.patch("/services/:id", protect, authorize("admin"), updateService);
router.delete("/services/:id", protect, authorize("admin"), deleteService);

// ==================== ADMIN ORGANIZATION ROUTES ====================
router.get("/organizations", protect, authorize("admin"), getOrganizations);
router.post("/organization", protect, authorize("admin"), createOrganization);
router.get("/organizations/:id", protect, authorize("admin"), getOrganization);
router.patch("/organizations/:id", protect, authorize("admin"), updateOrganization);
router.delete("/organizations/:id", protect, authorize("admin"), deleteOrganization);

// ==================== ADMIN REQUEST ROUTES ====================
router.get("/requests", protect, authorize("admin"), getRequests);
router.get("/requests/stats", protect, authorize("admin"), getRequestStats);
router.get("/requests/:id", protect, authorize("admin"), getRequest);
router.patch("/requests/:id/status", protect, authorize("admin"), updateRequestStatus);

module.exports = router;
