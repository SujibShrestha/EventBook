"use client"

import type { ReactNode } from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { getStoredToken, getStoredUser, type AuthUser } from "@/src/lib/auth-storage"

type AuthGateProps = {
  children: ReactNode
  role?: AuthUser["role"]
}

export function AuthGate({ children, role }: AuthGateProps) {
  const router = useRouter()
  const [isAllowed, setIsAllowed] = useState(false)

  useEffect(() => {
    const token = getStoredToken()
    const user = getStoredUser()

    if (!token || !user) {
      toast.error("Log in to continue.")
      router.replace("/login")
      return
    }

    if (role && user.role !== role) {
      toast.error("You do not have access to that page.")
      router.replace("/")
      return
    }

    const timeoutId = window.setTimeout(() => setIsAllowed(true), 0)

    return () => window.clearTimeout(timeoutId)
  }, [role, router])

  if (!isAllowed) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4 text-center text-sm font-medium text-slate-500">
        Checking access...
      </div>
    )
  }

  return children
}
