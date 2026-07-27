import { Routes, Route } from "react-router-dom";
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import EmployeeDashboardPage from "@/pages/EmployeeDashboardPage";
import AttendanceManagement from "@/pages/AttendanceManagement";
import Report from "@/pages/Report";
import EmployeeProfilePage from "@/pages/EmployeeProfilePage";
import MyProfilePage from "@/pages/MyProfilePage";
import NotificationsCenterPage from "@/pages/NotificationsCenterPage";
import MessagesPage from "@/pages/MessagesPage";
import LeaveManagement from "@/pages/LeaveManagement";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/dashboard" element={<ProtectedRoute roles={["admin", "manager"]}><DashboardPage /></ProtectedRoute>} />
      <Route path="/employee-dashboard" element={<ProtectedRoute><EmployeeDashboardPage /></ProtectedRoute>} />
      <Route path="/attendance" element={<ProtectedRoute roles={["admin", "manager"]}><AttendanceManagement /></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute roles={["admin", "manager"]}><Report /></ProtectedRoute>} />
      <Route path="/employees" element={<ProtectedRoute roles={["admin", "manager"]}><EmployeeProfilePage /></ProtectedRoute>} />
<Route path="/employees/:id" element={<ProtectedRoute roles={["admin", "manager"]}><EmployeeProfilePage /></ProtectedRoute>} />
<Route path="/leave" element={<ProtectedRoute roles={["admin", "manager"]}><LeaveManagement /></ProtectedRoute>} />
<Route path="/profile" element={<ProtectedRoute><MyProfilePage /></ProtectedRoute>} />
<Route path="/notifications" element={<ProtectedRoute><NotificationsCenterPage /></ProtectedRoute>} />
{/* <Route path="/messages" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} /> */}
<Route path="/messages" element={<MessagesPage />} />
    </Routes>
  );
}