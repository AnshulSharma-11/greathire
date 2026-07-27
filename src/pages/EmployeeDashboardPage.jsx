import { useEffect, useState } from "react";
import EmployeeSidebar from "@/components/layout/EmployeeSidebar";
import EmployeeTopBar from "@/components/layout/EmployeeTopBar";
import GreetingBanner from "@/components/employee/GreetingBanner";
import CurrentStatusCard from "@/components/employee/CurrentStatusCard";
import QuickActionsGrid from "@/components/employee/QuickActionsGrid";
import StatsRow from "@/components/employee/StatsRow";
import AttendanceCalendar from "@/components/employee/AttendanceCalendar";
import TimelineCard from "@/components/employee/TimelineCard";
import LeaveBalanceCard from "@/components/employee/LeaveBalanceCard";
import UpcomingHolidaysCard from "@/components/employee/UpcomingHolidaysCard";
import QuickLinksCard from "@/components/employee/QuickLinksCard";
import AttendanceSummaryCard from "@/components/employee/AttendanceSummaryCard";
import AnnouncementCard from "@/components/employee/AnnouncementCard";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function EmployeeDashboardPage() {
  const { user } = useAuth();
  const [bundle, setBundle] = useState(null);
  const [error, setError] = useState("");

  async function load() {
    try {
      const res = await api.get("/employee/dashboard");
      setBundle(res.data);
    } catch (err) {
      setError(err.message || "Failed to load your dashboard");
    }
  }

  useEffect(() => {
    if (user?.employeeId) load();
  }, [user]);

  // Every action just affects the logged-in employee's own attendance record —
  // no employee picker, no typing IDs. Break/resume use the generic status
  // update endpoint since there's no dedicated break API yet.
  async function handleAction(id) {
    try {
      if (id === "check-in") {
        await api.post("/attendance/check-in", { employeeId: user.employeeId });
      } else if (id === "check-out") {
        await api.post("/attendance/check-out", { employeeId: user.employeeId });
      } else if (id === "start-break" && bundle?.currentStatus?.recordId) {
        await api.patch(`/attendance/${bundle.currentStatus.recordId}`, { liveStatus: "On Break" });
      } else if (id === "resume-work" && bundle?.currentStatus?.recordId) {
        await api.patch(`/attendance/${bundle.currentStatus.recordId}`, { liveStatus: "Working" });
      }
      load();
    } catch (err) {
      setError(err.message || "Action failed");
    }
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <p className="text-sm font-medium text-red-600">{error}</p>
      </div>
    );
  }
  if (!bundle) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <p className="text-sm text-slate-500">Loading your dashboard...</p>
      </div>
    );
  }

  const {
    currentUser,
    currentStatus,
    quickActions,
    hoursStats,
    attendanceMonth,
    timeline,
    leaveBalances,
    upcomingHolidays,
    quickLinks,
    attendanceSummary,
    announcement,
  } = bundle;

  return (
    <div className="flex h-screen bg-background">
      <EmployeeSidebar />

      <div className="flex flex-1 flex-col overflow-y-auto">
        <EmployeeTopBar user={currentUser} />

        <main className="grid flex-1 grid-cols-1 gap-6 p-8 lg:grid-cols-[1fr_320px]">
          {/* Main column */}
          <div className="space-y-6">
            <GreetingBanner
              name={currentUser.name}
              role={currentUser.role}
              dateLabel={currentUser.todayLabel}
              lastLogin={currentUser.lastLogin}
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto]">
              <CurrentStatusCard status={currentStatus} />
              <QuickActionsGrid actions={quickActions} onAction={handleAction} />
            </div>

            <StatsRow stats={hoursStats} />

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_280px]">
              <AttendanceCalendar month={attendanceMonth} />
              <TimelineCard items={timeline} />
            </div>

            <AttendanceSummaryCard items={attendanceSummary} />
          </div>

          {/* Sidebar column */}
          <div className="space-y-6">
            <LeaveBalanceCard balances={leaveBalances} onApply={() => {}} />
            <UpcomingHolidaysCard holidays={upcomingHolidays} />
            <QuickLinksCard links={quickLinks} />
            {announcement && (
              <AnnouncementCard {...announcement} onCtaClick={() => {}} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
