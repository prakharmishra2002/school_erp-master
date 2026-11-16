'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
    GraduationCap,
    LayoutDashboard,
    Users,
    UserCircle,
    CalendarCheck,
    BookOpen,
    CreditCard,
    FileText,
    MessageSquare,
    BarChart3,
    Settings,
    LogOut,
    ChevronDown,
    Menu,
    X,
    Upload,
    Bell,
    Search,
    Moon,
    Sun,
} from 'lucide-react'

interface SidebarItem {
    label: string
    href: string
    icon: React.ElementType
    badge?: string
}

interface SidebarSection {
    title: string
    items: SidebarItem[]
}

const sidebarSections: SidebarSection[] = [
    {
        title: 'Overview',
        items: [
            { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        ],
    },
    {
        title: 'Academic',
        items: [
            { label: 'Students', href: '/students', icon: Users, badge: '1,247' },
            { label: 'Teachers', href: '/teachers', icon: UserCircle },
            { label: 'Classes', href: '/classes', icon: BookOpen },
            { label: 'Attendance', href: '/attendance', icon: CalendarCheck },
            { label: 'Examinations', href: '/examinations', icon: FileText },
        ],
    },
    {
        title: 'Finance',
        items: [
            { label: 'Fee Collection', href: '/fees', icon: CreditCard },
            { label: 'Reports', href: '/reports', icon: BarChart3 },
        ],
    },
    {
        title: 'Communication',
        items: [
            { label: 'Messages', href: '/messages', icon: MessageSquare, badge: '3' },
        ],
    },
    {
        title: 'System',
        items: [
            { label: 'Data Import', href: '/import', icon: Upload },
            { label: 'Settings', href: '/settings', icon: Settings },
        ],
    },
]

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [darkMode, setDarkMode] = useState(false)

    const toggleDarkMode = () => {
        setDarkMode(!darkMode)
        document.documentElement.classList.toggle('dark')
    }

    return (
        <div className={cn("min-h-screen bg-[var(--background)]", darkMode && "dark")}>
            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed left-0 top-0 z-50 h-screen w-[260px] bg-[var(--sidebar-background)] border-r border-[var(--sidebar-border)] transition-transform duration-300 lg:translate-x-0",
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                {/* Logo */}
                <div className="h-16 flex items-center justify-between px-5 border-b border-[var(--sidebar-border)]">
                    <Link href="/dashboard" className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-[var(--primary-500)] to-[var(--accent-500)] rounded-lg flex items-center justify-center">
                            <GraduationCap className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="font-display text-lg font-semibold text-white">EduVerse</h1>
                        </div>
                    </Link>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden p-1 text-[var(--slate-400)] hover:text-white"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-4 px-3">
                    {sidebarSections.map((section, i) => (
                        <div key={i} className="mb-6">
                            <h2 className="px-3 mb-2 text-[0.6875rem] font-semibold uppercase tracking-wider text-[var(--slate-500)]">
                                {section.title}
                            </h2>
                            <div className="space-y-0.5">
                                {section.items.map((item) => {
                                    const isActive = pathname === item.href
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={cn(
                                                "relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                                                isActive
                                                    ? "bg-white/10 text-white"
                                                    : "text-[var(--slate-400)] hover:bg-white/5 hover:text-[var(--slate-200)]"
                                            )}
                                        >
                                            {isActive && (
                                                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-[var(--primary-500)] rounded-r-full" />
                                            )}
                                            <item.icon className="w-5 h-5 shrink-0" />
                                            <span className="flex-1">{item.label}</span>
                                            {item.badge && (
                                                <span className={cn(
                                                    "px-2 py-0.5 text-xs font-medium rounded-full",
                                                    isActive
                                                        ? "bg-white/20 text-white"
                                                        : "bg-[var(--slate-700)] text-[var(--slate-400)]"
                                                )}>
                                                    {item.badge}
                                                </span>
                                            )}
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* User section */}
                <div className="p-3 border-t border-[var(--sidebar-border)]">
                    <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--primary-500)] to-[var(--secondary-500)] flex items-center justify-center text-white font-medium text-sm">
                            AS
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">Admin User</p>
                            <p className="text-xs text-[var(--slate-500)] truncate">Super Admin</p>
                        </div>
                        <ChevronDown className="w-4 h-4 text-[var(--slate-500)]" />
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <div className="lg:pl-[260px]">
                {/* Top header */}
                <header className="sticky top-0 z-30 h-16 bg-[var(--card-background)] border-b border-[var(--border)] backdrop-blur-sm">
                    <div className="h-full flex items-center justify-between px-4 lg:px-6">
                        {/* Left */}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden p-2 text-[var(--foreground-secondary)] hover:text-[var(--foreground)] hover:bg-[var(--background-secondary)] rounded-lg"
                            >
                                <Menu className="w-5 h-5" />
                            </button>

                            {/* Search */}
                            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-[var(--background-secondary)] rounded-lg w-72">
                                <Search className="w-4 h-4 text-[var(--foreground-muted)]" />
                                <input
                                    type="text"
                                    placeholder="Search students, teachers..."
                                    className="flex-1 bg-transparent text-sm text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] outline-none"
                                />
                                <kbd className="hidden lg:inline-flex items-center gap-1 text-xs text-[var(--foreground-muted)] bg-[var(--card-background)] px-1.5 py-0.5 rounded border border-[var(--border)]">
                                    ⌘K
                                </kbd>
                            </div>
                        </div>

                        {/* Right */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={toggleDarkMode}
                                className="p-2 text-[var(--foreground-secondary)] hover:text-[var(--foreground)] hover:bg-[var(--background-secondary)] rounded-lg"
                            >
                                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                            </button>

                            <button className="relative p-2 text-[var(--foreground-secondary)] hover:text-[var(--foreground)] hover:bg-[var(--background-secondary)] rounded-lg">
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--error)] rounded-full" />
                            </button>

                            <div className="w-px h-6 bg-[var(--border)] mx-2" />

                            <Button variant="ghost" size="sm" className="gap-2">
                                <LogOut className="w-4 h-4" />
                                <span className="hidden sm:inline">Logout</span>
                            </Button>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="p-4 lg:p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}
