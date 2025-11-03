"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Home, ArrowRight } from "lucide-react"

export default function NotFoundPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4 relative">
        {/* Animated background */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <motion.div
            className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-to-r from-primary/20 via-accent/20 to-secondary/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.7, 0.5],
            }}
            transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}
          />
        </div>

        <motion.div
          className="text-center max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1
            className="text-9xl font-bold mb-4 gradient-text"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            404
          </motion.h1>

          <h2 className="text-3xl md:text-4xl font-bold mb-4 mt-8">Page Not Found</h2>

          <p className="text-lg text-foreground/60 mb-12">
            The page you're looking for doesn't exist or has been moved. Let's get you back on track.
          </p>

          <motion.div
            className="flex flex-col md:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link
              href="/"
              className="px-8 py-4 bg-gradient-to-r from-primary via-accent to-secondary rounded-full text-white font-semibold hover:shadow-lg glow-primary transition-smooth flex items-center justify-center gap-2"
            >
              <Home size={20} />
              Back to Home
            </Link>

            <Link
              href="/contact"
              className="px-8 py-4 border border-primary/40 rounded-full text-foreground font-semibold hover:bg-primary/10 transition-smooth flex items-center justify-center gap-2"
            >
              Contact Support
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        </motion.div>
      </div>

      <Footer />
    </main>
  )
}
