import axios from "axios"

type ApiErrorBody = {
  message?: string
  error?: string
}

function isApiErrorBody(value: unknown): value is ApiErrorBody {
  return typeof value === "object" && value !== null
}

export function getApiErrorMessage(error: unknown, fallback: string) {
  if (!axios.isAxiosError(error)) {
    return fallback
  }

  const data = error.response?.data

  if (isApiErrorBody(data) && typeof data.message === "string") {
    return data.message
  }

  if (isApiErrorBody(data) && typeof data.error === "string") {
    return data.error
  }

  return fallback
}
