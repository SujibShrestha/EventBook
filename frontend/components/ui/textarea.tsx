import type { ComponentProps } from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "min-h-28 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 shadow-sm outline-none transition-colors placeholder:text-slate-400 focus:border-indigo-600 focus:ring-3 focus:ring-indigo-600/15 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-red-600 aria-invalid:ring-red-600/15",
        className,
      )}
      {...props}
    />
  )
}

export { Textarea }
