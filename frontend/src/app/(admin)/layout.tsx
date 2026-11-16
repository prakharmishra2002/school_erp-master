'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    LayoutDashboard,
    Users,
    GraduationCap,
    BookOpen,
    Calendar,
    IndianRupee,
    BarChart3,
    Settings,
    Shield,
    Bell,
    LogOut,
    Search,
    Clock,
    ChevronDown,
    ChevronRight,
    ChevronLeft,
    Menu,
    X,
    Moon,
    Sun,
    Briefcase,
    Building2,
    FileText,
    History as HistoryIcon,
    Key,
    CreditCard,
    Wallet,
    Sparkles,
    Cpu
} from 'lucide-react'

interface SidebarItem {
    label: string
    href: string
    icon: React.ElementType
    badge?: string
    badgeColor?: 'default' | 'warning' | 'success' | 'indigo'
}

interface SidebarSection {
    title: string
    items: SidebarItem[]
}

const adminSidebarSections: SidebarSection[] = [
    {
        title: 'Overview',
        items: [
            { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
            { label: 'Executive Reports', href: '/admin/reports', icon: BarChart3 },
        ],
    },
    {
        title: 'Academic Architect',
        items: [
            { label: 'Academic Years', href: '/admin/academic/years', icon: Calendar },
            { label: 'Classes & Sections', href: '/admin/academic/classes', icon: Building2 },
            { label: 'Subject Mapping', href: '/admin/academic/subjects', icon: BookOpen },
            { label: 'Curriculum & Tests', href: '/admin/academic/curriculum', icon: Sparkles, badge: 'New', badgeColor: 'indigo' },
        ],
    },
    {
        title: 'User Management',
        items: [
            { label: 'Staff Directory', href: '/admin/teachers', icon: Users },
            { label: 'Student Hub', href: '/admin/students', icon: GraduationCap },
            { label: 'Guardians', href: '/admin/guardians', icon: Shield },
            { label: 'Payroll & Salary', href: '/admin/hr/payroll', icon: IndianRupee },
        ],
    },
    {
        title: 'Operations',
        items: [
            { label: 'Departments', href: '/admin/departments', icon: Briefcase, badge: 'New', badgeColor: 'indigo' },
            { label: 'Timetable Builder', href: '/admin/timetable', icon: Clock },
        ],
    },
    {
        title: 'Financials',
        items: [
            { label: 'Collection Entry', href: '/admin/fees/collect', icon: Wallet, badge: 'New', badgeColor: 'success' },
            { label: 'Fee Deposit', href: '/admin/fees/deposit', icon: CreditCard, badge: 'Pro', badgeColor: 'indigo' },
            { label: 'Fee Structure', href: '/admin/fees/structure', icon: IndianRupee },
            { label: 'Collection Logs', href: '/admin/fees/logs', icon: FileText },
            { label: 'Defaulters', href: '/admin/fees/defaulters', icon: HistoryIcon, badge: '12', badgeColor: 'warning' },
        ],
    },
    {
        title: 'System Control',
        items: [
            { label: 'Global Settings', href: '/admin/settings', icon: Settings },
            { label: 'Device Integrations', href: '/admin/devices', icon: Cpu },
            { label: 'Access Control', href: '/admin/access', icon: Key },
            { label: 'Developer Tools', href: '/admin/developer', icon: Sparkles, badge: 'Dev', badgeColor: 'warning' },
        ],
    },
]

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [darkMode, setDarkMode] = useState(false)
    const [globalSearch, setGlobalSearch] = useState('')
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false)

    const toggleDarkMode = () => {
        setDarkMode(!darkMode)
        document.documentElement.classList.toggle('dark')
    }

    return (
        <div className={cn("min-h-screen bg-[var(--background)]", darkMode && "dark")}>
            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar - Command Center Style */}
            <aside
                className={cn(
                    "fixed left-0 top-0 z-50 h-screen w-[280px] flex flex-col bg-gradient-to-b from-indigo-950 via-slate-900 to-black border-r border-indigo-500/10 transition-transform duration-300 lg:translate-x-0 font-sans",
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                {/* Logo Section */}
                <div className="h-20 flex items-center justify-between px-6 border-b border-white/5">
                    <Link href="/admin/dashboard" className="flex items-center gap-3 group">
                        <div className="relative">
                            <div className="w-11 h-11 bg-gradient-to-br from-indigo-500 via-purple-600 to-violet-700 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 transform group-hover:rotate-6 transition-transform">
                                <Shield className="w-6 h-6 text-white" />
                            </div>
                            <div className="absolute inset-0 bg-indigo-400/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div>
                            <h1 className="font-display text-xl font-bold text-white tracking-tight leading-none">Admin</h1>
                            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mt-1">Control Center</p>
                        </div>
                    </Link>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Primary Navigation */}
                <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-8 sidebar-scroll">
                    {adminSidebarSections.map((section, i) => (
                        <div key={i}>
                            <h5 className="px-4 mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500/80">
                                {section.title}
                            </h5>
                            <div className="space-y-1.5">
                                {section.items.map((item) => {
                                    const isActive = pathname.startsWith(item.href)
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={cn(
                                                "group relative flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300",
                                                isActive
                                                    ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.1)]"
                                                    : "text-slate-400 hover:bg-white/5 hover:text-slate-200 "
                                            )}
                                        >
                                            <item.icon className={cn(
                                                "w-5 h-5 shrink-0 transition-transform group-hover:scale-110 duration-300",
                                                isActive ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300"
                                            )} />
                                            <span className="flex-1">{item.label}</span>
                                            {item.badge && (
                                                <span className={cn(
                                                    "px-2.5 py-0.5 text-[10px] font-bold rounded-lg uppercase tracking-wider",
                                                    item.badgeColor === 'warning'
                                                        ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                                                        : item.badgeColor === 'indigo'
                                                            ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                                                            : "bg-slate-800 text-slate-400"
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

                {/* System Stats Footer */}
                <div className="p-4 bg-black/20 m-4 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                            <HistoryIcon className="w-4 h-4 text-indigo-400" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">System Status</p>
                            <p className="text-[10px] text-emerald-400 font-medium whitespace-nowrap">Cloud Sync Active</p>
                        </div>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1">
                        <div className="bg-indigo-500 h-1 rounded-full w-4/5 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                    </div>
                </div>
            </aside>

            {/* Content Wrapper */}
            <div className="lg:pl-[280px]">
                {/* Modern Header */}
                <header className="sticky top-0 z-40 h-20 bg-[var(--background)]/80 backdrop-blur-2xl border-b border-[var(--border)]">
                    <div className="h-full flex items-center justify-between px-6 lg:px-10">
                        {/* Search & Breadcrumbs */}
                        <div className="flex items-center gap-4 flex-1 max-w-xl">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden p-2.5 rounded-2xl bg-[var(--background-secondary)] text-[var(--foreground-secondary)] hover:bg-indigo-500/10 hover:text-indigo-500 transition-all border border-transparent hover:border-indigo-500/20"
                            >
                                <Menu className="w-5 h-5" />
                            </button>

                            <div className="hidden md:flex items-center gap-3 px-5 py-3 bg-[var(--background-secondary)] rounded-2xl w-full border border-transparent focus-within:border-indigo-500/50 transition-all group">
                                <Search className="w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                <input
                                    type="text"
                                    value={globalSearch}
                                    onChange={(e) => setGlobalSearch(e.target.value)}
                                    placeholder="Search modules, students, or staff..."
                                    className="flex-1 bg-transparent text-sm text-[var(--foreground)] placeholder:text-slate-500 outline-none font-medium"
                                />
                                <div className="flex items-center gap-1">
                                    <kbd className="hidden sm:inline-flex px-1.5 py-0.5 rounded border border-[var(--border)] bg-[var(--background)] text-[10px] font-bold text-slate-500">⌘</kbd>
                                    <kbd className="hidden sm:inline-flex px-1.5 py-0.5 rounded border border-[var(--border)] bg-[var(--background)] text-[10px] font-bold text-slate-500">K</kbd>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 sm:gap-4 ml-4">
                            <button
                                onClick={toggleDarkMode}
                                className="p-3 rounded-2xl bg-[var(--background-secondary)] text-[var(--foreground-secondary)] hover:bg-indigo-500/10 hover:text-indigo-500 transition-all border border-transparent hover:border-indigo-500/20"
                            >
                                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                            </button>

                            <button className="relative p-3 rounded-2xl bg-[var(--background-secondary)] text-[var(--foreground-secondary)] hover:bg-indigo-500/10 hover:text-indigo-500 transition-all border border-transparent hover:border-indigo-500/20">
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-[3px] border-[var(--background-secondary)]" />
                            </button>

                            <div className="w-px h-8 bg-[var(--border)] mx-1" />

                            <div className="flex items-center gap-4 pl-2">
                                <div className="hidden sm:block text-right">
                                    <p className="text-sm font-bold text-[var(--foreground)]">Super Admin</p>
                                    <p className="text-[10px] font-black uppercase tracking-tighter text-indigo-500">Managerial Access</p>
                                </div>
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white ring-4 ring-indigo-500/10 shadow-lg shadow-indigo-500/20 font-bold group hover:scale-105 transition-transform cursor-pointer">
                                    SA
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <main className="p-6 lg:p-10 animate-in fade-in duration-700">
                    <div className="max-w-[1600px] mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
