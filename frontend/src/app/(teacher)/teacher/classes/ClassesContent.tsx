'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Users,
    BookOpen,
    Clock,
    ChevronRight,
    Search,
    CalendarCheck,
    FileText,
    TrendingUp,
    Filter,
} from 'lucide-react'
import { ClassInfo } from '../actions/types'

// Class Card Component
function ClassCard({
    name,
    section,
    subject,
    students,
    attendanceRate,
    pendingTasks,
    isClassTeacher,
    schedule,
}: ClassInfo) {
    return (
        <Card className="group hover:shadow-xl hover:border-emerald-300 transition-all duration-300 overflow-hidden">
            {/* Header with gradient */}
            <div className="h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />

            <CardContent className="p-6">
                {/* Title Row */}
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-display text-xl font-semibold text-[var(--foreground)]">
                                {name} - {section}
                            </h3>
                            {isClassTeacher && (
                                <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400">
                                    Class Teacher
                                </Badge>
                            )}
                        </div>
                        <p className="text-sm text-[var(--foreground-muted)]">{subject}</p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
                    <div className="text-center p-3 rounded-xl bg-[var(--background-secondary)] flex flex-row sm:flex-col items-center justify-between sm:justify-center gap-2">
                        <div className="flex items-center justify-center gap-1 text-[var(--foreground-muted)] mb-1">
                            <Users className="w-4 h-4" />
                            <span className="text-xs sm:hidden">Students</span>
                        </div>
                        <div className="text-right sm:text-center">
                            <p className="font-display text-xl font-semibold text-[var(--foreground)] leading-tight">{students}</p>
                            <p className="hidden sm:block text-[10px] uppercase font-bold tracking-wider text-[var(--foreground-muted)]">Students</p>
                        </div>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-[var(--background-secondary)] flex flex-row sm:flex-col items-center justify-between sm:justify-center gap-2">
                        <div className="flex items-center justify-center gap-1 mb-1">
                            <TrendingUp className={`w-4 h-4 ${attendanceRate >= 90 ? 'text-emerald-500' : attendanceRate >= 75 ? 'text-amber-500' : 'text-red-500'}`} />
                            <span className="text-xs sm:hidden">Attendance</span>
                        </div>
                        <div className="text-right sm:text-center">
                            <p className={`font-display text-xl font-semibold leading-tight ${attendanceRate >= 90 ? 'text-emerald-600' : attendanceRate >= 75 ? 'text-amber-600' : 'text-red-600'}`}>
                                {attendanceRate}%
                            </p>
                            <p className="hidden sm:block text-[10px] uppercase font-bold tracking-wider text-[var(--foreground-muted)]">Attendance</p>
                        </div>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-[var(--background-secondary)] flex flex-row sm:flex-col items-center justify-between sm:justify-center gap-2">
                        <div className="flex items-center justify-center gap-1 text-[var(--foreground-muted)] mb-1">
                            <Clock className="w-4 h-4" />
                            <span className="text-xs sm:hidden">Schedule</span>
                        </div>
                        <div className="text-right sm:text-center">
                            <p className="font-display text-sm sm:text-lg font-semibold text-[var(--foreground)] leading-tight">{schedule}</p>
                            <p className="hidden sm:block text-[10px] uppercase font-bold tracking-wider text-[var(--foreground-muted)]">Schedule</p>
                        </div>
                    </div>
                </div>

                {/* Pending Tasks */}
                {(pendingTasks.attendance || pendingTasks.marks) && (
                    <div className="flex items-center gap-2 mb-5">
                        {pendingTasks.attendance && (
                            <Badge variant="warning" className="gap-1">
                                <CalendarCheck className="w-3 h-3" />
                                Attendance Pending
                            </Badge>
                        )}
                        {pendingTasks.marks && (
                            <Badge variant="warning" className="gap-1">
                                <FileText className="w-3 h-3" />
                                Marks Pending
                            </Badge>
                        )}
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                    <Button variant="secondary" size="sm" className="flex-1 gap-2" asChild>
                        <a href={`/teacher/teacher/students?class=${name}-${section}`}>
                            <Users className="w-4 h-4" />
                            View Students
                        </a>
                    </Button>
                    <Button size="sm" className="flex-1 gap-2 bg-emerald-500 hover:bg-emerald-600 text-white" asChild>
                        <a href={`/teacher/teacher/attendance?class=${name}-${section}`}>
                            <CalendarCheck className="w-4 h-4" />
                            Mark Attendance
                        </a>
                    </Button>
                    <Button variant="ghost" size="icon" className="shrink-0 group-hover:bg-[var(--background-secondary)]">
                        <ChevronRight className="w-5 h-5 text-[var(--foreground-muted)] group-hover:text-emerald-500 transition-colors" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

export default function ClassesContent({ initialClasses }: { initialClasses: ClassInfo[] }) {
    const [searchQuery, setSearchQuery] = useState('')

    const filteredClasses = initialClasses.filter(cls =>
        cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cls.section.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cls.subject.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const stats = {
        total: initialClasses.length,
        students: initialClasses.reduce((acc, cls) => acc + cls.students, 0),
        avgAttendance: Math.round(initialClasses.reduce((acc, cls) => acc + cls.attendanceRate, 0) / initialClasses.length * 10) / 10,
        classTeacherOf: initialClasses.filter(cls => cls.isClassTeacher).length
    }

    return (
        <div className="space-y-6 animate-slide-up">
            {/* Header */}
            <header>
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-xs font-medium tracking-widest uppercase text-[var(--foreground-muted)]">
                        Teaching
                    </span>
                </div>
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                    <div>
                        <h1 className="font-display text-3xl font-semibold tracking-tight text-[var(--foreground)]">
                            My Classes
                        </h1>
                        <p className="mt-1 text-[var(--foreground-secondary)]">
                            Manage your assigned classes and sections
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        {/* Search */}
                        <div className="flex items-center gap-2 px-4 py-2.5 bg-[var(--background-secondary)] rounded-xl border border-transparent hover:border-[var(--border)] transition-colors w-full sm:w-64">
                            <Search className="w-4 h-4 text-[var(--foreground-muted)]" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search classes..."
                                className="flex-1 bg-transparent text-sm text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] outline-none"
                            />
                        </div>
                        <Button variant="secondary" size="sm" className="gap-2 h-11 sm:h-9">
                            <Filter className="w-4 h-4" />
                            Filter
                        </Button>
                    </div>
                </div>
            </header>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-emerald-200/50 dark:border-emerald-800/50 bg-gradient-to-br from-emerald-500/5 to-teal-500/5">
                    <CardContent className="p-4 text-center">
                        <p className="font-display text-3xl font-semibold text-emerald-600 dark:text-emerald-400">{stats.total}</p>
                        <p className="text-sm text-[var(--foreground-muted)]">Total Classes</p>
                    </CardContent>
                </Card>
                <Card className="border-blue-200/50 dark:border-blue-800/50 bg-gradient-to-br from-blue-500/5 to-indigo-500/5">
                    <CardContent className="p-4 text-center">
                        <p className="font-display text-3xl font-semibold text-blue-600 dark:text-blue-400">{stats.students}</p>
                        <p className="text-sm text-[var(--foreground-muted)]">Total Students</p>
                    </CardContent>
                </Card>
                <Card className="border-amber-200/50 dark:border-amber-800/50 bg-gradient-to-br from-amber-500/5 to-orange-500/5">
                    <CardContent className="p-4 text-center">
                        <p className="font-display text-3xl font-semibold text-amber-600 dark:text-amber-400">{stats.avgAttendance}%</p>
                        <p className="text-sm text-[var(--foreground-muted)]">Avg Attendance</p>
                    </CardContent>
                </Card>
                <Card className="border-violet-200/50 dark:border-violet-800/50 bg-gradient-to-br from-violet-500/5 to-purple-500/5">
                    <CardContent className="p-4 text-center">
                        <p className="font-display text-3xl font-semibold text-violet-600 dark:text-violet-400">{stats.classTeacherOf}</p>
                        <p className="text-sm text-[var(--foreground-muted)]">Class Teacher Of</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredClasses.length > 0 ? (
                    filteredClasses.map((cls, i) => (
                        <ClassCard key={i} {...cls} />
                    ))
                ) : (
                    <div className="lg:col-span-2 py-12 text-center bg-[var(--background-secondary)] rounded-2xl border border-dashed border-[var(--border)]">
                        <p className="text-[var(--foreground-muted)]">No classes found matching your search.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
