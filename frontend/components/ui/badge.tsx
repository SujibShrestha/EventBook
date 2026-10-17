import type { ComponentProps } from "react"

import { cn } from "@/lib/utils"

function Badge({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      data-slot="badge"
      className={cn(
        "inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-semibold leading-none text-slate-700",
        className,
      )}
      {...props}
    />
  )
}

export { Badge }
