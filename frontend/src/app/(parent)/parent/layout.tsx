'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
    LayoutDashboard,
    Users,
    CalendarCheck,
    BookOpen,
    IndianRupee,
    Bell,
    LogOut,
    Menu,
    X,
    Star,
    Calendar,
    Settings,
    ChevronRight,
    Sun,
    Moon,
} from 'lucide-react'
import { logout } from './actions/authActions'
import SettingsDrawer from './SettingsDrawer'

interface NavItem {
    label: string
    href: string
    icon: React.ElementType
}

const navItems: NavItem[] = [
    { label: 'Dashboard', href: '/parent/dashboard', icon: LayoutDashboard },
    { label: 'Attendance', href: '/parent/attendance', icon: CalendarCheck },
    { label: 'Results', href: '/parent/results', icon: BookOpen },
    { label: 'Fees', href: '/parent/fees', icon: IndianRupee },
    { label: 'Teachers', href: '/parent/teachers', icon: Star },
    { label: 'Schedule', href: '/parent/schedule', icon: Calendar },
]

export default function ParentLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [settingsOpen, setSettingsOpen] = useState(false)
    const [darkMode, setDarkMode] = useState(false)

    const toggleDarkMode = () => {
        setDarkMode(!darkMode)
        document.documentElement.classList.toggle('dark')
    }

    // Hide sidebar on login page
    if (pathname === '/parent/login') {
        return <>{children}</>
    }

    return (
        <div className={cn("min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors", darkMode && "dark")}>
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed left-0 top-0 z-50 h-screen w-72 flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-transform duration-300 lg:translate-x-0",
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                {/* Brand */}
                <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100 dark:border-slate-800">
                    <Link href="/parent/dashboard" className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                            <Users className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <span className="font-display text-xl font-bold text-slate-900 dark:text-white">EduVerse</span>
                            <p className="text-[10px] uppercase tracking-widest text-blue-600 font-bold">Parent Portal</p>
                        </div>
                    </Link>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group",
                                    isActive
                                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600"
                                )}
                            >
                                <item.icon className={cn(
                                    "w-5 h-5",
                                    isActive ? "text-white" : "text-slate-400 group-hover:text-blue-600"
                                )} />
                                {item.label}
                                {isActive && <ChevronRight className="ml-auto w-4 h-4 opacity-50" />}
                            </Link>
                        )
                    })}
                </nav>

                {/* Bottom Profile */}
                <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700">
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 font-bold">
                            MK
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate dark:text-white">Mohit Kumar</p>
                            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tight">Guardian</p>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-500" onClick={() => logout()}>
                            <LogOut className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="lg:pl-72 flex flex-col min-h-screen">
                {/* Header */}
                <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 lg:px-8">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    <div className="flex items-center gap-3 ml-auto">
                        <Link href="/parent/notifications">
                            <Button variant="ghost" size="icon" className="relative text-slate-600 dark:text-slate-400">
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900" />
                            </Button>
                        </Link>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-slate-600 dark:text-slate-400"
                            onClick={toggleDarkMode}
                        >
                            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-slate-600 dark:text-slate-400"
                            onClick={() => setSettingsOpen(true)}
                        >
                            <Settings className="w-5 h-5" />
                        </Button>
                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold ring-4 ring-blue-50 dark:ring-blue-900/20">
                            MK
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 lg:p-8">
                    <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {children}
                    </div>
                </main>
            </div>

            <SettingsDrawer
                isOpen={settingsOpen}
                onClose={() => setSettingsOpen(false)}
                darkMode={darkMode}
                onToggleDarkMode={toggleDarkMode}
            />
        </div>
    )
}
