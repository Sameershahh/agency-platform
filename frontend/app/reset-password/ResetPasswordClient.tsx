"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { confirmPasswordReset } from "@/lib/api";

export default function ResetPasswordClient() {
  const searchParams = useSearchParams();
  const token = searchParams?.get("token") ?? "";
  const [formData, setFormData] = useState({ password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    try {
      await confirmPasswordReset({
        token,
        new_password: formData.password,
      });
      setSuccess(true);
    } catch (err) {
      console.error("Error resetting password:", err);
      alert("Failed to reset password. Please try again.");
    }
  };

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
              <h1 className="text-2xl font-bold text-foreground mb-2">Create New Password</h1>
              <p className="text-foreground/60">Enter your new password below</p>
            </div>

            {!success ? (
              <form onSubmit={handleSubmit} className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">New Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-card/50 border border-primary/30 text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/50 hover:text-foreground"
                    >
                      {showPassword ? "👁️" : "👁️‍🗨️"}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Confirm Password</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-card/50 border border-primary/30 text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    placeholder="••••••••"
                  />
                </div>

                <div className="bg-card/50 border border-accent/30 rounded-lg p-3 text-sm text-foreground/70">
                  <p className="font-semibold text-foreground mb-2">Password Requirements:</p>
                  <ul className="space-y-1 text-xs">
                    <li>✓ At least 8 characters</li>
                    <li>✓ Contains uppercase letter</li>
                    <li>✓ Contains number</li>
                    <li>✓ Contains special character</li>
                  </ul>
                </div>

                <button
                  type="submit"
                  className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-primary to-accent text-foreground font-medium hover:shadow-lg hover:shadow-primary/50 transition-all"
                >
                  Reset Password
                </button>
              </form>
            ) : (
              <motion.div
                className="py-6 text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-5xl mb-4 inline-block">✓</div>
                <h2 className="text-xl font-bold text-foreground mb-2">Password Reset Successful</h2>
                <p className="text-foreground/70 mb-6">Your password has been securely updated.</p>
                <Link
                  href="/signin"
                  className="inline-block px-6 py-2 rounded-lg bg-gradient-to-r from-primary to-accent text-foreground font-medium hover:shadow-lg hover:shadow-primary/50 transition-all"
                >
                  Back to Sign In
                </Link>
              </motion.div>
            )}
          </motion.div>
        </div>
      </main>
      {/* <Footer /> */}
    </>
  );
}
