import { EmployeeDashboard } from "../models/EmployeeDashboard.js";
import { ApiError } from "../middleware/errorHandler.js";

// Self-service routes always use the authenticated user's own employeeId.
// The /:id variants are admin/manager-only (enforced by requireRole in the
// route file), so trusting req.params.id there is safe.
function resolveEmployeeId(req) {
  return req.params.id || req.user.employeeId;
}

export let employeeDashboardController = {
  getCurrentUser: (req, res) => {
    res.json({ success: true, data: EmployeeDashboard.getCurrentUser(resolveEmployeeId(req)) });
  },
  getCurrentStatus: (req, res) => {
    res.json({ success: true, data: EmployeeDashboard.getCurrentStatus(resolveEmployeeId(req)) });
  },
  getQuickActions: (req, res) => {
    res.json({ success: true, data: EmployeeDashboard.getQuickActions() });
  },
  getHoursStats: (req, res) => {
    res.json({ success: true, data: EmployeeDashboard.getHoursStats(resolveEmployeeId(req)) });
  },
  getAttendanceLegend: (req, res) => {
    res.json({ success: true, data: EmployeeDashboard.getAttendanceLegend() });
  },
  getAttendanceMonth: (req, res) => {
    let { year, month } = req.query;
    res.json({
      success: true,
      data: EmployeeDashboard.getAttendanceMonth(
        resolveEmployeeId(req),
        year ? Number(year) : undefined,
        month ? Number(month) : undefined
      ),
    });
  },
  getTimeline: (req, res) => {
    res.json({ success: true, data: EmployeeDashboard.getTimeline(resolveEmployeeId(req)) });
  },
  getLeaveBalances: (req, res) => {
    res.json({ success: true, data: EmployeeDashboard.getLeaveBalances(resolveEmployeeId(req)) });
  },
  getUpcomingHolidays: (req, res) => {
    let { limit } = req.query;
    res.json({ success: true, data: EmployeeDashboard.getUpcomingHolidays(limit ? Number(limit) : 2) });
  },
  getQuickLinks: (req, res) => {
    res.json({ success: true, data: EmployeeDashboard.getQuickLinks() });
  },
  getAttendanceSummary: (req, res) => {
    res.json({ success: true, data: EmployeeDashboard.getAttendanceSummary(resolveEmployeeId(req)) });
  },
  getAnnouncement: (req, res) => {
    res.json({ success: true, data: EmployeeDashboard.getAnnouncement() });
  },

  // GET /api/employee/dashboard — everything EmployeeDashboardPage.jsx needs in one call.
  getBundle: (req, res) => {
    let employeeId = resolveEmployeeId(req);
    if (!EmployeeDashboard.getCurrentUser(employeeId)) {
      throw new ApiError(404, "Unknown employeeId");
    }
    res.json({ success: true, data: EmployeeDashboard.getBundle(employeeId) });
  },
};
