import { Router } from "express";
import { employeeProfileController } from "../controllers/employeeProfileController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

let router = Router();
router.use(requireAuth);

// Self-service (no id) — always the logged-in user's own profile.
router.get("/profile", asyncHandler(employeeProfileController.getProfile));
router.get("/profile/stat-cards", asyncHandler(employeeProfileController.getStatCards));
router.get("/profile/work-summary", asyncHandler(employeeProfileController.getWorkSummary));
router.get("/profile/activity-map", asyncHandler(employeeProfileController.getActivityMap));
router.get("/profile/personal-info", asyncHandler(employeeProfileController.getPersonalInfo));
router.put("/profile/personal-info", asyncHandler(employeeProfileController.updatePersonalInfo));
router.get("/profile/documents", asyncHandler(employeeProfileController.getDocuments));
router.get("/profile/bundle", asyncHandler(employeeProfileController.getBundle));

// Viewing a specific employee's profile by id (e.g. from a directory list) — admin/manager only.
let adminOnly = requireRole("admin", "manager");
router.get("/:id/profile", adminOnly, asyncHandler(employeeProfileController.getProfile));
router.get("/:id/profile/stat-cards", adminOnly, asyncHandler(employeeProfileController.getStatCards));
router.get("/:id/profile/work-summary", adminOnly, asyncHandler(employeeProfileController.getWorkSummary));
router.get("/:id/profile/activity-map", adminOnly, asyncHandler(employeeProfileController.getActivityMap));
router.get("/:id/profile/personal-info", adminOnly, asyncHandler(employeeProfileController.getPersonalInfo));
router.put("/:id/profile/personal-info", adminOnly, asyncHandler(employeeProfileController.updatePersonalInfo));
router.get("/:id/profile/documents", adminOnly, asyncHandler(employeeProfileController.getDocuments));
router.get("/:id/profile/bundle", adminOnly, asyncHandler(employeeProfileController.getBundle));

export default router;
