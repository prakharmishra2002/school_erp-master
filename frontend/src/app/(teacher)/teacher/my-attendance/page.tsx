'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Calendar,
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle,
    ChevronLeft,
    ChevronRight,
    TrendingUp,
    Download,
} from 'lucide-react'

interface AttendanceRecord {
    date: string
    day: string
    checkIn: string | null
    checkOut: string | null
    status: 'present' | 'absent' | 'half-day' | 'holiday' | 'leave'
    hoursWorked: string | null
}

export default function MyAttendancePage() {
    const [currentMonth, setCurrentMonth] = useState(new Date())

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

    const attendanceData: AttendanceRecord[] = [
        { date: '2026-01-01', day: 'Wed', checkIn: null, checkOut: null, status: 'holiday', hoursWorked: null },
        { date: '2026-01-02', day: 'Thu', checkIn: '08:45', checkOut: '16:30', status: 'present', hoursWorked: '7h 45m' },
        { date: '2026-01-03', day: 'Fri', checkIn: '08:50', checkOut: '16:25', status: 'present', hoursWorked: '7h 35m' },
        { date: '2026-01-04', day: 'Sat', checkIn: '08:55', checkOut: '13:00', status: 'half-day', hoursWorked: '4h 5m' },
        { date: '2026-01-05', day: 'Sun', checkIn: null, checkOut: null, status: 'holiday', hoursWorked: null },
        { date: '2026-01-06', day: 'Mon', checkIn: '08:40', checkOut: '16:35', status: 'present', hoursWorked: '7h 55m' },
        { date: '2026-01-07', day: 'Tue', checkIn: '08:48', checkOut: '16:28', status: 'present', hoursWorked: '7h 40m' },
        { date: '2026-01-08', day: 'Wed', checkIn: '08:42', checkOut: '16:32', status: 'present', hoursWorked: '7h 50m' },
        { date: '2026-01-09', day: 'Thu', checkIn: '08:50', checkOut: '16:25', status: 'present', hoursWorked: '7h 35m' },
        { date: '2026-01-10', day: 'Fri', checkIn: null, checkOut: null, status: 'leave', hoursWorked: null },
        { date: '2026-01-11', day: 'Sat', checkIn: '08:55', checkOut: '13:05', status: 'half-day', hoursWorked: '4h 10m' },
        { date: '2026-01-12', day: 'Sun', checkIn: null, checkOut: null, status: 'holiday', hoursWorked: null },
        { date: '2026-01-13', day: 'Mon', checkIn: '08:38', checkOut: '16:40', status: 'present', hoursWorked: '8h 2m' },
        { date: '2026-01-14', day: 'Tue', checkIn: '08:45', checkOut: '16:30', status: 'present', hoursWorked: '7h 45m' },
        { date: '2026-01-15', day: 'Wed', checkIn: '08:52', checkOut: '16:28', status: 'present', hoursWorked: '7h 36m' },
        { date: '2026-01-16', day: 'Thu', checkIn: '08:40', checkOut: '16:35', status: 'present', hoursWorked: '7h 55m' },
        { date: '2026-01-17', day: 'Fri', checkIn: '08:48', checkOut: '16:25', status: 'present', hoursWorked: '7h 37m' },
        { date: '2026-01-18', day: 'Sat', checkIn: '09:00', checkOut: '13:00', status: 'half-day', hoursWorked: '4h 0m' },
        { date: '2026-01-19', day: 'Sun', checkIn: null, checkOut: null, status: 'holiday', hoursWorked: null },
        { date: '2026-01-20', day: 'Mon', checkIn: null, checkOut: null, status: 'leave', hoursWorked: null },
        { date: '2026-01-21', day: 'Tue', checkIn: null, checkOut: null, status: 'leave', hoursWorked: null },
        { date: '2026-01-22', day: 'Wed', checkIn: '08:42', checkOut: '16:30', status: 'present', hoursWorked: '7h 48m' },
        { date: '2026-01-23', day: 'Thu', checkIn: '08:45', checkOut: '16:32', status: 'present', hoursWorked: '7h 47m' },
        { date: '2026-01-24', day: 'Fri', checkIn: '08:50', checkOut: '16:28', status: 'present', hoursWorked: '7h 38m' },
        { date: '2026-01-25', day: 'Sat', checkIn: '08:55', checkOut: '13:10', status: 'half-day', hoursWorked: '4h 15m' },
        { date: '2026-01-26', day: 'Sun', checkIn: null, checkOut: null, status: 'holiday', hoursWorked: null },
        { date: '2026-01-27', day: 'Mon', checkIn: '08:40', checkOut: '16:35', status: 'present', hoursWorked: '7h 55m' },
        { date: '2026-01-28', day: 'Tue', checkIn: '08:48', checkOut: '16:30', status: 'present', hoursWorked: '7h 42m' },
        { date: '2026-01-29', day: 'Wed', checkIn: '08:45', checkOut: '16:28', status: 'present', hoursWorked: '7h 43m' },
        { date: '2026-01-30', day: 'Thu', checkIn: '08:42', checkOut: null, status: 'present', hoursWorked: 'Ongoing' },
    ]

    const stats = {
        present: attendanceData.filter(d => d.status === 'present').length,
        halfDay: attendanceData.filter(d => d.status === 'half-day').length,
        absent: attendanceData.filter(d => d.status === 'absent').length,
        leave: attendanceData.filter(d => d.status === 'leave').length,
        holidays: attendanceData.filter(d => d.status === 'holiday').length,
    }

    const workingDays = stats.present + stats.halfDay + stats.absent + stats.leave
    const attendanceRate = workingDays > 0 ? ((stats.present + (stats.halfDay * 0.5)) / workingDays) * 100 : 0

    const statusStyles = {
        present: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-400', icon: CheckCircle2 },
        'half-day': { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-400', icon: Clock },
        absent: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400', icon: XCircle },
        leave: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400', icon: Calendar },
        holiday: { bg: 'bg-violet-100 dark:bg-violet-900/30', text: 'text-violet-700 dark:text-violet-400', icon: Calendar },
    }

    return (
        <div className="space-y-6 animate-slide-up">
            {/* Header */}
            <header>
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-xs font-medium tracking-widest uppercase text-[var(--foreground-muted)]">
                        Personal
                    </span>
                </div>
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                    <div>
                        <h1 className="font-display text-3xl font-semibold tracking-tight text-[var(--foreground)]">
                            My Attendance
                        </h1>
                        <p className="mt-1 text-[var(--foreground-secondary)]">
                            View your attendance records and check-in/out times
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="secondary" size="sm" onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1))}>
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <span className="font-semibold text-[var(--foreground)] min-w-[140px] text-center">
                            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                        </span>
                        <Button variant="secondary" size="sm" onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1))}>
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                        <Button variant="secondary" size="sm" className="gap-2 ml-2">
                            <Download className="w-4 h-4" />
                            Export
                        </Button>
                    </div>
                </div>
            </header>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                <Card className="border-emerald-200/50 dark:border-emerald-800/50 bg-gradient-to-br from-emerald-500/5 to-teal-500/5">
                    <CardContent className="p-4 text-center">
                        <p className="font-display text-3xl font-semibold text-emerald-600">{stats.present}</p>
                        <p className="text-sm text-[var(--foreground-muted)]">Present</p>
                    </CardContent>
                </Card>
                <Card className="border-amber-200/50 dark:border-amber-800/50 bg-gradient-to-br from-amber-500/5 to-orange-500/5">
                    <CardContent className="p-4 text-center">
                        <p className="font-display text-3xl font-semibold text-amber-600">{stats.halfDay}</p>
                        <p className="text-sm text-[var(--foreground-muted)]">Half Days</p>
                    </CardContent>
                </Card>
                <Card className="border-blue-200/50 dark:border-blue-800/50 bg-gradient-to-br from-blue-500/5 to-indigo-500/5">
                    <CardContent className="p-4 text-center">
                        <p className="font-display text-3xl font-semibold text-blue-600">{stats.leave}</p>
                        <p className="text-sm text-[var(--foreground-muted)]">Leaves</p>
                    </CardContent>
                </Card>
                <Card className="border-violet-200/50 dark:border-violet-800/50 bg-gradient-to-br from-violet-500/5 to-purple-500/5">
                    <CardContent className="p-4 text-center">
                        <p className="font-display text-3xl font-semibold text-violet-600">{stats.holidays}</p>
                        <p className="text-sm text-[var(--foreground-muted)]">Holidays</p>
                    </CardContent>
                </Card>
                <Card className="border-cyan-200/50 dark:border-cyan-800/50 bg-gradient-to-br from-cyan-500/5 to-teal-500/5">
                    <CardContent className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                            <TrendingUp className="w-5 h-5 text-cyan-600" />
                            <p className="font-display text-3xl font-semibold text-cyan-600">{attendanceRate.toFixed(0)}%</p>
                        </div>
                        <p className="text-sm text-[var(--foreground-muted)]">Rate</p>
                    </CardContent>
                </Card>
            </div>

            {/* Today's Status */}
            <Card className="border-emerald-300 dark:border-emerald-700 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20">
                <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-display text-lg font-semibold text-emerald-700 dark:text-emerald-400 mb-1">
                                Today's Status
                            </h3>
                            <p className="text-sm text-emerald-600/70 dark:text-emerald-400/70">
                                Thursday, January 30, 2026
                            </p>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="text-center">
                                <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70 mb-1">Check In</p>
                                <p className="font-display text-2xl font-semibold text-emerald-700 dark:text-emerald-400">08:42</p>
                            </div>
                            <div className="w-px h-12 bg-emerald-300 dark:bg-emerald-700" />
                            <div className="text-center">
                                <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70 mb-1">Check Out</p>
                                <p className="font-display text-2xl font-semibold text-[var(--foreground-muted)]">--:--</p>
                            </div>
                            <Badge className="bg-emerald-500 text-white ml-4">Present</Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Attendance Records Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="font-display text-lg">Monthly Records</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-[var(--border)]">
                                    <th className="text-left p-3 text-sm font-medium text-[var(--foreground-muted)]">Date</th>
                                    <th className="text-left p-3 text-sm font-medium text-[var(--foreground-muted)]">Day</th>
                                    <th className="text-center p-3 text-sm font-medium text-[var(--foreground-muted)]">Check In</th>
                                    <th className="text-center p-3 text-sm font-medium text-[var(--foreground-muted)]">Check Out</th>
                                    <th className="text-center p-3 text-sm font-medium text-[var(--foreground-muted)]">Hours</th>
                                    <th className="text-center p-3 text-sm font-medium text-[var(--foreground-muted)]">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attendanceData.slice().reverse().map((record, i) => {
                                    const style = statusStyles[record.status]
                                    const StatusIcon = style.icon
                                    return (
                                        <tr key={i} className="border-b border-[var(--border)] hover:bg-[var(--background-secondary)] transition-colors">
                                            <td className="p-3 font-medium text-[var(--foreground)]">
                                                {new Date(record.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                                            </td>
                                            <td className="p-3 text-[var(--foreground-muted)]">{record.day}</td>
                                            <td className="p-3 text-center font-mono text-[var(--foreground)]">
                                                {record.checkIn || '--:--'}
                                            </td>
                                            <td className="p-3 text-center font-mono text-[var(--foreground)]">
                                                {record.checkOut || '--:--'}
                                            </td>
                                            <td className="p-3 text-center text-[var(--foreground-muted)]">
                                                {record.hoursWorked || '-'}
                                            </td>
                                            <td className="p-3">
                                                <div className="flex justify-center">
                                                    <Badge className={`${style.bg} ${style.text} gap-1`}>
                                                        <StatusIcon className="w-3 h-3" />
                                                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                                                    </Badge>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
