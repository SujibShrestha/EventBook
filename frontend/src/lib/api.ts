import axios from "axios"

import { getStoredToken } from "@/src/lib/auth-storage"

const PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"
const SERVER_API_URL = process.env.INTERNAL_API_URL || PUBLIC_API_URL
const API_URL = typeof window === "undefined" ? SERVER_API_URL : PUBLIC_API_URL

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

api.interceptors.request.use((config) => {
  if (typeof window === "undefined") {
    return config
  }

  const token = getStoredToken()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})
