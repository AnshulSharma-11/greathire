import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutGrid,
  LayoutDashboard,
  CalendarCheck,
  Bell,
  Users,
  BarChart3,
  Settings,
  HelpCircle,
  LogOut,
  Search,
  CheckCheck,
  Download,
  LogIn as LogInIcon,
  CalendarClock,
  Cog,
} from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

const CATEGORY_ICONS = { attendance: LogInIcon, leave: CalendarClock, system: Cog };

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Notifications", icon: Bell, href: "/notifications" },
];

const filters = [
  { label: "All", value: "all" },
  { label: "Unread", value: "unread" },
  { label: "Attendance", value: "attendance" },
  { label: "Leave", value: "leave" },
  { label: "System", value: "system" },
];

/* -------------------------------------------------------------------------- */
/* Sidebar                                                                    */
/* -------------------------------------------------------------------------- */

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  return (
    <aside className="w-64 h-full bg-slate-900 text-slate-300 flex flex-col justify-between flex-shrink-0">
      <div>
        <div className="flex items-center gap-3 px-5 py-6">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
            <LayoutGrid className="w-5 h-5 text-white" />
          </div>
          <div className="leading-tight">
            <p className="text-white font-semibold text-sm">Teamora</p>
            <p className="text-slate-400 text-xs">Enterprise Plan</p>
          </div>
        </div>

        <nav className="mt-2 px-3 flex flex-col gap-1">
          {navItems.map(({ label, icon: Icon, href }) => {
            const active = location.pathname.startsWith(href);
            return (
              <Link
                key={label}
                to={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                  active
                    ? "bg-slate-800 text-white"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="px-3 pb-6 flex flex-col gap-1">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800/60 hover:text-white transition-colors text-left"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}

/* -------------------------------------------------------------------------- */
/* TopBar                                                                     */
/* -------------------------------------------------------------------------- */

function TopBar({ search, onSearchChange, unreadCount }) {
  return (
    <header className="flex items-center justify-between gap-4 px-6 py-4 bg-white border-b border-slate-200 flex-shrink-0">
      <div className="flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-2 w-full max-w-md">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          type="text"
          placeholder="Search Notifications..."
          className="bg-transparent outline-none text-sm text-slate-600 placeholder-slate-400 w-full"
        />
      </div>

      <div className="flex items-center gap-5 flex-shrink-0">
        <span className="relative text-slate-500">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-red-500" />
          )}
        </span>
      </div>
    </header>
  );
}

/* -------------------------------------------------------------------------- */
/* Page header + filters                                                     */
/* -------------------------------------------------------------------------- */

function PageHeader({ activeFilter, setActiveFilter, onMarkAllRead }) {
  return (
    <>
      <div className="mb-5">
        <h2 className="text-2xl font-bold text-slate-900">Notifications</h2>
        <p className="text-sm text-slate-500 mt-1">
          Stay updated with workforce activities and important alerts.
        </p>
      </div>

      <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl px-3 py-2.5 mb-5">
        <div className="flex items-center gap-2">
          {filters.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setActiveFilter(value)}
              className={`relative px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeFilter === value
                  ? "bg-slate-900 text-white"
                  : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <button
          onClick={onMarkAllRead}
          className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          <CheckCheck className="w-4 h-4" />
          Mark All as Read
        </button>
      </div>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Notification list                                                         */
/* -------------------------------------------------------------------------- */

function NotificationRow({ item, onClick }) {
  const Icon = CATEGORY_ICONS[item.category] || Cog;
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-start gap-4 px-6 py-5 border-b border-slate-100 last:border-b-0 text-left ${
        item.unread ? "bg-blue-50/40" : "bg-white"
      }`}
    >
      {item.unread ? (
        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
      ) : (
        <span className="w-1.5 flex-shrink-0" />
      )}

      {item.isSystem ? (
        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-slate-500" />
        </div>
      ) : item.avatar ? (
        <img
          src={item.avatar}
          alt={item.title}
          className="w-10 h-10 rounded-full object-cover flex-shrink-0"
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-slate-500" />
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm font-semibold text-slate-900">{item.title}</p>
          <span className="text-xs text-slate-400 whitespace-nowrap">{item.time}</span>
        </div>
        <p className="text-sm text-slate-500 mt-1">{item.description}</p>
        <span
          className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md mt-2 ${item.badge.tone}`}
        >
          {item.badge.label}
        </span>
      </div>
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/* Right rail                                                                 */
/* -------------------------------------------------------------------------- */

function SummaryCard({ summary }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5">
      <h3 className="text-base font-bold text-slate-900 mb-4 pb-3 border-b border-slate-100">
        Summary
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {summary.map(({ label, value, tone }) => (
          <div key={label} className="bg-slate-50 rounded-xl p-3">
            <p className="text-xs text-slate-400 mb-1">{label}</p>
            <p className={`text-xl font-bold ${tone}`}>{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function QuickActionsCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5">
      <h3 className="text-base font-bold text-slate-900 mb-4">Quick Actions</h3>
      <div className="flex flex-col gap-2">
        <button className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-3 text-sm font-medium text-slate-400 cursor-not-allowed" disabled>
          <Settings className="w-4 h-4 text-slate-400" />
          Notification Settings (coming soon)
        </button>
        <button className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-3 text-sm font-medium text-slate-400 cursor-not-allowed" disabled>
          <Download className="w-4 h-4 text-slate-400" />
          Export Logs (coming soon)
        </button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Main export                                                                */
/* -------------------------------------------------------------------------- */

export default function NotificationsCenterPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [items, setItems] = useState([]);
  const [summary, setSummary] = useState([]);
  const [error, setError] = useState("");

  async function load() {
    try {
      const [listRes, summaryRes] = await Promise.all([
        api.get(`/notifications?filter=${activeFilter}&search=${encodeURIComponent(search)}`),
        api.get("/notifications/summary"),
      ]);
      setItems(listRes.data);
      setSummary(summaryRes.data);
    } catch (err) {
      setError(err.message || "Failed to load notifications");
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilter]);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  async function handleRowClick(item) {
    if (!item.unread) return;
    try {
      await api.patch(`/notifications/${item.id}/read`);
      load();
    } catch (err) {
      setError(err.message || "Failed to mark as read");
    }
  }

  async function handleMarkAllRead() {
    try {
      await api.post("/notifications/mark-all-read");
      load();
    } catch (err) {
      setError(err.message || "Failed to mark all as read");
    }
  }

  const unreadCount = Number(summary.find((s) => s.label === "Unread")?.value || 0);

  return (
    <div className="w-screen h-screen overflow-hidden flex bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 h-full">
        <TopBar search={search} onSearchChange={setSearch} unreadCount={unreadCount} />
        <main className="flex-1 overflow-y-auto px-6 py-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
            <div className="xl:col-span-2 min-w-0">
              <PageHeader
                activeFilter={activeFilter}
                setActiveFilter={setActiveFilter}
                onMarkAllRead={handleMarkAllRead}
              />
              {error && <p className="text-sm font-medium text-red-600 mb-4">{error}</p>}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                {items.length === 0 ? (
                  <p className="text-sm text-slate-400 px-6 py-8 text-center">No notifications here.</p>
                ) : (
                  items.map((item) => (
                    <NotificationRow key={item.id} item={item} onClick={() => handleRowClick(item)} />
                  ))
                )}
              </div>
            </div>
            <div className="flex flex-col gap-5">
              <SummaryCard summary={summary} />
              <QuickActionsCard />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
