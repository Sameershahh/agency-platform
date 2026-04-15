import React from "react"

export default function Loading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
      </div>

      <div className="text-center">
        <div className="relative w-24 h-24 mx-auto mb-6">
          {/* Animated Spinner Outer */}
          <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
          <div className="absolute inset-0 border-4 border-t-primary rounded-full animate-spin" />
          
          {/* Pulsing Center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg shadow-lg animate-pulse" />
          </div>
        </div>

        <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent animate-pulse">
          NeuraStack Labs
        </h2>
        <p className="text-foreground/40 text-sm mt-2 tracking-widest uppercase">
          Optimizing Experience
        </p>
      </div>
    </div>
  )
}
