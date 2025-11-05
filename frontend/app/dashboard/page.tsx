"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Bell,
  LogOut,
  Settings,
  LayoutGrid,
  Users,
  Zap,
  Activity,
} from "lucide-react";
import { apiRequest } from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";

const initialChartData = [
  { name: "Jan", value: 400, projects: 24 },
  { name: "Feb", value: 300, projects: 13 },
  { name: "Mar", value: 200, projects: 98 },
  { name: "Apr", value: 278, projects: 39 },
  { name: "May", value: 189, projects: 48 },
  { name: "Jun", value: 239, projects: 43 },
];

const initialStats = [
  { label: "Active Projects", value: "—", icon: LayoutGrid, trend: "+0.0%" },
  { label: "Total Users", value: "—", icon: Users, trend: "+0.0%" },
  { label: "Processing Power", value: "—", icon: Zap, trend: "+0.0%" },
  { label: "System Uptime", value: "—", icon: Activity, trend: "—" },
];

function DashboardContent() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [stats, setStats] = useState(initialStats);
  const [chartData, setChartData] = useState(initialChartData);
  const [barData, setBarData] = useState(initialChartData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch dashboard data securely
  useEffect(() => {
    let mounted = true;

    const fetchDashboard = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await apiRequest("/dashboard/");

        const statList = [
          {
            label: "Active Projects",
            value: String(data.active_projects ?? "0"),
            icon: LayoutGrid,
            trend: "+0.0%",
          },
          {
            label: "Total Users",
            value: String(data.total_users ?? "0"),
            icon: Users,
            trend: "+0.0%",
          },
          {
            label: "Processing Power",
            value: data.processing_power ? String(data.processing_power) : "N/A",
            icon: Zap,
            trend: "+0.0%",
          },
          {
            label: "System Uptime",
            value: data.system_uptime ?? "N/A",
            icon: Activity,
            trend: "Stable",
          },
        ];

        if (!mounted) return;
        setStats(statList);

        // Line Chart Data
        if (Array.isArray(data.performance_trend) && data.performance_trend.length) {
          const mapped = data.performance_trend.map((p: any) => ({
            name: p.month ?? p.date ?? String(p.label ?? ""),
            value: Number(p.count ?? p.value ?? 0),
            projects: Number(p.count ?? 0),
          }));
          setChartData(mapped);
        }

        // Bar Chart Data
        if (Array.isArray(data.project_distribution) && data.project_distribution.length) {
          const mappedBar = data.project_distribution.map((d: any) => ({
            name: d.category || "Uncategorized",
            projects: Number(d.count ?? 0),
          }));
          setBarData(mappedBar);
        }

        setLoading(false);
      } catch (err: any) {
        setLoading(false);
        if (err.message.includes("Session expired")) {
          setError("Session expired. Please log in again.");
        } else if (err.message.includes("401")) {
          setError("You must be logged in to view the dashboard.");
        } else {
          setError(err.message || "Failed to load dashboard data.");
        }
      }
    };

    fetchDashboard();
    return () => {
      mounted = false;
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user_email");
    window.location.href = "/signin";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <motion.div
        className={`fixed left-0 top-0 h-screen glass border-r border-primary/20 transition-all duration-300 z-40 ${
          sidebarOpen ? "w-64" : "w-20"
        }`}
        initial={{ x: -256 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="p-6 flex items-center justify-between border-b border-primary/20">
          <motion.div
            className={`flex items-center gap-3 ${
              sidebarOpen ? "" : "justify-center w-full"
            }`}
            layout
          >
            <div className="w-8 h-8 bg-gradient-to-br from-primary via-accent to-secondary rounded-lg" />
            {sidebarOpen && <span className="gradient-text font-bold">NeuraStack</span>}
          </motion.div>
        </div>

        {/* Sidebar Links */}
        <nav className="p-4 space-y-2">
          <Link href="/dashboard">
            <motion.button
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/20 text-primary"
              whileHover={{ x: 4 }}
            >
              <span className="text-xl">📊</span>
              {sidebarOpen && <span className="text-sm font-medium">Dashboard</span>}
            </motion.button>
          </Link>

          <Link href="/dashboard/projects">
            <motion.button
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-foreground/60 hover:text-foreground"
              whileHover={{ x: 4 }}
            >
              <span className="text-xl">📁</span>
              {sidebarOpen && <span className="text-sm font-medium">Projects</span>}
            </motion.button>
          </Link>

          <Link href="/dashboard/analytics">
            <motion.button
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-foreground/60 hover:text-foreground"
              whileHover={{ x: 4 }}
            >
              <span className="text-xl">📈</span>
              {sidebarOpen && <span className="text-sm font-medium">Analytics</span>}
            </motion.button>
          </Link>
        </nav>

        {/* Bottom Buttons */}
        <div className="absolute bottom-6 left-4 right-4 space-y-2">
          <Link href="/dashboard/settings">
            <motion.button
              className="w-full flex items-center gap-3 px-4 py-3 text-foreground/60 hover:text-foreground transition-colors"
              whileHover={{ x: 4 }}
            >
              <Settings size={20} />
              {sidebarOpen && <span className="text-sm font-medium">Settings</span>}
            </motion.button>
          </Link>

          <motion.button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 transition-colors"
            whileHover={{ x: 4 }}
          >
            <LogOut size={20} />
            {sidebarOpen && <span className="text-sm font-medium">Logout</span>}
          </motion.button>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div
        className={`transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"}`}
        layout
      >
        {/* Top Bar */}
        <div className="glass border-b border-primary/20 sticky top-0 z-30">
          <div className="px-8 py-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
              <p className="text-foreground/60 text-sm">
                Welcome back to your AI command center
              </p>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/newsletter-popup">
                <button className="relative p-2 hover:bg-primary/10 rounded-lg transition-colors group">
                  <Bell
                    size={20}
                    className="text-foreground/60 group-hover:text-foreground"
                  />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                </button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full" />
                <div className="text-sm">
                  <p className="font-medium">
                    {typeof window !== "undefined"
                      ? localStorage.getItem("user_email") || "Admin"
                      : "Admin"}
                  </p>
                  <p className="text-foreground/60">Admin</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Dashboard Content */}
        <div className="p-8">
          {loading && (
            <div className="mb-6 p-4 text-sm text-foreground/60">
              Loading dashboard...
            </div>
          )}
          {error && <div className="mb-6 p-4 text-sm text-red-400">{error}</div>}

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  className="glass rounded-xl p-6 border border-primary/20 hover:border-primary/50 transition-smooth"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-foreground/60 text-sm mb-1">{stat.label}</p>
                      <p className="text-3xl font-bold">{stat.value}</p>
                    </div>
                    <Icon className="text-primary/50" size={24} />
                  </div>
                  <p className="text-sm text-green-400">{stat.trend}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Charts */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <motion.div
              className="glass rounded-xl p-6 border border-primary/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h3 className="text-lg font-bold mb-6">Performance Trends</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid stroke="rgba(124,58,237,0.1)" />
                  <XAxis stroke="rgba(232,233,255,0.4)" dataKey="name" />
                  <YAxis stroke="rgba(232,233,255,0.4)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(30,27,75,0.8)",
                      border: "1px solid rgba(124,58,237,0.3)",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#7c3aed"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div
              className="glass rounded-xl p-6 border border-primary/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <h3 className="text-lg font-bold mb-6">Project Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData}>
                  <CartesianGrid stroke="rgba(124,58,237,0.1)" />
                  <XAxis stroke="rgba(232,233,255,0.4)" dataKey="name" />
                  <YAxis stroke="rgba(232,233,255,0.4)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(30,27,75,0.8)",
                      border: "1px solid rgba(124,58,237,0.3)",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="projects" fill="#2563eb" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {/* Recent Activity */}
          <motion.div
            className="glass rounded-xl p-6 border border-primary/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h3 className="text-lg font-bold mb-6">Recent Activity</h3>
            <div className="space-y-4">
              {[
                { action: "Deployed new ML model", time: "2 hours ago", status: "success" },
                { action: "Analytics sync completed", time: "5 hours ago", status: "success" },
                { action: "Chatbot training started", time: "1 day ago", status: "pending" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 border border-primary/10 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{item.action}</p>
                    <p className="text-sm text-foreground/60">{item.time}</p>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      item.status === "success"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {item.status === "success" ? "Completed" : "Processing"}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    //<ProtectedRoute>
    <DashboardContent />
    //</ProtectedRoute>
  );
}
