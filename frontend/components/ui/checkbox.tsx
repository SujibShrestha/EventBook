import type { ComponentProps } from "react"

import { cn } from "@/lib/utils"

function Checkbox({ className, type = "checkbox", ...props }: ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="checkbox"
      className={cn("size-4 cursor-pointer rounded border-slate-300 accent-indigo-600", className)}
      {...props}
    />
  )
}

export { Checkbox }
