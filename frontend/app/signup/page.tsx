"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Mail, Lock, User } from "lucide-react"

export default function SignUpPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      alert("Passwords do not match.")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("http://127.0.0.1:8000/api/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: name,
          email,
          password,
          confirm_password: confirmPassword,
        }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        let errMsg = "Failed to register. Please try again."
        if (data?.detail) errMsg = data.detail
        else if (data?.message) errMsg = data.message
        else if (typeof data === "object")
          errMsg = Object.values(data).flat().join(" ") || errMsg

        alert(errMsg)
        return
      }

      alert("✅ Account created successfully! Please verify your email before logging in.")
      window.location.href = "/signin"
    } catch (error) {
      console.error("Registration error:", error)
      alert("Something went wrong. Please check your internet connection and try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4 py-12">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="glass rounded-2xl p-8 border border-primary/20">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">Create Account</h1>
              <p className="text-foreground/60">
                Join thousands of innovators using NeuraStack
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 text-foreground/40" size={18} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-input border border-primary/30 rounded-lg focus:border-primary focus:outline-none transition-colors text-foreground placeholder-foreground/40"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 text-foreground/40" size={18} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-input border border-primary/30 rounded-lg focus:border-primary focus:outline-none transition-colors text-foreground placeholder-foreground/40"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 text-foreground/40" size={18} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-input border border-primary/30 rounded-lg focus:border-primary focus:outline-none transition-colors text-foreground placeholder-foreground/40"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 text-foreground/40" size={18} />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-input border border-primary/30 rounded-lg focus:border-primary focus:outline-none transition-colors text-foreground placeholder-foreground/40"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Terms */}
              <label className="flex items-start gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded mt-0.5" required />
                <span className="text-sm text-foreground/60">
                  I agree to the{" "}
                  <Link href="#" className="text-primary hover:text-accent transition-colors">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="#" className="text-primary hover:text-accent transition-colors">
                    Privacy Policy
                  </Link>
                </span>
              </label>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-gradient-to-r from-primary via-accent to-secondary rounded-lg text-white font-semibold hover:shadow-lg glow-primary transition-smooth disabled:opacity-70"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
