"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { LayoutDashboard, LogIn, LogOut, Ticket } from "lucide-react"

import { clearAuth, getStoredUser, type AuthUser } from "@/src/lib/auth-storage"

function useNavbarUser() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setUser(getStoredUser())
      setIsReady(true)
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [])

  return { user, isReady }
}

export function SiteNavbar() {
  const router = useRouter()
  const { user, isReady } = useNavbarUser()

  function handleSignOut() {
    clearAuth()
    router.push("/login")
  }

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <Ticket className="size-5" aria-hidden="true" />
          </span>
          <span className="text-lg font-semibold tracking-tight">EventBook</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-semibold text-slate-600 md:flex">
          <Link href="/" className="text-indigo-700">
            Browse Events
          </Link>
          <Link href="/bookings" className="transition-colors hover:text-slate-950">
            My Bookings
          </Link>
          {isReady && user?.role === "ADMIN" ? (
            <Link href="/admin/events" className="inline-flex items-center gap-2 transition-colors hover:text-slate-950">
              <LayoutDashboard className="size-4" aria-hidden="true" />
              Admin
            </Link>
          ) : null}
        </nav>

        <div className="flex items-center gap-2">
          {isReady && user ? (
            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex h-10 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100"
            >
              <LogOut className="size-4" aria-hidden="true" />
              Sign out
            </button>
          ) : null}

          {isReady && !user ? (
            <>
              <Link
                href="/login"
                className="inline-flex h-10 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100"
              >
                <LogIn className="size-4" aria-hidden="true" />
                Log in
              </Link>
              <Link
                href="/register"
                className="hidden h-10 items-center rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 sm:inline-flex"
              >
                Sign up
              </Link>
            </>
          ) : null}
        </div>
      </div>

      <nav className="mx-auto flex max-w-7xl gap-4 overflow-x-auto border-t border-slate-100 px-4 py-2 text-sm font-semibold text-slate-600 md:hidden">
        <Link href="/" className="shrink-0 text-indigo-700">
          Browse Events
        </Link>
        <Link href="/bookings" className="shrink-0 transition-colors hover:text-slate-950">
          My Bookings
        </Link>
        {isReady && user?.role === "ADMIN" ? (
          <Link href="/admin/events" className="inline-flex shrink-0 items-center gap-2 transition-colors hover:text-slate-950">
            <LayoutDashboard className="size-4" aria-hidden="true" />
            Admin
          </Link>
        ) : null}
      </nav>
    </header>
  )
}
