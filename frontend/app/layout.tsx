import type React from "react"
import type { Metadata } from "next"
import { Manrope } from "next/font/google"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { AIAssistant } from "@/components/ai-assistant"

const manrope = Manrope({ subsets: ["latin"] })
const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "NeuraStack Labs - AI-Powered Solutions",
  description: "Building the next era of intelligent digital systems with advanced AI and Web solutions.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${manrope.className} font-sans antialiased bg-background text-foreground`}>
        {children}
        <AIAssistant />
        <Analytics />
      </body>
    </html>
  )
}
