"use client"

import { Toaster as Sonner, type ToasterProps } from "sonner"

function Toaster({ position = "bottom-right", ...props }: ToasterProps) {
  return (
    <Sonner
      position={position}
      closeButton
      richColors
      toastOptions={{
        classNames: {
          toast: "rounded-xl border border-slate-200 bg-white text-slate-950 shadow-lg",
          description: "text-slate-600",
          actionButton: "bg-indigo-600 text-white",
          cancelButton: "bg-slate-100 text-slate-950",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
