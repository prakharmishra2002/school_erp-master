'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    GraduationCap,
    LayoutDashboard,
    Users,
    CalendarCheck,
    BookOpen,
    FileText,
    Clock,
    Calendar,
    Bell,
    Megaphone,
    BarChart3,
    LogOut,
    ChevronDown,
    ChevronRight,
    ChevronLeft,
    Menu,
    X,
    Moon,
    Sun,
    Palmtree,
    Search,
    Settings,
    Wallet,
    UserCheck,
    AlertCircle,
    Check,
    Mail,
    MessageSquare,
    User,
    Shield,
    Globe,
    Palette,
    Volume2,
    Lock,
} from 'lucide-react'

interface SidebarItem {
    label: string
    href: string
    icon: React.ElementType
    badge?: string
    badgeColor?: 'default' | 'warning' | 'success'
}

interface SidebarSection {
    title: string
    items: SidebarItem[]
}

const sidebarSections: SidebarSection[] = [
    {
        title: 'Overview',
        items: [
            { label: 'Dashboard', href: '/teacher/dashboard', icon: LayoutDashboard },
        ],
    },
    {
        title: 'Teaching',
        items: [
            { label: 'My Classes', href: '/teacher/classes', icon: BookOpen },
            { label: 'Students', href: '/teacher/students', icon: Users },
            { label: 'Attendance', href: '/teacher/attendance', icon: CalendarCheck, badge: '4', badgeColor: 'warning' },
            { label: 'Marks Entry', href: '/teacher/marks', icon: FileText, badge: '2', badgeColor: 'warning' },
        ],
    },
    {
        title: 'Schedule',
        items: [
            { label: 'My Schedule', href: '/teacher/schedule', icon: Clock },
            { label: 'Timetable', href: '/teacher/timetable', icon: Calendar },
            { label: 'Examinations', href: '/teacher/exams', icon: GraduationCap },
        ],
    },
    {
        title: 'Personal',
        items: [
            { label: 'My Attendance', href: '/teacher/my-attendance', icon: UserCheck },
            { label: 'Salary', href: '/teacher/salary', icon: Wallet },
            { label: 'Leave Request', href: '/teacher/leave', icon: Palmtree },
        ],
    },
    {
        title: 'More',
        items: [
            { label: 'Reports', href: '/teacher/reports', icon: BarChart3 },
            { label: 'Announcements', href: '/teacher/announcements', icon: Megaphone },
        ],
    },
]

export default function TeacherLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [darkMode, setDarkMode] = useState(false)
    const [notificationsOpen, setNotificationsOpen] = useState(false)
    const [settingsOpen, setSettingsOpen] = useState(false)
    const [globalSearch, setGlobalSearch] = useState('')
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false)

    const searchResults = globalSearch.length > 1 ? [
        { type: 'student', title: 'Aarav Sharma', subtitle: 'Class 10-A • Roll #1', link: '/teacher/teacher/students?q=Aarav' },
        { type: 'student', title: 'Priya Patel', subtitle: 'Class 10-A • Roll #2', link: '/teacher/teacher/students?q=Priya' },
        { type: 'class', title: 'Class 10-A', subtitle: 'Mathematics • 45 Students', link: '/teacher/teacher/classes' },
        { type: 'class', title: 'Class 10-B', subtitle: 'Mathematics • 44 Students', link: '/teacher/teacher/classes' },
    ].filter(item =>
        item.title.toLowerCase().includes(globalSearch.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(globalSearch.toLowerCase())
    ) : []

    const notifications = [
        { id: '1', title: 'Attendance Reminder', message: 'Class 10-A attendance pending for today', time: '5 min ago', type: 'warning', unread: true },
        { id: '2', title: 'Leave Approved', message: 'Your leave request for Feb 15 has been approved', time: '1 hour ago', type: 'success', unread: true },
        { id: '3', title: 'New Announcement', message: 'Republic Day celebration schedule released', time: '2 hours ago', type: 'info', unread: false },
        { id: '4', title: 'Marks Entry Due', message: 'Unit Test 2 marks submission deadline tomorrow', time: '3 hours ago', type: 'warning', unread: false },
        { id: '5', title: 'Salary Credited', message: 'January 2026 salary has been credited', time: '1 day ago', type: 'success', unread: false },
    ]

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

            {/* Sidebar - Premium Research Institute Style */}
            <aside
                className={cn(
                    "fixed left-0 top-0 z-50 h-screen w-[270px] flex flex-col bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-r border-slate-800/50 transition-transform duration-300 lg:translate-x-0",
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                {/* Logo Section */}
                <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800/50">
                    <Link href="/teacher/dashboard" className="flex items-center gap-3 group">
                        <div className="relative">
                            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                <GraduationCap className="w-5 h-5 text-white" />
                            </div>
                            {/* Glow effect on hover */}
                            <div className="absolute inset-0 bg-emerald-400/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div>
                            <h1 className="font-display text-lg font-semibold text-white tracking-tight">Faculty</h1>
                            <p className="text-[10px] font-medium text-emerald-400/80 uppercase tracking-widest">Portal</p>
                        </div>
                    </Link>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-5 px-3 sidebar-scroll">
                    {sidebarSections.map((section, i) => (
                        <div key={i} className="mb-6">
                            <span className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">
                                {section.title}
                            </span>
                            <div className="space-y-1">
                                {section.items.map((item) => {
                                    const isActive = pathname === item.href
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={cn(
                                                "relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                                                isActive
                                                    ? "bg-gradient-to-r from-emerald-500/20 to-teal-500/10 text-white shadow-sm"
                                                    : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                                            )}
                                        >
                                            {isActive && (
                                                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-gradient-to-b from-emerald-400 to-teal-500 rounded-r-full" />
                                            )}
                                            <item.icon className={cn(
                                                "w-5 h-5 shrink-0 transition-colors",
                                                isActive ? "text-emerald-400" : ""
                                            )} />
                                            <span className="flex-1">{item.label}</span>
                                            {item.badge && (
                                                <span className={cn(
                                                    "px-2 py-0.5 text-xs font-semibold rounded-full",
                                                    item.badgeColor === 'warning'
                                                        ? "bg-amber-500/20 text-amber-400"
                                                        : item.badgeColor === 'success'
                                                            ? "bg-emerald-500/20 text-emerald-400"
                                                            : "bg-slate-700 text-slate-300"
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

                {/* User Profile Section */}
                <div className="p-3 border-t border-slate-800/50">
                    <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-gradient-to-r from-slate-800/50 to-slate-800/30 hover:from-slate-800 hover:to-slate-800/50 transition-colors cursor-pointer group">
                        <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-semibold text-sm shadow-lg">
                                RS
                            </div>
                            {/* Online indicator */}
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white truncate">Rajesh Sharma</p>
                            <p className="text-xs text-slate-500 truncate">Mathematics Faculty</p>
                        </div>
                        <ChevronDown className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <div className="lg:pl-[270px]">
                {/* Top header - Premium Style */}
                <header className="sticky top-0 z-30 h-16 bg-[var(--card-background)]/80 backdrop-blur-xl border-b border-[var(--border)]">
                    <div className="h-full flex items-center justify-between px-4 lg:px-6">
                        {/* Left */}
                        <div className="flex items-center gap-2 lg:gap-4">
                            {!mobileSearchOpen && (
                                <button
                                    onClick={() => setSidebarOpen(true)}
                                    className="lg:hidden p-2 rounded-xl text-[var(--foreground-secondary)] hover:text-[var(--foreground)] hover:bg-[var(--background-secondary)] transition-colors"
                                >
                                    <Menu className="w-5 h-5" />
                                </button>
                            )}

                            <div className={cn(
                                "flex flex-col relative transition-all duration-300",
                                mobileSearchOpen ? "fixed inset-x-0 top-0 h-16 px-4 bg-[var(--card-background)] z-50 flex-row items-center gap-3 lg:static lg:h-auto lg:px-0 lg:bg-transparent" : "hidden md:flex"
                            )}>
                                {mobileSearchOpen && (
                                    <button
                                        onClick={() => setMobileSearchOpen(false)}
                                        className="lg:hidden p-2 rounded-xl text-[var(--foreground-secondary)]"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                )}
                                <div className={cn(
                                    "flex items-center gap-2 px-4 py-2.5 bg-[var(--background-secondary)] rounded-xl border border-transparent hover:border-[var(--border)] focus-within:border-emerald-500 transition-colors",
                                    mobileSearchOpen ? "flex-1" : "w-72"
                                )}>
                                    <Search className="w-4 h-4 text-[var(--foreground-muted)]" />
                                    <input
                                        type="text"
                                        value={globalSearch}
                                        onChange={(e) => setGlobalSearch(e.target.value)}
                                        placeholder="Search students, classes..."
                                        className="flex-1 bg-transparent text-sm text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] outline-none"
                                        autoFocus={mobileSearchOpen}
                                    />
                                    {globalSearch ? (
                                        <button onClick={() => setGlobalSearch('')} className="p-1 hover:bg-[var(--background-tertiary)] rounded-md">
                                            <X className="w-3 h-3 text-[var(--foreground-muted)]" />
                                        </button>
                                    ) : (
                                        <kbd className="hidden lg:inline-flex items-center gap-1 text-[10px] text-[var(--foreground-muted)] bg-[var(--card-background)] px-1.5 py-0.5 rounded border border-[var(--border)]">
                                            ⌘K
                                        </kbd>
                                    )}
                                </div>

                                {/* Global Search Results Dropdown */}
                                {searchResults.length > 0 && (
                                    <div className={cn(
                                        "absolute top-full mt-2 w-full bg-[var(--card-background)] rounded-2xl shadow-2xl border border-[var(--border)] overflow-hidden z-50 animate-slide-up",
                                        mobileSearchOpen ? "left-0 right-0 mx-4 w-auto" : ""
                                    )}>
                                        <div className="p-2 border-b border-[var(--border)] bg-[var(--background-secondary)]/50">
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--foreground-muted)] px-2">
                                                Search Results ({searchResults.length})
                                            </span>
                                        </div>
                                        <div className="max-h-[60vh] lg:max-h-80 overflow-y-auto p-1">
                                            {searchResults.map((result, i) => (
                                                <a
                                                    key={i}
                                                    href={result.link}
                                                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--background-secondary)] transition-colors group"
                                                    onClick={() => {
                                                        setGlobalSearch('')
                                                        setMobileSearchOpen(false)
                                                    }}
                                                >
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${result.type === 'student'
                                                        ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                                                        : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                                                        }`}>
                                                        {result.type === 'student' ? <Users className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-[var(--foreground)] group-hover:text-emerald-500 transition-colors">
                                                            {result.title}
                                                        </p>
                                                        <p className="text-[10px] text-[var(--foreground-muted)] font-medium">
                                                            {result.subtitle}
                                                        </p>
                                                    </div>
                                                    <ChevronRight className="w-4 h-4 ml-auto text-[var(--foreground-muted)] group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                                                </a>
                                            ))}
                                        </div>
                                        <div className="p-3 border-t border-[var(--border)] bg-[var(--background-secondary)]/30 text-center">
                                            <button className="text-xs font-semibold text-emerald-500 hover:text-emerald-600 transition-colors">
                                                View all results
                                            </button>
                                        </div>
                                    </div>
                                )}
                                {globalSearch.length > 1 && searchResults.length === 0 && (
                                    <div className={cn(
                                        "absolute top-full mt-2 w-full bg-[var(--card-background)] rounded-2xl shadow-2xl border border-[var(--border)] p-8 text-center animate-slide-up",
                                        mobileSearchOpen ? "left-0 right-0 mx-4 w-auto" : ""
                                    )}>
                                        <div className="w-12 h-12 bg-[var(--background-secondary)] rounded-2xl flex items-center justify-center mx-auto mb-3">
                                            <Search className="w-6 h-6 text-[var(--foreground-muted)]" />
                                        </div>
                                        <p className="text-sm font-semibold text-[var(--foreground)]">No results found</p>
                                        <p className="text-xs text-[var(--foreground-muted)] mt-1">
                                            Try searching with a different term
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right */}
                        <div className="flex items-center gap-1 sm:gap-2">
                            <button
                                onClick={() => setMobileSearchOpen(true)}
                                className="md:hidden p-2.5 rounded-xl text-[var(--foreground-secondary)] hover:text-[var(--foreground)] hover:bg-[var(--background-secondary)] transition-colors"
                            >
                                <Search className="w-5 h-5" />
                            </button>
                            <button
                                onClick={toggleDarkMode}
                                className="p-2.5 rounded-xl text-[var(--foreground-secondary)] hover:text-[var(--foreground)] hover:bg-[var(--background-secondary)] transition-colors"
                            >
                                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                            </button>

                            {/* Notification Button with Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                                    className="relative p-2.5 rounded-xl text-[var(--foreground-secondary)] hover:text-[var(--foreground)] hover:bg-[var(--background-secondary)] transition-colors"
                                >
                                    <Bell className="w-5 h-5" />
                                    {notifications.filter(n => n.unread).length > 0 && (
                                        <span className="absolute top-2 right-2 flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                        </span>
                                    )}
                                </button>

                                {/* Notifications Dropdown */}
                                {notificationsOpen && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setNotificationsOpen(false)} />
                                        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-[var(--card-background)] rounded-2xl shadow-2xl border border-[var(--border)] z-50 overflow-hidden animate-slide-up">
                                            <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
                                                <div>
                                                    <h3 className="font-semibold text-[var(--foreground)]">Notifications</h3>
                                                    <p className="text-xs text-[var(--foreground-muted)]">{notifications.filter(n => n.unread).length} unread</p>
                                                </div>
                                                <button className="text-xs text-emerald-600 hover:text-emerald-700 font-medium">Mark all read</button>
                                            </div>
                                            <div className="max-h-80 overflow-y-auto">
                                                {notifications.map(notification => (
                                                    <div
                                                        key={notification.id}
                                                        className={cn(
                                                            "p-4 border-b border-[var(--border)] hover:bg-[var(--background-secondary)] transition-colors cursor-pointer",
                                                            notification.unread && "bg-emerald-50/50 dark:bg-emerald-900/10"
                                                        )}
                                                    >
                                                        <div className="flex items-start gap-3">
                                                            <div className={cn(
                                                                "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                                                                notification.type === 'warning' && "bg-amber-100 dark:bg-amber-900/30",
                                                                notification.type === 'success' && "bg-emerald-100 dark:bg-emerald-900/30",
                                                                notification.type === 'info' && "bg-blue-100 dark:bg-blue-900/30"
                                                            )}>
                                                                {notification.type === 'warning' && <AlertCircle className="w-4 h-4 text-amber-600" />}
                                                                {notification.type === 'success' && <Check className="w-4 h-4 text-emerald-600" />}
                                                                {notification.type === 'info' && <Megaphone className="w-4 h-4 text-blue-600" />}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className={cn(
                                                                    "text-sm",
                                                                    notification.unread ? "font-semibold text-[var(--foreground)]" : "text-[var(--foreground-secondary)]"
                                                                )}>{notification.title}</p>
                                                                <p className="text-xs text-[var(--foreground-muted)] line-clamp-1">{notification.message}</p>
                                                                <p className="text-[10px] text-[var(--foreground-muted)] mt-1">{notification.time}</p>
                                                            </div>
                                                            {notification.unread && (
                                                                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="p-3 border-t border-[var(--border)] text-center">
                                                <Link
                                                    href="/teacher/notifications"
                                                    className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                                                    onClick={() => setNotificationsOpen(false)}
                                                >
                                                    View all notifications
                                                </Link>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Settings Button */}
                            <button
                                onClick={() => setSettingsOpen(true)}
                                className="p-2.5 rounded-xl text-[var(--foreground-secondary)] hover:text-[var(--foreground)] hover:bg-[var(--background-secondary)] transition-colors"
                            >
                                <Settings className="w-5 h-5" />
                            </button>

                            <div className="w-px h-6 bg-[var(--border)] mx-1 sm:mx-2" />

                            <Button variant="ghost" size="sm" className="gap-2 text-[var(--foreground-secondary)] hover:text-red-500 px-2 sm:px-3">
                                <LogOut className="w-4 h-4" />
                                <span className="hidden lg:inline">Logout</span>
                            </Button>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="p-4 lg:p-8">
                    {children}
                </main>
            </div>

            {/* Settings Drawer */}
            {settingsOpen && (
                <>
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={() => setSettingsOpen(false)} />
                    <div className="fixed right-0 top-0 h-screen w-full max-w-md bg-[var(--card-background)] shadow-2xl z-50 animate-slide-left overflow-y-auto">
                        <div className="sticky top-0 p-5 border-b border-[var(--border)] bg-[var(--card-background)] flex items-center justify-between">
                            <div>
                                <div className="flex items-center gap-2">
                                    <h2 className="font-display text-xl font-semibold text-[var(--foreground)]">Settings</h2>
                                    <Badge variant="outline" className="text-[10px] uppercase tracking-wider bg-amber-50 text-amber-600 border-amber-200">Pending Connection</Badge>
                                </div>
                                <p className="text-sm text-[var(--foreground-muted)]">Customize your experience</p>
                            </div>
                            <button
                                onClick={() => setSettingsOpen(false)}
                                className="p-2 rounded-xl hover:bg-[var(--background-secondary)] transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-5 space-y-6">
                            {/* Profile Section */}
                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200 dark:border-emerald-800">
                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-lg">
                                    RS
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-[var(--foreground)]">Rajesh Sharma</p>
                                    <p className="text-sm text-[var(--foreground-muted)]">Mathematics Faculty</p>
                                </div>
                                <ChevronRight className="w-5 h-5 text-[var(--foreground-muted)]" />
                            </div>

                            {/* Settings Sections */}
                            <div className="space-y-2">
                                <h3 className="text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider px-1">Account</h3>
                                <button className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-[var(--background-secondary)] transition-colors">
                                    <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                        <User className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div className="flex-1 text-left">
                                        <p className="font-medium text-[var(--foreground)]">Profile Settings</p>
                                        <p className="text-xs text-[var(--foreground-muted)]">Update your personal information</p>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-[var(--foreground-muted)]" />
                                </button>
                                <button className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-[var(--background-secondary)] transition-colors">
                                    <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                                        <Shield className="w-5 h-5 text-violet-600" />
                                    </div>
                                    <div className="flex-1 text-left">
                                        <p className="font-medium text-[var(--foreground)]">Security</p>
                                        <p className="text-xs text-[var(--foreground-muted)]">Password, 2FA, login history</p>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-[var(--foreground-muted)]" />
                                </button>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider px-1">Preferences</h3>
                                <button className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-[var(--background-secondary)] transition-colors">
                                    <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                                        <Bell className="w-5 h-5 text-amber-600" />
                                    </div>
                                    <div className="flex-1 text-left">
                                        <p className="font-medium text-[var(--foreground)]">Notifications</p>
                                        <p className="text-xs text-[var(--foreground-muted)]">Email, push, in-app alerts</p>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-[var(--foreground-muted)]" />
                                </button>
                                <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-[var(--background-secondary)] transition-colors">
                                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                        <Palette className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                                    </div>
                                    <div className="flex-1 text-left">
                                        <p className="font-medium text-[var(--foreground)]">Appearance</p>
                                        <p className="text-xs text-[var(--foreground-muted)]">Theme, colors, display</p>
                                    </div>
                                    <button
                                        onClick={toggleDarkMode}
                                        className={cn(
                                            "relative w-12 h-7 rounded-full transition-colors",
                                            darkMode ? "bg-emerald-500" : "bg-slate-300"
                                        )}
                                    >
                                        <span className={cn(
                                            "absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-sm transition-transform flex items-center justify-center",
                                            darkMode && "translate-x-5"
                                        )}>
                                            {darkMode ? <Moon className="w-3 h-3 text-slate-600" /> : <Sun className="w-3 h-3 text-amber-500" />}
                                        </span>
                                    </button>
                                </div>
                                <button className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-[var(--background-secondary)] transition-colors">
                                    <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                        <Globe className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div className="flex-1 text-left">
                                        <p className="font-medium text-[var(--foreground)]">Language</p>
                                        <p className="text-xs text-[var(--foreground-muted)]">English (India)</p>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-[var(--foreground-muted)]" />
                                </button>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider px-1">Support</h3>
                                <button className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-[var(--background-secondary)] transition-colors">
                                    <div className="w-10 h-10 rounded-xl bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center">
                                        <MessageSquare className="w-5 h-5 text-cyan-600" />
                                    </div>
                                    <div className="flex-1 text-left">
                                        <p className="font-medium text-[var(--foreground)]">Help & Support</p>
                                        <p className="text-xs text-[var(--foreground-muted)]">FAQs, contact support</p>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-[var(--foreground-muted)]" />
                                </button>
                            </div>

                            {/* Version */}
                            <div className="pt-4 text-center">
                                <p className="text-xs text-[var(--foreground-muted)]">EduVerse Faculty Portal v2.1.0</p>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
