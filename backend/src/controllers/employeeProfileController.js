import { EmployeeProfile } from "../models/EmployeeProfile.js";
import { ApiError } from "../middleware/errorHandler.js";

// Self-service routes always use the authenticated user's own employeeId.
// The /:id variants are admin/manager-only (enforced by requireRole in the
// route file), so trusting req.params.id there is safe.
function resolveEmployeeId(req) {
  return req.params.id || req.user.employeeId;
}

export let employeeProfileController = {
  getProfile: (req, res) => {
    let employeeId = resolveEmployeeId(req);
    let profile = EmployeeProfile.getProfile(employeeId);
    if (!profile) throw new ApiError(404, "Unknown employeeId");
    res.json({ success: true, data: profile });
  },
  getStatCards: (req, res) => {
    res.json({ success: true, data: EmployeeProfile.getStatCards(resolveEmployeeId(req)) });
  },
  getWorkSummary: (req, res) => {
    res.json({ success: true, data: EmployeeProfile.getWorkSummary(resolveEmployeeId(req)) });
  },
  getActivityMap: (req, res) => {
    res.json({ success: true, data: EmployeeProfile.getActivityMap(resolveEmployeeId(req)) });
  },
  getPersonalInfo: (req, res) => {
    res.json({ success: true, data: EmployeeProfile.getPersonalInfo(resolveEmployeeId(req)) });
  },
  updatePersonalInfo: (req, res) => {
    let employeeId = resolveEmployeeId(req);
    let data = EmployeeProfile.updatePersonalInfo(employeeId, req.body || {});
    if (!data) throw new ApiError(404, "Unknown employeeId");
    res.json({ success: true, data });
  },
  getDocuments: (req, res) => {
    res.json({ success: true, data: EmployeeProfile.getDocuments(resolveEmployeeId(req)) });
  },

  // GET /api/employees/:id/profile — everything EmployeeProfilePage.jsx needs in one call.
  getBundle: (req, res) => {
    let employeeId = resolveEmployeeId(req);
    let profile = EmployeeProfile.getProfile(employeeId);
    if (!profile) throw new ApiError(404, "Unknown employeeId");
    res.json({ success: true, data: EmployeeProfile.getBundle(employeeId) });
  },
};
