'use client'

import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BreadcrumbItem {
    label: string
    href?: string
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[]
    className?: string
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
    return (
        <nav className={cn("flex items-center gap-2 mb-1", className)}>
            <Link
                href="/admin/dashboard"
                className="text-slate-400 hover:text-indigo-600 transition-colors"
            >
                <Home className="w-4 h-4" />
            </Link>

            {items.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
                    {item.href ? (
                        <Link
                            href={item.href}
                            className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors whitespace-nowrap"
                        >
                            {item.label}
                        </Link>
                    ) : (
                        <span className="text-sm font-bold text-indigo-600 whitespace-nowrap">
                            {item.label}
                        </span>
                    )}
                </div>
            ))}
        </nav>
    )
}
