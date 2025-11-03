"use client";

import type React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Mail, Lock, Github } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");

  try {
    const res = await fetch("http://127.0.0.1:8000/api/token/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (!res.ok) {
      if (res.status === 401) throw new Error("Invalid username or password");
      throw new Error("Login failed. Please try again later.");
    }

    const data = await res.json();

    //  Store tokens securely
    localStorage.setItem("access", data.access);
    localStorage.setItem("refresh", data.refresh);

    //  Optional: store username/email for UI personalization
    localStorage.setItem("user_email", email);

    //  Redirect to dashboard
    router.replace("/dashboard");
  } catch (err: any) {
    setError(err.message || "Something went wrong during login");
  }
};


  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="glass rounded-2xl p-8 border border-primary/20">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
              <p className="text-foreground/60">
                Sign in to your NeuraStack account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-3.5 text-foreground/40"
                    size={18}
                  />
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

              <div>
                <label className="block text-sm font-medium mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-3.5 text-foreground/40"
                    size={18}
                  />
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

              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded" />
                  <span className="text-foreground/60">Remember me</span>
                </label>
                <Link
                  href="#"
                  className="text-primary hover:text-accent transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 bg-gradient-to-r from-primary via-accent to-secondary rounded-lg text-white font-semibold hover:shadow-lg glow-primary transition-smooth"
              >
                Sign In
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-primary/20" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-background text-foreground/60">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="px-4 py-3 bg-input border border-primary/30 rounded-lg hover:border-primary/50 transition-colors flex items-center justify-center gap-2">
                <Github size={18} />
                <span className="text-sm font-medium">GitHub</span>
              </button>
              <button className="px-4 py-3 bg-input border border-primary/30 rounded-lg hover:border-primary/50 transition-colors flex items-center justify-center gap-2">
                <Mail size={18} />
                <span className="text-sm font-medium">Google</span>
              </button>
            </div>

            <p className="text-center text-foreground/60 text-sm mt-8">
              {"Don't have an account? "}
              <Link
                href="/signup"
                className="text-primary hover:text-accent transition-colors font-medium"
              >
                Sign up
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
