import { Router } from "express";
import { employeeDashboardController } from "../controllers/employeeDashboardController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

let router = Router();
router.use(requireAuth);

// Self-service (no id) — always the logged-in user's own data.
router.get("/current-user", asyncHandler(employeeDashboardController.getCurrentUser));
router.get("/status", asyncHandler(employeeDashboardController.getCurrentStatus));
router.get("/quick-actions", asyncHandler(employeeDashboardController.getQuickActions));
router.get("/hours-stats", asyncHandler(employeeDashboardController.getHoursStats));
router.get("/attendance-legend", asyncHandler(employeeDashboardController.getAttendanceLegend));
router.get("/attendance-month", asyncHandler(employeeDashboardController.getAttendanceMonth));
router.get("/timeline", asyncHandler(employeeDashboardController.getTimeline));
router.get("/leave-balances", asyncHandler(employeeDashboardController.getLeaveBalances));
router.get("/upcoming-holidays", asyncHandler(employeeDashboardController.getUpcomingHolidays));
router.get("/quick-links", asyncHandler(employeeDashboardController.getQuickLinks));
router.get("/attendance-summary", asyncHandler(employeeDashboardController.getAttendanceSummary));
router.get("/announcement", asyncHandler(employeeDashboardController.getAnnouncement));
router.get("/dashboard", asyncHandler(employeeDashboardController.getBundle));

// Viewing a specific employee's dashboard by id — admin/manager only.
let adminOnly = requireRole("admin", "manager");
router.get("/:id/current-user", adminOnly, asyncHandler(employeeDashboardController.getCurrentUser));
router.get("/:id/status", adminOnly, asyncHandler(employeeDashboardController.getCurrentStatus));
router.get("/:id/hours-stats", adminOnly, asyncHandler(employeeDashboardController.getHoursStats));
router.get("/:id/attendance-month", adminOnly, asyncHandler(employeeDashboardController.getAttendanceMonth));
router.get("/:id/timeline", adminOnly, asyncHandler(employeeDashboardController.getTimeline));
router.get("/:id/leave-balances", adminOnly, asyncHandler(employeeDashboardController.getLeaveBalances));
router.get("/:id/attendance-summary", adminOnly, asyncHandler(employeeDashboardController.getAttendanceSummary));
router.get("/:id/dashboard", adminOnly, asyncHandler(employeeDashboardController.getBundle));

export default router;
