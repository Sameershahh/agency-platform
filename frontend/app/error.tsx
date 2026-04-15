"use client"

import { useEffect } from "react"
import Link from "next/link"
import { AlertCircle, RefreshCcw, Home } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service if available
    console.error("Application Error:", error)
  }, [error])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full glass p-8 rounded-2xl border border-red-500/20 shadow-2xl text-center">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="text-red-500" size={32} />
        </div>
        
        <h1 className="text-2xl font-bold text-foreground mb-3">Something went wrong</h1>
        <p className="text-foreground/60 mb-8">
          We apologize for the inconvenience. An unexpected error occurred while processing your request.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-all"
          >
            <RefreshCcw size={18} />
            Try again
          </button>
          
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg border border-primary/20 bg-background text-foreground font-medium hover:bg-primary/5 transition-all"
          >
            <Home size={18} />
            Back to Home
          </Link>
        </div>

        {process.env.NODE_ENV === "development" && (
          <div className="mt-8 p-4 bg-muted/50 rounded-lg text-left overflow-auto max-h-40">
            <p className="text-xs font-mono text-red-400 break-words">
              {error.message}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
