"use client"

import { usePathname } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

const HIDDEN_LAYOUT_PATHS = ["/forgot-password", "/2fa", "/signin", "/dashboard", "/client-portal"]

export function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const hideLayout = HIDDEN_LAYOUT_PATHS.some((p) => pathname.startsWith(p))

  return (
    <>
      {!hideLayout && <Navbar />}
      {children}
      {!hideLayout && <Footer />}
    </>
  )
}
