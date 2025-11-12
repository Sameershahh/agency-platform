"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { requestPasswordReset } from "@/lib/api"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await requestPasswordReset(email)
      setSubmitted(true)
    } catch (err: any) {
      console.error("Error requesting password reset:", err)
      setError(err.message || "Failed to send reset link. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* <Navbar /> */}
      <main className="min-h-screen bg-background flex items-center justify-center px-4 relative overflow-hidden pt-28">
        {/* Background gradients */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-accent/20 rounded-full blur-3xl" />
        </div>

        <div className="w-full max-w-md">
          <motion.div
            className="glass p-8 rounded-2xl glow-primary"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Header */}
            <div className="text-center mb-8">
              <Link href="/" className="inline-flex items-center gap-2 mb-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent" />
                <span className="font-bold text-lg gradient-text">NeuraStack Labs</span>
              </Link>
              <h1 className="text-2xl font-bold text-foreground mb-2">Reset Password</h1>
              <p className="text-foreground/60">
                {submitted ? "Check your email for reset instructions" : "Enter your email to reset your password"}
              </p>
            </div>

            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-4 mb-6">
                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm text-red-500">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-card/50 border border-primary/30 text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    placeholder="you@example.com"
                    disabled={loading}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-primary to-accent text-foreground font-medium hover:shadow-lg hover:shadow-primary/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>
              </form>
            ) : (
              <motion.div
                className="py-6 text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-4xl mb-4">✉️</div>
                <p className="text-foreground/70 mb-6">
                  We've sent a password reset link to <span className="font-medium text-foreground">{email}</span>
                </p>
                <div className="bg-card/50 border border-accent/30 rounded-lg p-4 text-sm text-foreground/70 mb-6">
                  <p className="mb-2">Check your email and follow the link to reset your password.</p>
                  <p className="text-xs text-foreground/50">The link will expire in 15 minutes.</p>
                </div>
                <p className="text-sm text-foreground/50 mb-4">
                  Didn't receive the email? Check your spam folder or{" "}
                  <button
                    onClick={() => {
                      setSubmitted(false)
                      setEmail("")
                    }}
                    className="text-primary hover:text-accent transition-colors underline"
                  >
                    try again
                  </button>
                </p>
              </motion.div>
            )}

            {/* Back to Sign In */}
            <div className="text-center">
              <Link href="/signin" className="text-primary hover:text-accent transition-colors font-medium">
                ← Back to Sign In
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
       {/* <Footer /> */}
    </>
  )
}