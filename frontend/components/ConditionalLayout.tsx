"use client"

import { usePathname } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isDashboard = pathname?.startsWith("/dashboard")

  return (
    <>
      {!isDashboard && <Navbar />}
      <main className={!isDashboard ? "pt-20" : ""}>
        {children}
      </main>
      {!isDashboard && <Footer />}
    </>
  )
}
