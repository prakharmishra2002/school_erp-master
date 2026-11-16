'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Users,
    UserCircle,
    GraduationCap,
    CreditCard,
    TrendingUp,
    TrendingDown,
    CalendarCheck,
    Clock,
    ArrowRight,
    BookOpen,
    AlertCircle,
    Activity,
    ChevronRight,
    BarChart3,
    Zap,
} from 'lucide-react'

// Premium Metric Card - Research Institute Style
function MetricCard({
    icon: Icon,
    label,
    value,
    change,
    changeLabel,
    trend,
    accent,
}: {
    icon: React.ElementType
    label: string
    value: string | number
    change?: string
    changeLabel?: string
    trend?: 'up' | 'down' | 'neutral'
    accent: 'blue' | 'emerald' | 'amber' | 'violet'
}) {
    const accentStyles = {
        blue: {
            bg: 'bg-gradient-to-br from-blue-500/10 to-indigo-500/10',
            icon: 'text-blue-600 dark:text-blue-400',
            border: 'border-blue-200/50 dark:border-blue-800/50',
            glow: 'shadow-blue-500/5',
        },
        emerald: {
            bg: 'bg-gradient-to-br from-emerald-500/10 to-teal-500/10',
            icon: 'text-emerald-600 dark:text-emerald-400',
            border: 'border-emerald-200/50 dark:border-emerald-800/50',
            glow: 'shadow-emerald-500/5',
        },
        amber: {
            bg: 'bg-gradient-to-br from-amber-500/10 to-orange-500/10',
            icon: 'text-amber-600 dark:text-amber-400',
            border: 'border-amber-200/50 dark:border-amber-800/50',
            glow: 'shadow-amber-500/5',
        },
        violet: {
            bg: 'bg-gradient-to-br from-violet-500/10 to-purple-500/10',
            icon: 'text-violet-600 dark:text-violet-400',
            border: 'border-violet-200/50 dark:border-violet-800/50',
            glow: 'shadow-violet-500/5',
        },
    }

    const styles = accentStyles[accent]

    return (
        <Card className={`relative overflow-hidden border ${styles.border} hover:shadow-xl ${styles.glow} transition-all duration-300 group`}>
            {/* Subtle gradient overlay */}
            <div className={`absolute inset-0 ${styles.bg} opacity-50`} />

            <CardContent className="relative p-6">
                {/* Header row */}
                <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-2xl ${styles.bg} flex items-center justify-center`}>
                        <Icon className={`w-6 h-6 ${styles.icon}`} />
                    </div>
                    {trend && change && (
                        <div className={`flex items-center gap-1 text-sm font-medium ${trend === 'up' ? 'text-emerald-600 dark:text-emerald-400' :
                                trend === 'down' ? 'text-red-600 dark:text-red-400' :
                                    'text-slate-500'
                            }`}>
                            {trend === 'up' && <TrendingUp className="w-4 h-4" />}
                            {trend === 'down' && <TrendingDown className="w-4 h-4" />}
                            <span>{change}</span>
                        </div>
                    )}
                </div>

                {/* Value */}
                <div className="space-y-1">
                    <h3 className="font-display text-3xl font-semibold tracking-tight text-[var(--foreground)]">
                        {value}
                    </h3>
                    <p className="text-sm font-medium text-[var(--foreground-secondary)]">
                        {label}
                    </p>
                </div>

                {/* Footer */}
                {changeLabel && (
                    <p className="mt-3 text-xs text-[var(--foreground-muted)]">
                        {changeLabel}
                    </p>
                )}

                {/* Hover indicator */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-20 transition-opacity" />
            </CardContent>
        </Card>
    )
}

// Activity Timeline Item - Research Log Style
function ActivityLogItem({
    icon: Icon,
    title,
    description,
    timestamp,
    category,
    categoryColor,
}: {
    icon: React.ElementType
    title: string
    description: string
    timestamp: string
    category: string
    categoryColor: 'blue' | 'emerald' | 'amber' | 'violet' | 'rose'
}) {
    const colors = {
        blue: 'bg-blue-500',
        emerald: 'bg-emerald-500',
        amber: 'bg-amber-500',
        violet: 'bg-violet-500',
        rose: 'bg-rose-500',
    }

    return (
        <div className="group flex gap-4 p-4 rounded-xl hover:bg-[var(--background-secondary)] transition-all duration-200 cursor-pointer">
            <div className="relative">
                <div className={`w-10 h-10 ${colors[categoryColor]} rounded-xl flex items-center justify-center shadow-lg`}>
                    <Icon className="w-5 h-5 text-white" />
                </div>
                {/* Timeline connector */}
                <div className="absolute top-12 left-1/2 -translate-x-1/2 w-px h-[calc(100%-3rem)] bg-gradient-to-b from-[var(--border)] to-transparent" />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                    <div>
                        <p className="font-medium text-[var(--foreground)] group-hover:text-[var(--primary-600)] transition-colors">
                            {title}
                        </p>
                        <p className="text-sm text-[var(--foreground-secondary)] mt-0.5 line-clamp-1">
                            {description}
                        </p>
                    </div>
                    <span className="text-xs text-[var(--foreground-muted)] whitespace-nowrap font-mono">
                        {timestamp}
                    </span>
                </div>
                <Badge variant="outline" className="mt-2 text-xs font-medium">
                    {category}
                </Badge>
            </div>
        </div>
    )
}

// Quick Action Card - Interactive Research Panel
function QuickActionCard({
    icon: Icon,
    title,
    description,
    href,
    accentColor,
}: {
    icon: React.ElementType
    title: string
    description: string
    href: string
    accentColor: string
}) {
    return (
        <a href={href} className="group block">
            <div className="relative p-5 rounded-2xl border border-[var(--border)] bg-[var(--card-background)] hover:border-[var(--primary-300)] hover:shadow-lg transition-all duration-300 overflow-hidden">
                {/* Gradient accent on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${accentColor} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

                <div className="relative flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${accentColor} flex items-center justify-center shadow-sm`}>
                        <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-semibold text-[var(--foreground)] group-hover:text-[var(--primary-600)] transition-colors">
                            {title}
                        </h4>
                        <p className="text-sm text-[var(--foreground-muted)]">{description}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-[var(--foreground-muted)] group-hover:text-[var(--primary-500)] group-hover:translate-x-1 transition-all" />
                </div>
            </div>
        </a>
    )
}

// Attendance Ring Chart - Data Visualization
function AttendanceRing({
    className: cls,
    present,
    total
}: {
    className: string
    present: number
    total: number
}) {
    const percentage = Math.round((present / total) * 100)
    const circumference = 2 * Math.PI * 18
    const offset = circumference - (percentage / 100) * circumference

    return (
        <div className="flex items-center gap-4 p-4 rounded-xl border border-[var(--border)] bg-[var(--card-background)] hover:shadow-md transition-shadow">
            <div className="relative w-14 h-14">
                <svg className="w-14 h-14 -rotate-90" viewBox="0 0 44 44">
                    <circle
                        cx="22"
                        cy="22"
                        r="18"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        className="text-[var(--background-tertiary)]"
                    />
                    <circle
                        cx="22"
                        cy="22"
                        r="18"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        className={percentage >= 90 ? 'text-emerald-500' : percentage >= 75 ? 'text-amber-500' : 'text-red-500'}
                    />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-[var(--foreground)]">
                    {percentage}%
                </span>
            </div>
            <div className="flex-1">
                <p className="font-medium text-[var(--foreground)]">{cls}</p>
                <p className="text-sm text-[var(--foreground-muted)]">
                    <span className="font-semibold text-[var(--foreground)]">{present}</span> / {total} present
                </p>
            </div>
        </div>
    )
}

export default function DashboardPage() {
    return (
        <div className="space-y-8 animate-slide-up">
            {/* Page Header - Research Institute Style */}
            <header className="relative">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-xs font-medium tracking-widest uppercase text-[var(--foreground-muted)]">
                                Live Dashboard
                            </span>
                        </div>
                        <h1 className="font-display text-3xl md:text-4xl font-semibold tracking-tight text-[var(--foreground)]">
                            Academic Operations
                        </h1>
                        <p className="mt-2 text-[var(--foreground-secondary)] max-w-xl">
                            Real-time institutional metrics and performance analytics for informed decision-making.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="secondary" size="sm" className="gap-2">
                            <Activity className="w-4 h-4" />
                            <span className="hidden sm:inline">Export Report</span>
                        </Button>
                        <Button variant="secondary" size="sm" className="gap-2">
                            <CalendarCheck className="w-4 h-4" />
                            2025-26
                        </Button>
                    </div>
                </div>
            </header>

            {/* Primary Metrics - Research Data Grid */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <MetricCard
                    icon={Users}
                    label="Total Enrollment"
                    value="1,247"
                    change="+12.3%"
                    trend="up"
                    changeLabel="vs. previous term"
                    accent="blue"
                />
                <MetricCard
                    icon={UserCircle}
                    label="Faculty Members"
                    value="86"
                    change="+4.2%"
                    trend="up"
                    changeLabel="across departments"
                    accent="emerald"
                />
                <MetricCard
                    icon={GraduationCap}
                    label="Active Sections"
                    value="45"
                    changeLabel="K-12 distribution"
                    trend="neutral"
                    accent="amber"
                />
                <MetricCard
                    icon={CreditCard}
                    label="Revenue (YTD)"
                    value="₹24.5L"
                    change="+18.7%"
                    trend="up"
                    changeLabel="collection rate: 94%"
                    accent="violet"
                />
            </section>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Attendance Overview - Full Width on smaller screens */}
                <Card className="lg:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div>
                            <CardTitle className="font-display text-lg">Attendance Overview</CardTitle>
                            <p className="text-sm text-[var(--foreground-muted)] mt-0.5">Today&apos;s class-wise attendance metrics</p>
                        </div>
                        <Button variant="ghost" size="sm" className="gap-1">
                            View Details <ArrowRight className="w-4 h-4" />
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
                            <AttendanceRing className="Class 10-A" present={42} total={45} />
                            <AttendanceRing className="Class 10-B" present={40} total={44} />
                            <AttendanceRing className="Class 9-A" present={38} total={42} />
                            <AttendanceRing className="Class 9-B" present={44} total={46} />
                        </div>

                        {/* Summary Stats */}
                        <div className="mt-6 pt-4 border-t border-[var(--border)] grid grid-cols-3 gap-4">
                            <div className="text-center">
                                <p className="text-2xl font-display font-semibold text-emerald-600 dark:text-emerald-400">92.4%</p>
                                <p className="text-xs text-[var(--foreground-muted)]">Avg. Attendance</p>
                            </div>
                            <div className="text-center border-x border-[var(--border)]">
                                <p className="text-2xl font-display font-semibold text-[var(--foreground)]">1,189</p>
                                <p className="text-xs text-[var(--foreground-muted)]">Present Today</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-display font-semibold text-amber-600 dark:text-amber-400">58</p>
                                <p className="text-xs text-[var(--foreground-muted)]">On Leave</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions Panel */}
                <Card>
                    <CardHeader>
                        <CardTitle className="font-display text-lg flex items-center gap-2">
                            <Zap className="w-5 h-5 text-amber-500" />
                            Quick Actions
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <QuickActionCard
                            icon={Users}
                            title="Add Student"
                            description="New enrollment"
                            href="/students/new"
                            accentColor="from-blue-500 to-indigo-600"
                        />
                        <QuickActionCard
                            icon={CalendarCheck}
                            title="Mark Attendance"
                            description="Today's records"
                            href="/attendance"
                            accentColor="from-emerald-500 to-teal-600"
                        />
                        <QuickActionCard
                            icon={CreditCard}
                            title="Collect Fee"
                            description="Payment portal"
                            href="/fees"
                            accentColor="from-violet-500 to-purple-600"
                        />
                        <QuickActionCard
                            icon={BarChart3}
                            title="Generate Report"
                            description="Analytics export"
                            href="/reports"
                            accentColor="from-amber-500 to-orange-600"
                        />
                    </CardContent>
                </Card>
            </div>

            {/* Bottom Section - Activity Log & Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Activity Log */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="font-display text-lg">Activity Log</CardTitle>
                            <p className="text-sm text-[var(--foreground-muted)] mt-0.5">Recent institutional events</p>
                        </div>
                        <Button variant="ghost" size="sm">View All</Button>
                    </CardHeader>
                    <CardContent className="space-y-1">
                        <ActivityLogItem
                            icon={Users}
                            title="New Student Enrolled"
                            description="Rahul Sharma admitted to Class 5-A, Mathematics stream"
                            timestamp="2m ago"
                            category="Admissions"
                            categoryColor="blue"
                        />
                        <ActivityLogItem
                            icon={CreditCard}
                            title="Fee Payment Received"
                            description="₹15,000 collected from Priya Patel (Class 8-B)"
                            timestamp="15m ago"
                            category="Finance"
                            categoryColor="emerald"
                        />
                        <ActivityLogItem
                            icon={CalendarCheck}
                            title="Attendance Completed"
                            description="Class 10-A attendance marked by Prof. Sharma"
                            timestamp="1h ago"
                            category="Attendance"
                            categoryColor="violet"
                        />
                        <ActivityLogItem
                            icon={BookOpen}
                            title="Exam Schedule Published"
                            description="Unit Test 2 for Class 9 scheduled for next week"
                            timestamp="2h ago"
                            category="Examinations"
                            categoryColor="amber"
                        />
                    </CardContent>
                </Card>

                {/* Fee Alerts */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="font-display text-lg">Fee Alerts</CardTitle>
                            <p className="text-sm text-[var(--foreground-muted)] mt-0.5">Pending collections requiring attention</p>
                        </div>
                        <Badge variant="error" className="gap-1">
                            <AlertCircle className="w-3 h-3" />
                            12 Overdue
                        </Badge>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {[
                                { name: 'Amit Kumar', class: '8-A', amount: '₹8,500', days: 15, priority: 'high' },
                                { name: 'Sneha Reddy', class: '6-B', amount: '₹12,000', days: 10, priority: 'high' },
                                { name: 'Vikram Singh', class: '10-A', amount: '₹15,000', days: 7, priority: 'medium' },
                                { name: 'Pooja Sharma', class: '4-C', amount: '₹6,500', days: 5, priority: 'low' },
                            ].map((student, i) => (
                                <div
                                    key={i}
                                    className="group flex items-center justify-between p-4 rounded-xl border border-[var(--border)] hover:border-red-200 dark:hover:border-red-900/50 hover:shadow-md transition-all cursor-pointer"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center text-sm font-semibold text-[var(--foreground)]">
                                            {student.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <p className="font-medium text-[var(--foreground)] group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                                                {student.name}
                                            </p>
                                            <p className="text-sm text-[var(--foreground-muted)]">Class {student.class}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-[var(--foreground)]">{student.amount}</p>
                                        <p className={`text-xs font-medium flex items-center justify-end gap-1 ${student.priority === 'high' ? 'text-red-600 dark:text-red-400' :
                                                student.priority === 'medium' ? 'text-amber-600 dark:text-amber-400' :
                                                    'text-[var(--foreground-muted)]'
                                            }`}>
                                            <Clock className="w-3 h-3" />
                                            {student.days}d overdue
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Button variant="secondary" className="w-full mt-4 gap-2">
                            <BarChart3 className="w-4 h-4" />
                            View Full Report
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
