import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutGrid,
  LayoutDashboard,
  CalendarCheck,
  Search,
  Bell,
  MessageSquare,
  Grid3x3,
  Pencil,
  Mail,
  Phone,
  Calendar,
  User,
  ChevronRight,
  ShieldCheck,
  FileText,
  FileImage,
  Download,
  Clock3,
  Percent,
  Clock,
  CalendarX2,
  LogIn,
  Award,
  LogOut,
} from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

const STAT_ICONS = { Percent, Clock, CalendarCheck2: CalendarCheck, CalendarX2, LogIn, Award };
const DOC_ICONS = { pdf: FileText, image: FileImage };

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "My Profile", icon: User, href: "/profile" },
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
            <p className="text-white font-semibold text-sm">GreatHire</p>
            <p className="text-slate-400 text-xs">WorkTrack Pro</p>
          </div>
        </div>

        <nav className="px-3 flex flex-col gap-1">
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
          Logout
        </button>
      </div>
    </aside>
  );
}

/* -------------------------------------------------------------------------- */
/* TopBar                                                                     */
/* -------------------------------------------------------------------------- */

function TopBar() {
  return (
    <header className="flex items-center justify-between gap-4 px-6 py-4 bg-white border-b border-slate-200 flex-shrink-0">
      <div className="hidden md:flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-2 w-72">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent outline-none text-sm text-slate-600 placeholder-slate-400 w-full"
        />
      </div>

      <div className="flex items-center gap-5 flex-shrink-0 ml-auto">
        <Link to="/notifications" className="text-slate-500 hover:text-slate-700">
          <Bell className="w-5 h-5" />
        </Link>
        <Link to="/messages" className="text-slate-500 hover:text-slate-700">
          <MessageSquare className="w-5 h-5" />
        </Link>
        <Link to="/dashboard" className="text-slate-500 hover:text-slate-700">
          <Grid3x3 className="w-5 h-5" />
        </Link>
      </div>
    </header>
  );
}

/* -------------------------------------------------------------------------- */
/* Profile header                                                            */
/* -------------------------------------------------------------------------- */

function ProfileHeader({ profile, editing, onToggleEdit }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-5">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0">
            <img
              src={profile.avatar || "https://i.pravatar.cc/160?img=51"}
              alt={profile.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{profile.name}</h2>
            <p className="text-sm text-slate-500 mt-1">
              {profile.role} • ID: {profile.id}
            </p>
            <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-600 text-xs font-semibold px-2.5 py-1 rounded-full mt-3">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {profile.status}
            </span>
          </div>
        </div>

        <button
          onClick={onToggleEdit}
          className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          <Pencil className="w-3.5 h-3.5" />
          {editing ? "Cancel" : "Edit Profile"}
        </button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Personal Info + Account Settings                                          */
/* -------------------------------------------------------------------------- */

function PersonalInfoCard({ personalInfo, editing, form, onChange, onSave, saving }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-slate-700" />
          <h3 className="text-lg font-bold text-slate-900">Personal Information</h3>
        </div>
      </div>

      {!editing ? (
        <div className="flex flex-col gap-4">
          {personalInfo.map(({ label, value, secondary }) => (
            <div key={label}>
              <p className="text-xs text-slate-400 mb-1">{label}</p>
              <p className="text-sm font-medium text-slate-900">{value}</p>
              {secondary && <p className="text-sm text-slate-400 mt-0.5">{secondary}</p>}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Full Name</label>
            <input
              value={form.name}
              onChange={(e) => onChange("name", e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Email</label>
            <input
              value={form.email}
              onChange={(e) => onChange("email", e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Phone</label>
            <input
              value={form.phone}
              onChange={(e) => onChange("phone", e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <button
            onClick={onSave}
            disabled={saving}
            className="self-start bg-blue-600 hover:bg-blue-700 transition-colors text-white text-sm font-medium px-4 py-2 rounded-lg"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      )}
    </div>
  );
}

function AccountSettingsCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6">
      <div className="flex items-center gap-2 mb-5">
        <ShieldCheck className="w-5 h-5 text-slate-700" />
        <h3 className="text-lg font-bold text-slate-900">Account Settings</h3>
      </div>
      <div className="flex flex-col divide-y divide-slate-100">
        <div className="flex items-center justify-between py-3">
          <div>
            <p className="text-sm font-medium text-slate-900">Change Password</p>
            <p className="text-xs text-slate-400">Not available yet — no backend endpoint for this</p>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300" />
        </div>
        <div className="flex items-center justify-between py-3">
          <p className="text-sm font-medium text-slate-900">Theme</p>
          <span className="text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-md">
            Light Mode
          </span>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Work Summary + Documents + Recent Activity                                */
/* -------------------------------------------------------------------------- */

function WorkSummaryCard({ statCards }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6">
      <div className="flex items-center gap-2 mb-5">
        <Clock3 className="w-5 h-5 text-slate-700" />
        <h3 className="text-lg font-bold text-slate-900">Work Summary</h3>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {statCards.map(({ label, value, valueSuffix, icon, note }) => {
          const Icon = STAT_ICONS[icon] || Percent;
          return (
            <div key={label} className="bg-slate-50 rounded-xl p-4">
              <p className="text-xs text-slate-400 flex items-center gap-1.5 mb-2">
                <Icon className="w-3.5 h-3.5 text-slate-400" />
                {label}
              </p>
              <p className="text-lg font-bold text-slate-900">
                {value}
                {valueSuffix && <span className="text-xs font-medium text-slate-400 ml-1">{valueSuffix}</span>}
              </p>
              {note && <p className="text-xs text-slate-400 mt-0.5">{note}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DocumentsCard({ documents }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6">
      <div className="flex items-center gap-2 mb-5">
        <FileText className="w-5 h-5 text-slate-700" />
        <h3 className="text-lg font-bold text-slate-900">Documents</h3>
      </div>
      <div className="flex flex-col divide-y divide-slate-100">
        {documents.map(({ name, note, type }) => {
          const Icon = DOC_ICONS[type] || FileText;
          return (
            <div key={name} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-blue-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{name}</p>
                  <p className="text-xs text-slate-400">{note}</p>
                </div>
              </div>
              <button className="text-slate-400 hover:text-slate-600 flex-shrink-0">
                <Download className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RecentActivityCard({ items }) {
  if (!items.length) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex items-center gap-2 mb-2">
          <Clock3 className="w-5 h-5 text-slate-700" />
          <h3 className="text-lg font-bold text-slate-900">Recent Activity</h3>
        </div>
        <p className="text-sm text-slate-400">No activity yet today.</p>
      </div>
    );
  }
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6">
      <div className="flex items-center gap-2 mb-5">
        <Clock3 className="w-5 h-5 text-slate-700" />
        <h3 className="text-lg font-bold text-slate-900">Recent Activity</h3>
      </div>
      <div className="flex flex-col gap-4">
        {items.map(({ id, label, time }, i) => (
          <div key={id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span className={`w-2.5 h-2.5 rounded-full ${i === items.length - 1 ? "bg-blue-600" : "bg-slate-300"}`} />
              {i < items.length - 1 && <span className="w-px flex-1 bg-slate-200 mt-1" />}
            </div>
            <div className="pb-1">
              <p className="text-sm font-medium text-slate-900">{label}</p>
              <p className="text-xs text-slate-400">{time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Main export                                                                */
/* -------------------------------------------------------------------------- */

export default function MyProfilePage() {
  const [bundle, setBundle] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  async function load() {
    try {
      const [bundleRes, timelineRes] = await Promise.all([
        api.get("/employees/profile/bundle"),
        api.get("/employee/timeline"),
      ]);
      setBundle(bundleRes.data);
      setTimeline(timelineRes.data);
      setForm({
        name: bundleRes.data.profile.name,
        email: bundleRes.data.personalInfo.find((f) => f.label === "Contact")?.value || "",
        phone: bundleRes.data.personalInfo.find((f) => f.label === "Contact")?.secondary || "",
      });
    } catch (err) {
      setError(err.message || "Failed to load your profile");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      await api.put("/employees/profile/personal-info", form);
      await load();
      setEditing(false);
    } catch (err) {
      setError(err.message || "Failed to save changes");
    } finally {
      setSaving(false);
    }
  }

  if (error) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-slate-50">
        <p className="text-sm font-medium text-red-600">{error}</p>
      </div>
    );
  }
  if (!bundle) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-500">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen overflow-hidden flex bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 h-full">
        <TopBar />
        <main className="flex-1 overflow-y-auto px-6 py-6">
          <ProfileHeader
            profile={bundle.profile}
            editing={editing}
            onToggleEdit={() => setEditing((v) => !v)}
          />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 flex flex-col gap-5">
              <PersonalInfoCard
                personalInfo={bundle.personalInfo}
                editing={editing}
                form={form}
                onChange={(key, value) => setForm((f) => ({ ...f, [key]: value }))}
                onSave={handleSave}
                saving={saving}
              />
              <WorkSummaryCard statCards={bundle.statCards} />
              <DocumentsCard documents={bundle.documents} />
            </div>
            <div className="flex flex-col gap-5">
              <AccountSettingsCard />
              <RecentActivityCard items={timeline} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
