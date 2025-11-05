"use client"

import React from "react"
import { motion } from "framer-motion"

const positions = [
  { title: "Senior AI Engineer", location: "San Francisco, CA", type: "Full-time" },
  { title: "ML Researcher", location: "San Francisco, CA", type: "Full-time" },
  { title: "Frontend Developer", location: "Remote", type: "Full-time" },
  { title: "DevOps Engineer", location: "Remote", type: "Full-time" },
  { title: "Product Manager", location: "San Francisco, CA", type: "Full-time" },
  { title: "Sales Representative", location: "Multiple", type: "Full-time" },
]

export default function Careers() {
  return (
    <main className="min-h-screen bg-background pt-32">
      {/* Header */}
      <section className="px-4 py-16 border-b border-border/20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            className="text-5xl md:text-6xl font-bold mb-6 gradient-text"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Join Our Neural Future
          </motion.h1>
          <motion.p
            className="text-xl text-foreground/60"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            We're looking for talented individuals to help us build the future of AI
          </motion.p>
        </div>
      </section>

      {/* Positions */}
      <section className="px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {positions.map((position, index) => (
              <motion.div
                key={index}
                className="glass p-6 rounded-lg group cursor-pointer hover:glass-dark transition-all"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ x: 5 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {position.title}
                    </h3>
                    <p className="text-foreground/60 text-sm mt-1">
                      {position.location} • {position.type}
                    </p>
                  </div>
                  <button className="px-6 py-2 rounded-lg bg-gradient-to-r from-primary to-accent text-foreground font-medium hover:shadow-lg hover:shadow-primary/50 transition-all">
                    Apply Now
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="px-4 py-20 bg-card/10 border-y border-border/20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center gradient-text">
            Why Join NeuraStack Labs?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "💰", title: "Competitive Salary", desc: "Industry-leading compensation" },
              { icon: "🏠", title: "Flexible Work", desc: "Remote or office flexibility" },
              { icon: "📚", title: "Learning", desc: "Continuous skill development" },
              { icon: "🌍", title: "Impact", desc: "Work on cutting-edge AI" },
            ].map((benefit, i) => (
              <motion.div
                key={i}
                className="glass p-6 rounded-lg text-center"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="text-3xl mb-3">{benefit.icon}</div>
                <p className="font-semibold text-foreground">{benefit.title}</p>
                <p className="text-sm text-foreground/60 mt-2">{benefit.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
