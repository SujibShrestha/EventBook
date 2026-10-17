"use client"

import { useEffect, useMemo, useState } from "react"
import { createPortal } from "react-dom"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { listUserBookingCounts, type UserBookingCount } from "@/src/lib/admin-api"
import { getApiErrorMessage } from "@/src/lib/api-error"

type PortalTargets = {
  usersCount: HTMLElement | null
  confirmedCount: HTMLElement | null
  waitlistedCount: HTMLElement | null
  cancelledCount: HTMLElement | null
  searchControl: HTMLElement | null
  tableBody: HTMLElement | null
}

export function AttendeesClient() {
  const [users, setUsers] = useState<UserBookingCount[]>([])
  const [query, setQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [targets, setTargets] = useState<PortalTargets>({
    usersCount: null,
    confirmedCount: null,
    waitlistedCount: null,
    cancelledCount: null,
    searchControl: null,
    tableBody: null,
  })

  useEffect(() => {
    let isMounted = true

    async function loadUsers() {
      setIsLoading(true)

      try {
        const data = await listUserBookingCounts()

        if (isMounted) setUsers(data)
      } catch (error) {
        toast.error(getApiErrorMessage(error, "Unable to load attendee counts."))
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    void loadUsers()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setTargets({
        usersCount: document.getElementById("attendees-users-count"),
        confirmedCount: document.getElementById("attendees-confirmed-count"),
        waitlistedCount: document.getElementById("attendees-waitlisted-count"),
        cancelledCount: document.getElementById("attendees-cancelled-count"),
        searchControl: document.getElementById("attendees-search-control"),
        tableBody: document.getElementById("attendees-table-body"),
      })
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [])

  const filteredUsers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    if (!normalizedQuery) return users

    return users.filter((user) => {
      return (
        user.name.toLowerCase().includes(normalizedQuery) ||
        user.email.toLowerCase().includes(normalizedQuery) ||
        user.role.toLowerCase().includes(normalizedQuery)
      )
    })
  }, [query, users])

  const totals = users.reduce(
    (current, user) => ({
      total: current.total + user.totalBookings,
      confirmed: current.confirmed + user.confirmedBookings,
      waitlisted: current.waitlisted + user.waitlistedBookings,
      cancelled: current.cancelled + user.cancelledBookings,
    }),
    { total: 0, confirmed: 0, waitlisted: 0, cancelled: 0 },
  )

  return (
    <>
      {targets.usersCount ? createPortal(users.length, targets.usersCount) : null}
      {targets.confirmedCount ? createPortal(totals.confirmed, targets.confirmedCount) : null}
      {targets.waitlistedCount ? createPortal(totals.waitlisted, targets.waitlistedCount) : null}
      {targets.cancelledCount ? createPortal(totals.cancelled, targets.cancelledCount) : null}
      {targets.searchControl
        ? createPortal(
            <Input
              type="search"
              placeholder="Search users"
              className="pl-9"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />,
            targets.searchControl,
          )
        : null}
      {targets.tableBody
        ? createPortal(
            <>
              {isLoading ? (
                <tr>
                  <td className="px-4 py-10 text-center text-slate-500" colSpan={6}>
                    Loading attendee counts...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td className="px-4 py-10 text-center text-slate-500" colSpan={6}>
                    No users found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.userId}>
                    <td className="px-4 py-4">
                      <p className="font-semibold text-slate-950">{user.name}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </td>
                    <td className="px-4 py-4">
                      <Badge
                        className={
                          user.role === "ADMIN"
                            ? "border-indigo-200 bg-indigo-50 text-indigo-700"
                            : "border-slate-200 bg-slate-50 text-slate-700"
                        }
                      >
                        {user.role}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 font-semibold text-slate-950">{user.totalBookings}</td>
                    <td className="px-4 py-4 text-emerald-700">{user.confirmedBookings}</td>
                    <td className="px-4 py-4 text-amber-700">{user.waitlistedBookings}</td>
                    <td className="px-4 py-4 text-rose-700">{user.cancelledBookings}</td>
                  </tr>
                ))
              )}
            </>,
            targets.tableBody,
          )
        : null}
    </>
  )
}
