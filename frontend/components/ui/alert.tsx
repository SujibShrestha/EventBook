import type { ComponentProps } from "react"

import { cn } from "@/lib/utils"

function Alert({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      role="alert"
      data-slot="alert"
      className={cn("rounded-lg border border-red-200 bg-red-50 p-4 text-red-900", className)}
      {...props}
    />
  )
}

function AlertDescription({ className, ...props }: ComponentProps<"p">) {
  return <p data-slot="alert-description" className={cn("text-sm leading-5", className)} {...props} />
}

export { Alert, AlertDescription }
