export type AuthUser = {
  id: string
  name: string
  email: string
  role: "USER" | "ADMIN"
}

export type AuthPayload = {
  user: AuthUser
  token: string
}

export type AuthApiResponse = {
  success?: boolean
  data?: AuthPayload
  user?: AuthUser
  token?: string
}

export function normalizeAuthPayload(response: AuthApiResponse): AuthPayload {
  if (response.data) {
    return response.data
  }

  if (response.user && response.token) {
    return {
      user: response.user,
      token: response.token,
    }
  }

  throw new Error("Authentication response was missing user or token")
}

export function storeAuth(payload: AuthPayload, remember: boolean) {
  const storage = remember ? window.localStorage : window.sessionStorage

  storage.setItem("eventbook_token", payload.token)
  storage.setItem("eventbook_user", JSON.stringify(payload.user))

  if (remember) {
    window.sessionStorage.removeItem("eventbook_token")
    window.sessionStorage.removeItem("eventbook_user")
  } else {
    window.localStorage.removeItem("eventbook_token")
    window.localStorage.removeItem("eventbook_user")
  }
}
