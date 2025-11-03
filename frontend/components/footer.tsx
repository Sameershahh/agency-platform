"use client"

import { motion } from "framer-motion"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-primary/20 glass mt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary via-accent to-secondary rounded-lg" />
              <span className="gradient-text font-bold">NeuraStack</span>
            </div>
            <p className="text-foreground/60 text-sm">Building the future of intelligent digital systems.</p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h4 className="font-semibold mb-4 text-foreground">Product</h4>
            <ul className="space-y-2">
              {["Services", "Pricing", "Dashboard"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-foreground/60 hover:text-foreground transition-colors text-sm">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Company */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="font-semibold mb-4 text-foreground">Company</h4>
            <ul className="space-y-2">
              {["About", "Blog", "Careers"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-foreground/60 hover:text-foreground transition-colors text-sm">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Legal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h4 className="font-semibold mb-4 text-foreground">Legal</h4>
            <ul className="space-y-2">
              {["Privacy", "Terms", "Contact"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-foreground/60 hover:text-foreground transition-colors text-sm">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="border-t border-primary/10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-foreground/50 text-sm">© 2025 NeuraStack Labs. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            {["Twitter", "LinkedIn", "GitHub"].map((social) => (
              <Link
                key={social}
                href="#"
                className="text-foreground/50 hover:text-foreground transition-colors text-sm"
              >
                {social}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
