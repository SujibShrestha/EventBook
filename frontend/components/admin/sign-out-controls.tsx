"use client"

import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"

import { Button } from "@/components/ui/button"

function clearStoredAuth() {
  window.localStorage.removeItem("eventbook_token")
  window.localStorage.removeItem("eventbook_user")
  window.sessionStorage.removeItem("eventbook_token")
  window.sessionStorage.removeItem("eventbook_user")
}

export function SignOutButton({ className = "" }: { className?: string }) {
  const router = useRouter()

  function handleLogout() {
    clearStoredAuth()
    router.push("/login")
  }

  return (
    <Button type="button" variant="outline" className={className} onClick={handleLogout}>
      <LogOut className="size-4" aria-hidden="true" />
      Sign out
    </Button>
  )
}
