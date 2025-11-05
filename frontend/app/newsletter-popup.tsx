"use client"

import type React from "react"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"

export function NewsletterPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)

  useEffect(() => {
    // Show popup after 5 seconds on initial visit
    const timer = setTimeout(() => {
      setIsOpen(true)
    }, 5000)
    return () => clearTimeout(timer)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Newsletter subscription:", email)
    setSubscribed(true)
    setTimeout(() => {
      setIsOpen(false)
      setSubscribed(false)
      setEmail("")
    }, 3000)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
        >
          {/* Backdrop blur */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="relative glass p-8 rounded-2xl max-w-md w-full glow"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-foreground/50 hover:text-foreground text-2xl"
            >
              ✕
            </button>

            {!subscribed ? (
              <>
                <h2 className="text-2xl font-bold text-foreground mb-2">Stay Updated with AI Innovations</h2>
                <p className="text-foreground/60 mb-6">
                  Subscribe to our newsletter for the latest insights and updates from NeuraStack Labs.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 rounded-lg bg-card/50 border border-primary/30 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    type="submit"
                    className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-primary to-accent text-foreground font-medium hover:shadow-lg hover:shadow-primary/50 transition-all"
                  >
                    Subscribe Now
                  </button>
                </form>

                <p className="text-xs text-foreground/50 mt-4 text-center">
                  We respect your privacy. No spam, just value.
                </p>
              </>
            ) : (
              <motion.div
                className="text-center py-6"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="text-4xl mb-3">✓</div>
                <h3 className="text-xl font-bold text-foreground mb-2">Welcome Aboard!</h3>
                <p className="text-foreground/60">Check your email for confirmation.</p>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
