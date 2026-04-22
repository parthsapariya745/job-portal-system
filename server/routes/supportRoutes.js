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
  getCategoryStats,
} = require("../controllers/supportCategoryController");

const {
  getServices,
  getService,
  getServicesByCategory,
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
  createRequest,
  getRequests,
  getRequest,
  updateRequestStatus,
  getRequestStats,
} = require("../controllers/supportRequestController");

// ==================== PUBLIC ROUTES ====================

// Category Routes
router.get("/categories", getCategories);
router.get("/categories/:id", getCategory);
router.get("/categories/:id/stats", getCategoryStats);

// Service Routes
router.get("/services", getServices);
router.get("/services/:id", getService);
router.get("/services/category/:categoryId", getServicesByCategory);

// Organization Routes
router.get("/organizations", getOrganizations);
router.get("/organizations/:id", getOrganization);

// Help Request Routes (Public)
router.post("/request", createRequest);

// ==================== PROTECTED ADMIN ROUTES ====================

// Category Admin Routes
router.post("/categories", protect, authorize("admin"), createCategory);
router.patch("/categories/:id", protect, authorize("admin"), updateCategory);
router.delete("/categories/:id", protect, authorize("admin"), deleteCategory);

// Service Admin Routes
router.post("/services", protect, authorize("admin"), createService);
router.patch("/services/:id", protect, authorize("admin"), updateService);
router.delete("/services/:id", protect, authorize("admin"), deleteService);

// Organization Admin Routes
router.post("/organizations", protect, authorize("admin"), createOrganization);
router.patch("/organizations/:id", protect, authorize("admin"), updateOrganization);
router.delete("/organizations/:id", protect, authorize("admin"), deleteOrganization);

// Help Request Admin Routes
router.get("/requests", protect, authorize("admin"), getRequests);
router.get("/requests/stats", protect, authorize("admin"), getRequestStats);
router.get("/request/:id", protect, authorize("admin"), getRequest);
router.patch("/request/status/:id", protect, authorize("admin"), updateRequestStatus);

module.exports = router;
