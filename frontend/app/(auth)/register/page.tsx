"use client"

import type { FormEvent } from "react"
import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Ticket,
  User,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { api } from "@/src/lib/api"
import { getApiErrorMessage } from "@/src/lib/api-error"
import { getStoredUser, normalizeAuthPayload, storeAuth, type AuthApiResponse } from "@/src/lib/auth-storage"
import { getFirstValidationMessage, registerSchema } from "@/src/validators/auth"

function getPasswordStrength(password: string) {
  let score = 0

  if (password.length >= 8) score += 1
  if (/[A-Za-z]/.test(password)) score += 1
  if (/\d/.test(password)) score += 1
  if (/[^A-Za-z0-9]/.test(password)) score += 1

  return score
}

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [acceptedTerms, setAcceptedTerms] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const passwordStrength = useMemo(() => getPasswordStrength(password), [password])
  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword

  useEffect(() => {
    const user = getStoredUser()

    if (user) {
      router.replace(user.role === "ADMIN" ? "/admin/events" : "/")
    }
  }, [router])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const parsed = registerSchema.safeParse({
      name,
      email,
      password,
      confirmPassword,
      acceptedTerms,
    })

    if (!parsed.success) {
      toast.error(getFirstValidationMessage(parsed.error))
      return
    }

    setIsSubmitting(true)

    try {
      const response = await api.post<AuthApiResponse>("/auth/register", {
        name: parsed.data.name,
        email: parsed.data.email,
        password: parsed.data.password,
      })
      const payload = normalizeAuthPayload(response.data)

      storeAuth(payload, true)
      toast.success("Account created successfully.")
      router.push("/")
    } catch (submitError) {
      toast.error(getApiErrorMessage(submitError, "Unable to create your account. Please try again."))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8 text-slate-950">
      <div className="w-full max-w-md">
        <Card className="overflow-hidden border-slate-200 p-6 shadow-md sm:p-8">
          <CardHeader className="items-center text-center">
            <div className="mb-2 flex size-12 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
              <Ticket className="size-6" aria-hidden="true" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">EventBook Access</p>
            <h1 className="text-2xl font-semibold leading-8 text-slate-950">Create an account</h1>
            <p className="max-w-xs text-sm leading-6 text-slate-600">
              Join community and tech events with one secure account.
            </p>
          </CardHeader>

          <CardContent className="mt-6">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="name"
                    type="text"
                    autoComplete="name"
                    required
                    minLength={2}
                    placeholder="Sarah Jenkins"
                    className="pl-9 pr-10"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                  />
                  {name.length >= 2 ? (
                    <CheckCircle2 className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-emerald-600" />
                  ) : null}
                </div>
              </div>

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
                  <span className="text-xs font-semibold text-indigo-700">
                    Strength: {passwordStrength >= 3 ? "Strong" : "Building"}
                  </span>
                </div>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    minLength={8}
                    placeholder="At least 8 characters"
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
                <div className="grid grid-cols-4 gap-1.5 pt-1" aria-label={`Password strength ${passwordStrength} of 4`}>
                  {[0, 1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className={item < passwordStrength ? "h-1.5 rounded-full bg-indigo-600" : "h-1.5 rounded-full bg-slate-200"}
                    />
                  ))}
                </div>
                <p className="text-xs leading-5 text-slate-600">Use at least 8 characters with a letter and number.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm password</Label>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    placeholder="Repeat password"
                    className="pl-9 pr-10"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    aria-invalid={confirmPassword.length > 0 && !passwordsMatch}
                  />
                  {passwordsMatch ? (
                    <CheckCircle2 className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-emerald-600" />
                  ) : null}
                </div>
              </div>

              <label className="flex cursor-pointer select-none items-start gap-2 text-sm leading-5 text-slate-600">
                <Checkbox checked={acceptedTerms} onChange={(event) => setAcceptedTerms(event.target.checked)} />
                <span>
                  I agree to the{" "}
                  <button type="button" className="font-semibold text-indigo-700 hover:underline">
                    Terms
                  </button>{" "}
                  and{" "}
                  <button type="button" className="font-semibold text-indigo-700 hover:underline">
                    Privacy Policy
                  </button>
                  .
                </span>
              </label>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-12 w-full rounded-xl bg-indigo-600 text-sm font-semibold text-white shadow-md hover:bg-indigo-700"
              >
                <span>{isSubmitting ? "Creating account..." : "Create account"}</span>
                <ArrowRight className="size-4" aria-hidden="true" />
              </Button>
            </form>

            <div className="mt-7 text-center text-sm text-slate-600">
              Already have an account?
              <Link className="ml-1 font-semibold text-indigo-700 hover:underline" href="/login">
                Log in
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs font-semibold text-slate-500">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="size-4 text-emerald-600" aria-hidden="true" />
            Secure auth
          </span>
          <span className="flex items-center gap-1.5">
            <CalendarCheck className="size-4 text-indigo-700" aria-hidden="true" />
            Official booking access
          </span>
        </div>
      </div>
    </main>
  )
}
