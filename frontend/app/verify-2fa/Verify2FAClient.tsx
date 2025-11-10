"use client"

import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { verifyEmailCode, resendVerificationCode } from "@/lib/api"
import VerifyLockRoute from "@/components/VerifyLockRoute";

export default function Verify2FA() {
  const [code, setCode] = useState("")
  const [verified, setVerified] = useState(false)
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [email, setEmail] = useState("")
  const searchParams = useSearchParams()

  useEffect(() => {
    const userEmail = searchParams.get("email")
    if (userEmail) setEmail(userEmail)
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (code.length !== 6) return
    setLoading(true)

    try {
      const res = await verifyEmailCode(email, code)
      alert(res.message || "Email verified successfully!")
      setVerified(true)
    } catch (err: any) {
      alert(err.message || "Invalid or expired verification code.")
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (!email) {
      alert("Email missing. Please sign up again.")
      return
    }
    setResending(true)
    try {
      const res = await resendVerificationCode(email)
      alert(res.message || "New verification code sent to your email.")
    } catch (err: any) {
      alert(err.message || "Unable to resend code.")
    } finally {
      setResending(false)
    }
  }

  const handleCodeChange = (value: string) => {
    if (/^\d{0,6}$/.test(value)) setCode(value)
  }


  return (
    <VerifyLockRoute>
    <>
      <Navbar />
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
              <h1 className="text-2xl font-bold text-foreground mb-2">Two-Factor Authentication</h1>
              <p className="text-foreground/60">Enter the 6-digit code from your email</p>
            </div>

            {!verified ? (
              <form onSubmit={handleSubmit} className="space-y-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-4">Enter Code</label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => handleCodeChange(e.target.value)}
                    maxLength={6}
                    className="w-full px-4 py-3 rounded-lg bg-card/50 border border-primary/30 text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-center text-2xl tracking-widest font-bold"
                    placeholder="000000"
                  />
                </div>

                <button
                  type="submit"
                  disabled={code.length !== 6}
                  className={`w-full px-4 py-3 rounded-lg font-medium transition-all ${
                    code.length === 6
                      ? "bg-gradient-to-r from-primary to-accent text-foreground hover:shadow-lg hover:shadow-primary/50"
                      : "bg-card/50 text-foreground/50 cursor-not-allowed"
                  }`}
                >
                  Verify Code
                </button>
              </form>
            ) : (
              <motion.div
                className="py-6 text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-5xl mb-4">✓</div>
                <h2 className="text-xl font-bold text-foreground mb-2">Verification Successful</h2>
                <p className="text-foreground/70 mb-6">You are now securely signed in.</p>
                <Link
                  href="/dashboard"
                  className="inline-block px-6 py-2 rounded-lg bg-gradient-to-r from-primary to-accent text-foreground font-medium hover:shadow-lg hover:shadow-primary/50 transition-all"
                >
                  Go to Dashboard
                </Link>
              </motion.div>
            )}

            {/* Resend Code */}
            {!verified && (
              <div className="text-center border-t border-border/20 pt-6">
                <p className="text-sm text-foreground/60 mb-2">Didn't receive a code?</p>
                <button className="text-primary hover:text-accent transition-colors font-medium text-sm">Resend Code</button>
              </div>
            )}
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
    </VerifyLockRoute>
  )
}
