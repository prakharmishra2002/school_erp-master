import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-500)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
    {
        variants: {
            variant: {
                default:
                    "bg-gradient-to-b from-[var(--primary-600)] to-[var(--primary-700)] text-white shadow-md hover:from-[var(--primary-500)] hover:to-[var(--primary-600)] hover:-translate-y-0.5 active:translate-y-0",
                secondary:
                    "bg-[var(--card-background)] border border-[var(--border)] text-[var(--foreground)] shadow-sm hover:bg-[var(--background-secondary)] hover:border-[var(--slate-300)]",
                outline:
                    "border border-[var(--border)] bg-transparent text-[var(--foreground)] hover:bg-[var(--background-secondary)]",
                ghost:
                    "text-[var(--foreground-secondary)] hover:bg-[var(--background-tertiary)] hover:text-[var(--foreground)]",
                link:
                    "text-[var(--primary-600)] underline-offset-4 hover:underline",
                success:
                    "bg-gradient-to-b from-[var(--success)] to-[#047857] text-white shadow-md hover:shadow-lg",
                destructive:
                    "bg-gradient-to-b from-[var(--error)] to-[#b91c1c] text-white shadow-md hover:shadow-lg",
                accent:
                    "bg-gradient-to-b from-[var(--accent-500)] to-[var(--accent-600)] text-white shadow-md hover:shadow-lg",
            },
            size: {
                default: "h-10 px-5",
                sm: "h-8 px-3 text-xs",
                lg: "h-12 px-8 text-base",
                xl: "h-14 px-10 text-lg",
                icon: "h-10 w-10 p-0",
                "icon-sm": "h-8 w-8 p-0",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
    loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, loading, children, disabled, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                disabled={disabled || loading}
                {...props}
            >
                {loading ? (
                    <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Loading...</span>
                    </>
                ) : children}
            </Comp>
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
