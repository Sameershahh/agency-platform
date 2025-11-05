"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { useState } from "react"

export function DashboardSidebar() {
  const [isOpen, setIsOpen] = useState(true)

  const menuItems = [
    { icon: "📊", label: "Overview", href: "/dashboard" },
    { icon: "📈", label: "Analytics", href: "/dashboard/analytics" },
    { icon: "⚙️", label: "Settings", href: "/dashboard/settings" },
    { icon: "👥", label: "Team", href: "/dashboard/team" },
    { icon: "🔐", label: "Security", href: "/dashboard/security" },
  ]

  return (
    <motion.aside
      className={`glass-dark fixed left-0 top-0 h-screen pt-20 border-r border-border/20 transition-all ${
        isOpen ? "w-64" : "w-20"
      }`}
      initial={{ x: -256 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-4 space-y-2">
        {menuItems.map((item, i) => (
          <Link key={i} href={item.href}>
            <motion.div
              className="flex items-center gap-4 px-4 py-3 rounded-lg text-foreground/70 hover:bg-primary/20 cursor-pointer transition-all group"
              whileHover={{ x: 5 }}
            >
              <span className="text-xl">{item.icon}</span>
              {isOpen && <span className="group-hover:text-primary transition-colors">{item.label}</span>}
            </motion.div>
          </Link>
        ))}
      </div>
    </motion.aside>
  )
}
