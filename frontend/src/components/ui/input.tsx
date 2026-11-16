import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
    icon?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, label, error, icon, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-[var(--foreground-secondary)] mb-1.5">
                        {label}
                    </label>
                )}
                <div className="relative">
                    {icon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]">
                            {icon}
                        </div>
                    )}
                    <input
                        type={type}
                        className={cn(
                            "flex h-11 w-full rounded-lg border border-[var(--input-border)] bg-[var(--input-background)] px-4 py-2 text-[0.9375rem] text-[var(--foreground)] transition-all duration-150",
                            "placeholder:text-[var(--foreground-muted)]",
                            "focus:outline-none focus:border-[var(--primary-500)] focus:ring-3 focus:ring-[var(--primary-500)]/15",
                            "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[var(--background-secondary)]",
                            icon && "pl-10",
                            error && "border-[var(--error)] focus:border-[var(--error)] focus:ring-[var(--error)]/15",
                            className
                        )}
                        ref={ref}
                        {...props}
                    />
                </div>
                {error && (
                    <p className="mt-1.5 text-sm text-[var(--error)]">{error}</p>
                )}
            </div>
        )
    }
)
Input.displayName = "Input"

export { Input }
