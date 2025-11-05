"use client"

import { motion } from "framer-motion"
import { useState } from "react"

export function DashboardHeader() {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)

  const notifications = [
    { id: 1, message: "New API usage spike detected", time: "5 min ago" },
    { id: 2, message: "Team member joined", time: "1 hour ago" },
    { id: 3, message: "Monthly report ready", time: "3 hours ago" },
  ]

  return (
    <motion.header
      className="fixed top-0 right-0 left-64 bg-background/80 backdrop-blur-xl border-b border-border/20 px-8 py-4 z-40"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-end gap-4">
        {/* Notifications */}
        <div className="relative">
          <motion.button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg hover:bg-card/50 transition-all text-2xl"
            whileHover={{ scale: 1.1 }}
          >
            🔔
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-accent" />
          </motion.button>

          {showNotifications && (
            <motion.div
              className="absolute right-0 mt-2 w-80 glass rounded-xl p-4 space-y-3"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <h3 className="font-semibold text-foreground mb-4">Notifications</h3>
              {notifications.map((notif) => (
                <motion.div
                  key={notif.id}
                  className="p-3 rounded-lg bg-card/50 border border-border/20 cursor-pointer hover:bg-card transition-all"
                  whileHover={{ x: 5 }}
                >
                  <p className="text-sm text-foreground">{notif.message}</p>
                  <p className="text-xs text-foreground/50 mt-1">{notif.time}</p>
                </motion.div>
              ))}
              <button className="w-full px-3 py-2 rounded-lg text-primary hover:bg-primary/10 transition-all text-sm font-medium mt-4">
                View All Notifications
              </button>
            </motion.div>
          )}
        </div>

        {/* Profile */}
        <div className="relative">
          <motion.button
            onClick={() => setShowProfile(!showProfile)}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-foreground font-bold"
            whileHover={{ scale: 1.1 }}
          >
            JD
          </motion.button>

          {showProfile && (
            <motion.div
              className="absolute right-0 mt-2 w-56 glass rounded-xl overflow-hidden"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="p-4 border-b border-border/20">
                <p className="font-semibold text-foreground">John Doe</p>
                <p className="text-sm text-foreground/60">john@example.com</p>
              </div>
              <div className="p-3 space-y-1">
                <button className="w-full px-3 py-2 text-left text-foreground/70 hover:text-foreground hover:bg-card/50 rounded-lg transition-all text-sm">
                  View Profile
                </button>
                <button className="w-full px-3 py-2 text-left text-foreground/70 hover:text-foreground hover:bg-card/50 rounded-lg transition-all text-sm">
                  Settings
                </button>
                <button className="w-full px-3 py-2 text-left text-destructive hover:bg-destructive/10 rounded-lg transition-all text-sm">
                  Logout
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.header>
  )
}
