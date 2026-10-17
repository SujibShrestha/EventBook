"use client"

import type { FormEvent } from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AlertCircle, ArrowRight, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck, Ticket, X } from "lucide-react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { api } from "@/src/lib/api"
import { getApiErrorMessage } from "@/src/lib/api-error"
import { normalizeAuthPayload, storeAuth, type AuthApiResponse } from "@/src/lib/auth-storage"
import { getFirstValidationMessage, loginSchema } from "@/src/validators/auth"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [remember, setRemember] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")

    const parsed = loginSchema.safeParse({
      email,
      password,
    })

    if (!parsed.success) {
      setError(getFirstValidationMessage(parsed.error))
      return
    }

    setIsSubmitting(true)

    try {
      const response = await api.post<AuthApiResponse>("/auth/login", parsed.data)
      const payload = normalizeAuthPayload(response.data)

      storeAuth(payload, remember)
      router.push("/")
    } catch (submitError) {
      setError(getApiErrorMessage(submitError, "Invalid email or password. Please try again."))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8 text-slate-950">
      <div className="w-full max-w-md">
        <Card className="overflow-hidden border-slate-200 p-6 shadow-md sm:p-8">
          <CardHeader className="items-center text-center">
            <div className="mb-2 flex size-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 shadow-sm">
              <Ticket className="size-6" aria-hidden="true" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">EventBook Access</p>
            <h1 className="text-2xl font-semibold leading-8 text-slate-950">Welcome back</h1>
            <p className="max-w-xs text-sm leading-6 text-slate-600">
              Enter your credentials to manage bookings and event passes.
            </p>
          </CardHeader>

          <CardContent className="mt-6">
            {error ? (
              <Alert className="mb-5 flex items-start gap-3">
                <AlertCircle className="mt-0.5 size-5 shrink-0 text-red-600" aria-hidden="true" />
                <AlertDescription className="flex-1 font-medium">{error}</AlertDescription>
                <button
                  type="button"
                  aria-label="Dismiss message"
                  className="rounded-md p-1 text-red-900 transition-colors hover:bg-red-100"
                  onClick={() => setError("")}
                >
                  <X className="size-4" aria-hidden="true" />
                </button>
              </Alert>
            ) : null}

            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="you@domain.com"
                    className="pl-9"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <Label htmlFor="password">Password</Label>
                  <button type="button" className="text-xs font-semibold text-indigo-700 hover:underline">
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    placeholder="Enter password"
                    className="pl-9 pr-11"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-0 top-0 flex h-[42px] w-11 items-center justify-center rounded-r-lg text-slate-500 transition-colors hover:text-slate-950"
                    onClick={() => setShowPassword((current) => !current)}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              <label className="flex cursor-pointer select-none items-center gap-2 pt-1 text-sm leading-5 text-slate-600">
                <Checkbox checked={remember} onChange={(event) => setRemember(event.target.checked)} />
                Remember this device
              </label>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 h-12 w-full rounded-xl bg-indigo-600 text-sm font-semibold text-white shadow-md hover:bg-indigo-700"
              >
                <span>{isSubmitting ? "Logging in..." : "Log in"}</span>
                <ArrowRight className="size-4" aria-hidden="true" />
              </Button>
            </form>

            <div className="mt-8 text-center text-sm text-slate-600">
              New here?
              <Link className="ml-1 font-semibold text-indigo-700 hover:underline" href="/register">
                Create an account
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="mt-4 flex items-center justify-center gap-2 text-xs font-semibold text-slate-500">
          <ShieldCheck className="size-4 text-emerald-600" aria-hidden="true" />
          <span>Protected EventBook authentication</span>
        </div>
      </div>
    </main>
  )
}
