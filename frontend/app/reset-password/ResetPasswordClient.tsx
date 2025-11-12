"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { confirmPasswordReset, verifyPasswordResetToken } from "@/lib/api";

export default function ResetPasswordClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams?.get("token") ?? "";
  
  const [formData, setFormData] = useState({ password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [error, setError] = useState("");

  // Verify token on mount
  useEffect(() => {
    if (!token) {
      setTokenValid(false);
      setError("No reset token provided");
      return;
    }

    const verifyToken = async () => {
      try {
        await verifyPasswordResetToken(token);
        setTokenValid(true);
      } catch (err: any) {
        setTokenValid(false);
        setError(err.message || "Invalid or expired reset link");
      }
    };

    verifyToken();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setLoading(true);

    try {
      await confirmPasswordReset({
        token,
        new_password: formData.password,
      });
      setSuccess(true);
      
      // Redirect to signin after 3 seconds
      setTimeout(() => {
        router.push("/signin");
      }, 3000);
    } catch (err: any) {
      console.error("Error resetting password:", err);
      setError(err.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while verifying token
  if (tokenValid === null) {
    return (
      <>
        <main className="min-h-screen bg-background flex items-center justify-center px-4 relative overflow-hidden pt-28">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-72 h-72 bg-accent/20 rounded-full blur-3xl" />
          </div>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-foreground/60">Verifying reset link...</p>
          </div>
        </main>
      </>
    );
  }

  // Show error if token is invalid
  if (tokenValid === false) {
    return (
      <>
        <main className="min-h-screen bg-background flex items-center justify-center px-4 relative overflow-hidden pt-28">
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
              <div className="text-center">
                <div className="text-5xl mb-4">⚠️</div>
                <h1 className="text-2xl font-bold text-foreground mb-2">Invalid Reset Link</h1>
                <p className="text-foreground/60 mb-6">{error}</p>
                <Link
                  href="/forgot-password"
                  className="inline-block px-6 py-2 rounded-lg bg-gradient-to-r from-primary to-accent text-foreground font-medium hover:shadow-lg hover:shadow-primary/50 transition-all"
                >
                  Request New Link
                </Link>
              </div>
            </motion.div>
          </div>
        </main>
      </>
    );
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
              <h1 className="text-2xl font-bold text-foreground mb-2">Create New Password</h1>
              <p className="text-foreground/60">Enter your new password below</p>
            </div>

            {!success ? (
              <form onSubmit={handleSubmit} className="space-y-4 mb-6">
                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm text-red-500">
                    {error}
                  </div>
                )}

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
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/50 hover:text-foreground"
                      disabled={loading}
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
                    disabled={loading}
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
                  disabled={loading}
                  className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-primary to-accent text-foreground font-medium hover:shadow-lg hover:shadow-primary/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Resetting..." : "Reset Password"}
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
                <p className="text-sm text-foreground/50 mb-4">Redirecting to sign in...</p>
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