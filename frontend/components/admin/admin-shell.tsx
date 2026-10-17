import type { ReactNode } from "react"
import Link from "next/link"
import { CalendarDays, Home, PlusCircle, Ticket, Users } from "lucide-react"

import { SignOutButton } from "@/components/admin/sign-out-controls"
import { Badge } from "@/components/ui/badge"

type AdminShellProps = {
  activeHref: "/admin/events" | "/admin/events/new" | "/admin/attendees"
  title: string
  subtitle: string
  children: ReactNode
}

const navItems = [
  { href: "/admin/events", label: "Events", icon: CalendarDays },
  { href: "/admin/events/new", label: "Create", icon: PlusCircle },
  { href: "/admin/attendees", label: "Attendees", icon: Users },
] as const

export function AdminShell({ activeHref, title, subtitle, children }: AdminShellProps) {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-950">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-white px-4 py-5 md:block">
        <Link href="/admin/events" className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <Ticket className="size-5" aria-hidden="true" />
          </span>
          <span>
            <span className="block text-lg font-semibold leading-6">EventBook</span>
            <span className="block text-xs font-medium uppercase tracking-wide text-slate-500">Admin console</span>
          </span>
        </Link>

        <nav className="mt-8 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = item.href === activeHref

            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  isActive
                    ? "flex h-10 items-center gap-3 rounded-lg bg-slate-950 px-3 text-sm font-semibold text-white"
                    : "flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950"
                }
              >
                <Icon className="size-4" aria-hidden="true" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="absolute bottom-5 left-4 right-4 space-y-3">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="truncate text-sm font-semibold text-slate-950">Admin user</p>
            <p className="truncate text-xs text-slate-500">Signed in session</p>
            <Badge className="mt-3 border-emerald-200 bg-emerald-50 text-emerald-700">ADMIN</Badge>
          </div>
          <SignOutButton className="h-10 w-full justify-start rounded-lg border-slate-200 bg-white text-slate-700 hover:bg-slate-100" />
        </div>
      </aside>

      <div className="md:pl-64">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 px-4 py-4 backdrop-blur md:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">Admin</p>
              <h1 className="text-2xl font-semibold leading-8 text-slate-950">{title}</h1>
              <p className="text-sm leading-6 text-slate-600">{subtitle}</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/"
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
              >
                <Home className="size-4" aria-hidden="true" />
                Public site
              </Link>
              <SignOutButton className="h-10 rounded-lg border-slate-200 bg-white text-slate-700 md:hidden" />
            </div>
          </div>

          <nav className="mt-4 flex gap-2 overflow-x-auto md:hidden">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = item.href === activeHref

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={
                    isActive
                      ? "inline-flex h-9 items-center gap-2 rounded-lg bg-slate-950 px-3 text-sm font-semibold text-white"
                      : "inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700"
                  }
                >
                  <Icon className="size-4" aria-hidden="true" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </header>

        <main className="px-4 py-6 md:px-8">{children}</main>
      </div>
    </div>
  )
}
