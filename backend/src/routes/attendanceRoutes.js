import { Router } from "express";
import { attendanceController } from "../controllers/attendanceController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

let router = Router();
router.use(requireAuth);

let adminOnly = requireRole("admin", "manager");

// Admin/manager-only: viewing everyone's attendance.
router.get("/stats", adminOnly, asyncHandler(attendanceController.getStats));
router.get("/live", adminOnly, asyncHandler(attendanceController.getLive));
router.get("/summary", adminOnly, asyncHandler(attendanceController.getSummary));
router.get("/departments", adminOnly, asyncHandler(attendanceController.listDepartments));
router.get("/export", adminOnly, asyncHandler(attendanceController.exportCsv));
router.get("/", adminOnly, asyncHandler(attendanceController.list));

// Any authenticated user: check in/out and update their OWN record
// (ownership enforced inside the controller; admin/manager may act on anyone).
router.post("/check-in", asyncHandler(attendanceController.checkIn));
router.post("/check-out", asyncHandler(attendanceController.checkOut));
router.patch("/:id", asyncHandler(attendanceController.update));

export default router;
