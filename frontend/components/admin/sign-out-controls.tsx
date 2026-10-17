"use client"

import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"

import { Button } from "@/components/ui/button"
import { clearAuth } from "@/src/lib/auth-storage"

export function SignOutButton({ className = "" }: { className?: string }) {
  const router = useRouter()

  function handleLogout() {
    clearAuth()
    router.push("/login")
  }

  return (
    <Button type="button" variant="outline" className={className} onClick={handleLogout}>
      <LogOut className="size-4" aria-hidden="true" />
      Sign out
    </Button>
  )
}
