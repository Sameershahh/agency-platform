"use client"

import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { AIAssistant } from "@/components/ai-assistant"
import { motion } from "framer-motion"

export default function Analytics() {
  const metrics = [
    { label: "Total Requests", value: "2.5M", change: "+15%" },
    { label: "Avg Response Time", value: "145ms", change: "-8%" },
    { label: "Error Rate", value: "0.12%", change: "-2%" },
    { label: "Cache Hit Ratio", value: "78%", change: "+5%" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      <DashboardHeader />

      <main className="ml-64 pt-24 px-8 pb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="text-4xl font-bold text-foreground mb-8">Analytics</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {metrics.map((metric, i) => (
              <motion.div
                key={i}
                className="glass p-6 rounded-xl glow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <p className="text-foreground/60 text-sm mb-2">{metric.label}</p>
                <div className="flex items-end justify-between">
                  <p className="text-3xl font-bold text-foreground">{metric.value}</p>
                  <p className="text-accent text-sm font-semibold">{metric.change}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="glass p-6 rounded-xl glow"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-xl font-bold text-foreground mb-6">Performance Over Time</h2>
            <div className="h-80 bg-card/20 rounded-lg flex items-center justify-center">
              <p className="text-foreground/50">Performance chart visualization</p>
            </div>
          </motion.div>
        </motion.div>
      </main>

      <AIAssistant />
    </div>
  )
}
