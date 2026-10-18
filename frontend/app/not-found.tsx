import Link from "next/link"
import { CalendarX2 } from "lucide-react"

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-16">
      <section className="w-full max-w-md text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700">
          <CalendarX2 className="size-7" aria-hidden="true" />
        </div>
        <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-indigo-700">404</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-950">Page not found</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex h-10 items-center justify-center rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700"
        >
          Browse events
        </Link>
      </section>
    </main>
  )
}
