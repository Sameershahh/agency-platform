"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Bell, Plus, Download, CreditCard } from "lucide-react"

const chartData = [
  { name: "Week 1", usage: 1200, limit: 2000 },
  { name: "Week 2", usage: 1900, limit: 2000 },
  { name: "Week 3", usage: 800, limit: 2000 },
  { name: "Week 4", usage: 1500, limit: 2000 },
]

const subscriptions = [
  {
    id: 1,
    name: "AI Automation Pro",
    tier: "Professional",
    price: 299,
    status: "active",
    nextBilling: "2025-11-31",
    usage: "1,450 / 2,000 tasks",
    features: ["Workflow Automation", "Process Optimization", "Priority Support"],
  },
  {
    id: 2,
    name: "Data Analytics Suite",
    tier: "Starter",
    price: 99,
    status: "active",
    nextBilling: "2025-11-15",
    usage: "850 / 5,000 datasets",
    features: ["Basic Analytics", "Standard Dashboards", "Email Support"],
  },
  {
    id: 3,
    name: "Smart Chatbot",
    tier: "Enterprise",
    price: 499,
    status: "trial",
    nextBilling: "2025-12-01",
    usage: "Trial - Unlimited",
    features: ["NLP Integration", "24/7 Support", "Custom Training"],
  },
]

const supportTickets = [
  {
    id: "TKT-2541",
    title: "API Integration Issues",
    status: "resolved",
    created: "2025-10-28",
    priority: "high",
  },
  {
    id: "TKT-2542",
    title: "Dashboard Performance Question",
    status: "open",
    created: "2025-10-30",
    priority: "medium",
  },
  {
    id: "TKT-2543",
    title: "Feature Request: Batch Processing",
    status: "in-progress",
    created: "2025-10-29",
    priority: "low",
  },
]

export default function ClientPortalPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "subscriptions" | "support" | "billing">("overview")
  const [selectedTicket, setSelectedTicket] = useState<(typeof supportTickets)[0] | null>(null)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="glass border-b border-primary/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1">Client Portal</h1>
            <p className="text-foreground/60 text-sm">Manage your AI services and subscriptions</p>
          </div>
          <div className="flex items-center gap-6">
            <button className="relative p-2 hover:bg-primary/10 rounded-lg transition-colors group">
              <Bell size={20} className="text-foreground/60 group-hover:text-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-primary/20">
              <div className="text-sm">
                <p className="font-medium">Sarah Chen</p>
                <p className="text-foreground/60 text-xs">Professional Plan</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="glass border-b border-primary/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-8">
            {[
              { id: "overview", label: "Overview" },
              { id: "subscriptions", label: "Subscriptions" },
              { id: "support", label: "Support" },
              { id: "billing", label: "Billing" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-1 py-4 border-b-2 transition-colors font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-foreground/60 hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Quick Stats */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-4 gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {[
                { label: "Active Services", value: "3", icon: "🚀" },
                { label: "Monthly Spend", value: "$897", icon: "💳" },
                { label: "Tasks Processed", value: "42.3K", icon: "⚡" },
                { label: "Avg Response Time", value: "245ms", icon: "⏱️" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  className="glass rounded-xl p-6 border border-primary/20 hover:border-primary/50 transition-smooth"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="text-3xl mb-3">{stat.icon}</div>
                  <p className="text-foreground/60 text-sm mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Usage Chart */}
            <motion.div
              className="glass rounded-xl p-6 border border-primary/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h3 className="text-lg font-bold mb-6">API Usage This Month</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid stroke="rgba(124,58,237,0.1)" />
                  <XAxis stroke="rgba(232,233,255,0.4)" />
                  <YAxis stroke="rgba(232,233,255,0.4)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(30,27,75,0.8)",
                      border: "1px solid rgba(124,58,237,0.3)",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="usage" fill="#7c3aed" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="limit" fill="rgba(124,58,237,0.2)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              className="glass rounded-xl p-6 border border-primary/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <h3 className="text-lg font-bold mb-6">Recent Activity</h3>
              <div className="space-y-3">
                {[
                  { action: "Successfully processed batch job", time: "2 hours ago", icon: "✓" },
                  { action: "Upgraded to Professional Plan", time: "3 days ago", icon: "⬆️" },
                  { action: "API key rotated for security", time: "1 week ago", icon: "🔑" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 border border-primary/10 rounded-lg">
                    <span className="text-2xl">{item.icon}</span>
                    <div className="flex-1">
                      <p className="font-medium">{item.action}</p>
                      <p className="text-sm text-foreground/60">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {/* Subscriptions Tab */}
        {activeTab === "subscriptions" && (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Your Subscriptions</h2>
              <button className="px-6 py-3 bg-gradient-to-r from-primary via-accent to-secondary rounded-lg text-white font-semibold hover:shadow-lg glow-primary transition-smooth flex items-center gap-2">
                <Plus size={18} />
                Add Service
              </button>
            </div>

            <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-6">
              {subscriptions.map((sub) => (
                <motion.div
                  key={sub.id}
                  className="glass rounded-xl p-6 border border-primary/20 hover:border-primary/50 transition-smooth flex flex-col"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold mb-1">{sub.name}</h3>
                      <p className="text-sm text-foreground/60">{sub.tier}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        sub.status === "active" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {sub.status === "active" ? "Active" : "Trial"}
                    </span>
                  </div>

                  <div className="mb-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
                    <p className="text-sm text-foreground/60 mb-1">Usage</p>
                    <p className="font-semibold text-primary">{sub.usage}</p>
                  </div>

                  <div className="mb-6 flex-1">
                    <p className="text-sm text-foreground/60 mb-2">Includes:</p>
                    <ul className="space-y-1 text-sm">
                      {sub.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-foreground/70">
                          <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-primary/20">
                    <p className="text-sm text-foreground/60 mb-3">
                      ${sub.price}/month • Next billing: {sub.nextBilling}
                    </p>
                    <button className="w-full px-4 py-2 border border-primary/30 rounded-lg hover:bg-primary/10 transition-colors font-medium text-sm">
                      Manage
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Support Tab */}
        {activeTab === "support" && (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Support Tickets</h2>
              <button className="px-6 py-3 bg-gradient-to-r from-primary via-accent to-secondary rounded-lg text-white font-semibold hover:shadow-lg glow-primary transition-smooth flex items-center gap-2">
                <Plus size={18} />
                New Ticket
              </button>
            </div>

            <div className="space-y-4">
              {supportTickets.map((ticket) => (
                <motion.div
                  key={ticket.id}
                  className="glass rounded-xl p-6 border border-primary/20 hover:border-primary/50 transition-smooth cursor-pointer"
                  onClick={() => setSelectedTicket(selectedTicket?.id === ticket.id ? null : ticket)}
                  whileHover={{ x: 5 }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-mono text-sm text-primary">{ticket.id}</span>
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            ticket.status === "resolved"
                              ? "bg-green-500/20 text-green-400"
                              : ticket.status === "in-progress"
                                ? "bg-blue-500/20 text-blue-400"
                                : "bg-yellow-500/20 text-yellow-400"
                          }`}
                        >
                          {ticket.status === "resolved"
                            ? "Resolved"
                            : ticket.status === "in-progress"
                              ? "In Progress"
                              : "Open"}
                        </span>
                      </div>
                      <h3 className="font-semibold mb-1">{ticket.title}</h3>
                      <p className="text-sm text-foreground/60">Created {ticket.created}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        ticket.priority === "high"
                          ? "bg-red-500/20 text-red-400"
                          : ticket.priority === "medium"
                            ? "bg-orange-500/20 text-orange-400"
                            : "bg-blue-500/20 text-blue-400"
                      }`}
                    >
                      {ticket.priority}
                    </span>
                  </div>

                  {selectedTicket?.id === ticket.id && (
                    <motion.div
                      className="mt-4 pt-4 border-t border-primary/20"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <p className="text-foreground/70 mb-4">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. This is the ticket details response.
                      </p>
                      <button className="px-4 py-2 bg-primary/20 border border-primary/30 rounded-lg hover:bg-primary/30 transition-colors text-sm font-medium">
                        View Full Ticket
                      </button>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Billing Tab */}
        {activeTab === "billing" && (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold">Billing & Invoices</h2>

            {/* Billing Summary */}
            <motion.div
              className="grid md:grid-cols-2 gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="glass rounded-xl p-6 border border-primary/20">
                <h3 className="text-lg font-bold mb-4">Current Balance</h3>
                <p className="text-4xl font-bold gradient-text mb-2">$897.00</p>
                <p className="text-foreground/60 text-sm mb-4">Due on November 15, 2025</p>
                <button className="w-full px-4 py-3 bg-gradient-to-r from-primary via-accent to-secondary rounded-lg text-white font-semibold hover:shadow-lg transition-smooth flex items-center justify-center gap-2">
                  <CreditCard size={18} />
                  Pay Now
                </button>
              </div>

              <div className="glass rounded-xl p-6 border border-primary/20">
                <h3 className="text-lg font-bold mb-4">Payment Method</h3>
                <div className="mb-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <p className="text-sm text-foreground/60 mb-1">Visa Ending in</p>
                  <p className="font-semibold text-lg">•••• •••• •••• 4242</p>
                  <p className="text-xs text-foreground/60 mt-2">Expires 12/26</p>
                </div>
                <button className="w-full px-4 py-2 border border-primary/30 rounded-lg hover:bg-primary/10 transition-colors font-medium text-sm">
                  Update Payment Method
                </button>
              </div>
            </motion.div>

            {/* Invoice History */}
            <motion.div
              className="glass rounded-xl p-6 border border-primary/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-lg font-bold mb-6">Invoice History</h3>
              <div className="space-y-3">
                {[
                  { date: "Oct 31, 2025", amount: "$897.00", status: "Paid" },
                  { date: "Sep 30, 2025", amount: "$799.00", status: "Paid" },
                  { date: "Aug 31, 2025", amount: "$799.00", status: "Paid" },
                ].map((invoice, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 border border-primary/10 rounded-lg hover:bg-primary/5 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <Download size={18} className="text-primary" />
                      <div>
                        <p className="font-medium">{invoice.date}</p>
                        <p className="text-sm text-foreground/60">{invoice.amount}</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-green-400">{invoice.status}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
