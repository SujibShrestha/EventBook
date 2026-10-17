import type { ReactNode } from "react"

import { AuthGate } from "@/components/auth/auth-gate"

type AdminLayoutProps = {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return <AuthGate role="ADMIN">{children}</AuthGate>
}
