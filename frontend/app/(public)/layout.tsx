import type { ReactNode } from "react"

import { SiteNavbar } from "@/components/public/navbar"

type PublicLayoutProps = {
  children: ReactNode
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <SiteNavbar />
      {children}
    </div>
  )
}
