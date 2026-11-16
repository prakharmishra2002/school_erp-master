import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
    "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
    {
        variants: {
            variant: {
                default:
                    "bg-[var(--primary-100)] text-[var(--primary-700)]",
                secondary:
                    "bg-[var(--slate-100)] text-[var(--slate-700)] dark:bg-[var(--slate-800)] dark:text-[var(--slate-300)]",
                success:
                    "bg-[var(--success-light)] text-[var(--success)]",
                error:
                    "bg-[var(--error-light)] text-[var(--error)]",
                warning:
                    "bg-[var(--warning-light)] text-[var(--warning)]",
                info:
                    "bg-[var(--info-light)] text-[var(--info)]",
                accent:
                    "bg-[var(--accent-100)] text-[var(--accent-700)]",
                outline:
                    "border border-[var(--border)] text-[var(--foreground-secondary)]",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
    dot?: boolean
}

function Badge({ className, variant, dot, children, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props}>
            {dot && (
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
            )}
            {children}
        </div>
    )
}

export { Badge, badgeVariants }
