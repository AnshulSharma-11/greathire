import { Router } from "express";
import { leaveController } from "../controllers/leaveController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

let router = Router();
router.use(requireAuth);

let adminOnly = requireRole("admin", "manager");

router.get("/stats", adminOnly, asyncHandler(leaveController.getStats));
router.get("/team-availability", adminOnly, asyncHandler(leaveController.getTeamAvailability));
router.get("/types", asyncHandler(leaveController.getLeaveTypes));
router.get("/export", adminOnly, asyncHandler(leaveController.exportCsv));

router.get("/requests", adminOnly, asyncHandler(leaveController.list));
router.get("/requests/mine", asyncHandler(leaveController.listMine));
router.get("/requests/:id", adminOnly, asyncHandler(leaveController.getById));
router.post("/requests", asyncHandler(leaveController.create));
router.post("/requests/approve-all", adminOnly, asyncHandler(leaveController.approveAll));
router.patch("/requests/:id/approve", adminOnly, asyncHandler(leaveController.approve));
router.patch("/requests/:id/reject", adminOnly, asyncHandler(leaveController.reject));

export default router;
