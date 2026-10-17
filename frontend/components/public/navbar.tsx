import Link from "next/link"
import { LayoutDashboard, LogIn, Ticket } from "lucide-react"

export function SiteNavbar() {
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
          <Link href="/admin/events" className="inline-flex items-center gap-2 transition-colors hover:text-slate-950">
            <LayoutDashboard className="size-4" aria-hidden="true" />
            Admin
          </Link>
        </nav>

        <div className="flex items-center gap-2">
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
        </div>
      </div>
    </header>
  )
}
