"use client"

import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { AIAssistant } from "@/components/ai-assistant"
import { motion } from "framer-motion"
import { useState } from "react"

export default function Settings() {
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: true,
    apiLogs: true,
    dataCollection: false,
  })

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings({ ...settings, [key]: !settings[key] })
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      <DashboardHeader />

      <main className="ml-64 pt-24 px-8 pb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="text-4xl font-bold text-foreground mb-8">Settings</h1>

          <div className="max-w-2xl space-y-4">
            {Object.entries(settings).map(([key, value], i) => (
              <motion.div
                key={key}
                className="glass p-6 rounded-xl flex items-center justify-between"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <label className="flex flex-col cursor-pointer">
                  <span className="font-semibold text-foreground capitalize">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </span>
                  <span className="text-sm text-foreground/60 mt-1">
                    {key === "notifications" && "Receive notifications about your account"}
                    {key === "darkMode" && "Use dark theme"}
                    {key === "apiLogs" && "Enable detailed API logging"}
                    {key === "dataCollection" && "Allow usage data collection"}
                  </span>
                </label>
                <button
                  onClick={() => toggleSetting(key as keyof typeof settings)}
                  className={`relative w-12 h-6 rounded-full transition-all ${value ? "bg-accent" : "bg-card/50"}`}
                >
                  <motion.div
                    className="absolute top-1 left-1 w-4 h-4 rounded-full bg-foreground"
                    animate={{ x: value ? 24 : 0 }}
                    transition={{ type: "spring", stiffness: 500 }}
                  />
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>

      <AIAssistant />
    </div>
  )
}
