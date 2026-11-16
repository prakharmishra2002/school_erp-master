'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Users,
    CalendarCheck,
    FileText,
    Clock,
    BookOpen,
    ArrowRight,
    CheckCircle2,
    AlertCircle,
    Star,
    ChevronRight,
    TrendingUp,
    Bell,
    Zap,
    GraduationCap,
} from 'lucide-react'
import { DashboardStats, ScheduleItem, ClassInfo, PendingTask } from '../actions/types'

// Premium Stat Card for Teacher Dashboard
function TeacherStatCard({
    icon: Icon,
    label,
    value,
    subtitle,
    accentColor,
    trend,
}: {
    icon: React.ElementType
    label: string
    value: string | number
    subtitle?: string
    accentColor: 'emerald' | 'blue' | 'amber' | 'violet'
    trend?: { value: string; direction: 'up' | 'down' }
}) {
    const styles = {
        emerald: {
            bg: 'from-emerald-500/10 to-teal-500/10',
            iconBg: 'bg-emerald-500',
            border: 'border-emerald-200/50 dark:border-emerald-800/50',
        },
        blue: {
            bg: 'from-blue-500/10 to-indigo-500/10',
            iconBg: 'bg-blue-500',
            border: 'border-blue-200/50 dark:border-blue-800/50',
        },
        amber: {
            bg: 'from-amber-500/10 to-orange-500/10',
            iconBg: 'bg-amber-500',
            border: 'border-amber-200/50 dark:border-amber-800/50',
        },
        violet: {
            bg: 'from-violet-500/10 to-purple-500/10',
            iconBg: 'bg-violet-500',
            border: 'border-violet-200/50 dark:border-violet-800/50',
        },
    }

    const accent = styles[accentColor]

    return (
        <Card className={`relative overflow-hidden ${accent.border} hover:shadow-lg transition-all duration-300 group`}>
            <div className={`absolute inset-0 bg-gradient-to-br ${accent.bg} opacity-40`} />
            <CardContent className="relative p-5">
                <div className="flex items-start justify-between mb-4">
                    <div className={`w-11 h-11 ${accent.iconBg} rounded-xl flex items-center justify-center shadow-lg`}>
                        <Icon className="w-5 h-5 text-white" />
                    </div>
                    {trend && (
                        <div className={`flex items-center gap-1 text-sm font-medium ${trend.direction === 'up' ? 'text-emerald-600' : 'text-red-500'
                            }`}>
                            <TrendingUp className={`w-4 h-4 ${trend.direction === 'down' ? 'rotate-180' : ''}`} />
                            {trend.value}
                        </div>
                    )}
                </div>
                <h3 className="font-display text-3xl font-semibold tracking-tight text-[var(--foreground)]">
                    {value}
                </h3>
                <p className="text-sm text-[var(--foreground-secondary)] mt-1">{label}</p>
                {subtitle && (
                    <p className="text-xs text-[var(--foreground-muted)] mt-2">{subtitle}</p>
                )}
            </CardContent>
        </Card>
    )
}

// Today's Schedule - Timeline Style
function ScheduleTimeline({ schedule }: { schedule: ScheduleItem[] }) {
    return (
        <div className="space-y-1">
            {schedule.map((item, i) => (
                <div
                    key={i}
                    className={`group relative flex items-center gap-4 p-4 rounded-xl transition-all duration-200 ${item.status === 'current'
                        ? 'bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200 dark:border-emerald-800'
                        : item.status === 'completed'
                            ? 'bg-[var(--background-secondary)] opacity-60'
                            : 'hover:bg-[var(--background-secondary)]'
                        }`}
                >
                    {/* Timeline connector */}
                    {i < schedule.length - 1 && (
                        <div className="absolute left-[2.25rem] top-[3.5rem] w-0.5 h-[calc(100%-2.5rem)] bg-gradient-to-b from-[var(--border)] to-transparent" />
                    )}

                    {/* Time indicator */}
                    <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center text-xs font-bold ${item.status === 'current'
                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                        : item.status === 'completed'
                            ? 'bg-[var(--background-tertiary)] text-[var(--foreground-muted)]'
                            : 'bg-[var(--card-background)] border-2 border-[var(--border)] text-[var(--foreground-secondary)]'
                        }`}>
                        {item.time.split(' ')[0]}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <h4 className={`font-semibold ${item.status === 'current' ? 'text-emerald-700 dark:text-emerald-300' : 'text-[var(--foreground)]'
                                }`}>
                                {item.subject}
                            </h4>
                            {item.status === 'current' && (
                                <Badge className="bg-emerald-500 text-white text-xs px-2 py-0">LIVE</Badge>
                            )}
                        </div>
                        <p className="text-sm text-[var(--foreground-muted)]">
                            {item.class} {item.room && `• ${item.room}`}
                        </p>
                    </div>

                    {/* Status indicator */}
                    {item.status === 'completed' && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    )}
                    {item.status === 'current' && (
                        <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                    )}
                </div>
            ))}
        </div>
    )
}

// Quick Action Button - Teacher Style
function TeacherQuickAction({
    icon: Icon,
    title,
    badge,
    badgeColor,
    href,
    gradient,
}: {
    icon: React.ElementType
    title: string
    badge?: string
    badgeColor?: 'red' | 'amber' | 'emerald'
    href: string
    gradient: string
}) {
    const badgeColors = {
        red: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400',
        amber: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400',
        emerald: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400',
    }

    return (
        <a href={href} className="group block">
            <div className="relative p-4 rounded-2xl border border-[var(--border)] bg-[var(--card-background)] hover:border-emerald-300 hover:shadow-lg transition-all duration-300 overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />
                <div className="relative flex items-center gap-4">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-sm`}>
                        <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-[var(--foreground)]">{title}</span>
                            {badge && (
                                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${badgeColors[badgeColor || 'amber']}`}>
                                    {badge}
                                </span>
                            )}
                        </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-[var(--foreground-muted)] group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                </div>
            </div>
        </a>
    )
}

// Class Progress Card
function ClassProgressCard({
    name,
    subject,
    students,
    attendanceRate,
    isClassTeacher,
}: ClassInfo) {
    return (
        <div className="group p-4 rounded-xl border border-[var(--border)] bg-[var(--card-background)] hover:border-emerald-300 hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-3">
                <div>
                    <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-[var(--foreground)]">{name}</h4>
                        {isClassTeacher && (
                            <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400 text-xs">
                                Class Teacher
                            </Badge>
                        )}
                    </div>
                    <p className="text-sm text-[var(--foreground-muted)]">{subject}</p>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-[var(--foreground-secondary)]">
                    <Users className="w-4 h-4" />
                    {students}
                </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                    <span className="text-[var(--foreground-muted)]">Attendance Rate</span>
                    <span className={`font-medium ${attendanceRate >= 90 ? 'text-emerald-600' : attendanceRate >= 75 ? 'text-amber-600' : 'text-red-600'
                        }`}>{attendanceRate}%</span>
                </div>
                <div className="h-2 rounded-full bg-[var(--background-tertiary)] overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-500 ${attendanceRate >= 90 ? 'bg-emerald-500' : attendanceRate >= 75 ? 'bg-amber-500' : 'bg-red-500'
                            }`}
                        style={{ width: `${attendanceRate}%` }}
                    />
                </div>
            </div>
        </div>
    )
}

const iconMap: Record<string, any> = {
    CalendarCheck,
    FileText,
    GraduationCap,
}

export default function DashboardContent({
    stats,
    schedule,
    classes,
    pendingTasks
}: {
    stats: DashboardStats,
    schedule: ScheduleItem[],
    classes: ClassInfo[],
    pendingTasks: PendingTask[]
}) {
    const currentHour = new Date().getHours()
    const greeting = currentHour < 12 ? 'Good Morning' : currentHour < 17 ? 'Good Afternoon' : 'Good Evening'

    return (
        <div className="space-y-8 animate-slide-up">
            {/* Header - Research Institute Style */}
            <header className="relative">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-xs font-medium tracking-widest uppercase text-[var(--foreground-muted)]">
                                Faculty Portal
                            </span>
                        </div>
                        <h1 className="font-display text-2xl md:text-4xl font-semibold tracking-tight text-[var(--foreground)]">
                            {greeting}, Rajesh 👋
                        </h1>
                        <p className="mt-1 md:mt-2 text-sm md:text-base text-[var(--foreground-secondary)]">
                            Monday, January 28 — Your teaching schedule and performance metrics
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="secondary" size="sm" className="gap-2">
                            <Star className="w-4 h-4 text-amber-500" />
                            <span className="font-semibold">{stats.rating}</span>
                            <span className="text-[var(--foreground-muted)]">Rating</span>
                        </Button>
                        <Button variant="secondary" size="sm" className="gap-2">
                            <Bell className="w-4 h-4" />
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                            </span>
                        </Button>
                    </div>
                </div>
            </header>

            {/* Stats Grid */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
                <TeacherStatCard
                    icon={Clock}
                    label="Classes Today"
                    value={stats.classesToday}
                    subtitle="2 completed • 4 remaining"
                    accentColor="emerald"
                />
                <TeacherStatCard
                    icon={Users}
                    label="Total Students"
                    value={stats.totalStudents}
                    subtitle={`Across ${classes.length} sections`}
                    accentColor="blue"
                />
                <TeacherStatCard
                    icon={FileText}
                    label="Pending Marks"
                    value={stats.pendingMarks}
                    subtitle="Unit Test 2"
                    accentColor="amber"
                />
                <TeacherStatCard
                    icon={CalendarCheck}
                    label="Attendance"
                    value={`0/${stats.attendancePending}`}
                    subtitle="Sections pending today"
                    accentColor="violet"
                />
            </section>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Today's Schedule */}
                <Card className="lg:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div>
                            <CardTitle className="font-display text-lg">Today&apos;s Schedule</CardTitle>
                            <p className="text-sm text-[var(--foreground-muted)] mt-0.5">Your teaching timeline for today</p>
                        </div>
                        <Button variant="ghost" size="sm" className="gap-1" asChild>
                            <a href="/teacher/schedule">
                                Full Week <ArrowRight className="w-4 h-4" />
                            </a>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <ScheduleTimeline schedule={schedule} />
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle className="font-display text-lg flex items-center gap-2">
                            <Zap className="w-5 h-5 text-amber-500" />
                            Quick Actions
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <TeacherQuickAction
                            icon={CalendarCheck}
                            title="Mark Attendance"
                            badge={`${stats.attendancePending} pending`}
                            badgeColor="red"
                            href="/teacher/attendance"
                            gradient="from-emerald-500 to-teal-600"
                        />
                        <TeacherQuickAction
                            icon={FileText}
                            title="Enter Marks"
                            badge={`${stats.pendingMarks} exams`}
                            badgeColor="amber"
                            href="/teacher/marks"
                            gradient="from-amber-500 to-orange-600"
                        />
                        <TeacherQuickAction
                            icon={Users}
                            title="View Students"
                            href="/teacher/students"
                            gradient="from-blue-500 to-indigo-600"
                        />
                        <TeacherQuickAction
                            icon={BookOpen}
                            title="My Classes"
                            href="/teacher/classes"
                            gradient="from-violet-500 to-purple-600"
                        />
                    </CardContent>
                </Card>
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* My Classes */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="font-display text-lg">My Classes</CardTitle>
                            <p className="text-sm text-[var(--foreground-muted)] mt-0.5">Sections you&apos;re teaching</p>
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                            <a href="/teacher/classes">View All</a>
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {classes.map((cls, i) => (
                            <ClassProgressCard key={i} {...cls} />
                        ))}
                    </CardContent>
                </Card>

                {/* Pending Tasks */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="font-display text-lg">Pending Tasks</CardTitle>
                            <p className="text-sm text-[var(--foreground-muted)] mt-0.5">Items requiring your attention</p>
                        </div>
                        <Badge variant="warning" className="gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {pendingTasks.length} pending
                        </Badge>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {pendingTasks.map((item, i) => {
                                const Icon = iconMap[item.icon] || Clock
                                return (
                                    <div
                                        key={i}
                                        className="group flex items-center gap-4 p-4 rounded-xl border border-[var(--border)] hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer"
                                    >
                                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${item.priority === 'high'
                                            ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                                            : item.priority === 'medium'
                                                ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
                                                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                                            }`}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-[var(--foreground)]">{item.task}</p>
                                            <p className="text-sm text-[var(--foreground-muted)] truncate">{item.detail}</p>
                                        </div>
                                        <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                            Start
                                        </Button>
                                    </div>
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
