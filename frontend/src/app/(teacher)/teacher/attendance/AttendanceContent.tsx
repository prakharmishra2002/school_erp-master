'use client'

import { useState, useTransition } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Users,
    CalendarCheck,
    ChevronDown,
    Check,
    X,
    Clock,
    Save,
    AlertCircle,
    CheckCircle2,
    RotateCcw,
    Search,
    Loader2,
} from 'lucide-react'
import { AttendanceRecord } from '../actions/types'
import { saveAttendance, getAttendanceList } from '../actions/attendanceActions'

// Attendance Toggle Button
function AttendanceToggle({
    status,
    onChange
}: {
    status: 'present' | 'absent' | 'late' | 'leave' | null
    onChange: (status: 'present' | 'absent' | 'late' | 'leave') => void
}) {
    const options = [
        { value: 'present', label: 'P', color: 'bg-emerald-500', hoverColor: 'hover:bg-emerald-600', icon: Check },
        { value: 'absent', label: 'A', color: 'bg-red-500', hoverColor: 'hover:bg-red-600', icon: X },
        { value: 'late', label: 'L', color: 'bg-amber-500', hoverColor: 'hover:bg-amber-600', icon: Clock },
        { value: 'leave', label: 'Lv', color: 'bg-blue-500', hoverColor: 'hover:bg-blue-600', icon: CalendarCheck },
    ] as const

    return (
        <div className="flex items-center gap-1 p-1 bg-[var(--background-secondary)] rounded-xl">
            {options.map(opt => (
                <button
                    key={opt.value}
                    onClick={() => onChange(opt.value)}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-semibold transition-all duration-200 ${status === opt.value
                        ? `${opt.color} text-white shadow-lg scale-105`
                        : 'text-[var(--foreground-muted)] hover:bg-[var(--background-tertiary)] hover:text-[var(--foreground)]'
                        }`}
                    title={opt.value.charAt(0).toUpperCase() + opt.value.slice(1)}
                >
                    {opt.label}
                </button>
            ))}
        </div>
    )
}

// Student Attendance Row
function AttendanceRow({
    student,
    onStatusChange
}: {
    student: AttendanceRecord
    onStatusChange: (id: string, status: 'present' | 'absent' | 'late' | 'leave') => void
}) {
    return (
        <div className={`flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl border transition-all duration-200 ${student.status === 'present' ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800' :
            student.status === 'absent' ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800' :
                student.status === 'late' ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800' :
                    student.status === 'leave' ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800' :
                        'bg-[var(--card-background)] border-[var(--border)]'
            }`}>
            <div className="flex items-center gap-4 flex-1 min-w-0">
                {/* Roll Number */}
                <div className="w-10 h-10 shrink-0 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center font-mono font-bold text-sm text-[var(--foreground)]">
                    {student.rollNo}
                </div>

                {/* Name */}
                <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-[var(--foreground)] truncate">{student.name}</h4>
                    <p className="text-xs text-[var(--foreground-muted)]">Roll #{student.rollNo}</p>
                </div>

                {/* Status Badge */}
                <div className="hidden sm:block w-24">
                    {student.status && (
                        <Badge className={`w-full justify-center ${student.status === 'present' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400' :
                            student.status === 'absent' ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400' :
                                student.status === 'late' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400' :
                                    'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400'
                            }`}>
                            {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                        </Badge>
                    )}
                </div>
            </div>

            {/* Toggle */}
            <div className="flex justify-end pt-3 sm:pt-0 border-t sm:border-0 border-[var(--border)]">
                <AttendanceToggle
                    status={student.status}
                    onChange={(status) => onStatusChange(student.id, status)}
                />
            </div>
        </div>
    )
}

export default function AttendanceContent({
    initialStudents,
    initialClass,
    classes
}: {
    initialStudents: AttendanceRecord[],
    initialClass: string,
    classes: string[]
}) {
    const [selectedClass, setSelectedClass] = useState(initialClass)
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
    const [searchQuery, setSearchQuery] = useState('')
    const [students, setStudents] = useState<AttendanceRecord[]>(initialStudents)
    const [isSaving, startSavingTransition] = useTransition()
    const [isFetching, startFetchingTransition] = useTransition()

    const handleStatusChange = (id: string, status: 'present' | 'absent' | 'late' | 'leave') => {
        setStudents(prev => prev.map(s => s.id === id ? { ...s, status } : s))
    }

    const handleClassChange = (newClass: string) => {
        setSelectedClass(newClass)
        startFetchingTransition(async () => {
            const newList = await getAttendanceList(newClass, selectedDate)
            setStudents(newList)
        })
    }

    const markAllPresent = () => {
        setStudents(prev => prev.map(s => ({ ...s, status: 'present' })))
    }

    const resetAll = () => {
        setStudents(prev => prev.map(s => ({ ...s, status: null })))
    }

    const handleSave = () => {
        startSavingTransition(async () => {
            await saveAttendance(selectedClass, selectedDate, students)
            alert('Attendance saved successfully!')
        })
    }

    const stats = {
        total: students.length,
        present: students.filter(s => s.status === 'present').length,
        absent: students.filter(s => s.status === 'absent').length,
        late: students.filter(s => s.status === 'late').length,
        leave: students.filter(s => s.status === 'leave').length,
        unmarked: students.filter(s => s.status === null).length,
    }

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.rollNo.toString().includes(searchQuery)
    )

    const isComplete = stats.unmarked === 0

    return (
        <div className="space-y-6 animate-slide-up">
            {/* Header */}
            <header>
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-medium tracking-widest uppercase text-[var(--foreground-muted)]">
                        Daily Attendance
                    </span>
                </div>
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                    <div>
                        <h1 className="font-display text-3xl font-semibold tracking-tight text-[var(--foreground)]">
                            Mark Attendance
                        </h1>
                        <p className="mt-1 text-[var(--foreground-secondary)]">
                            Record daily attendance for your assigned classes
                        </p>
                    </div>
                </div>
            </header>

            {/* Class & Date Selector */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                            {/* Class Selector */}
                            <div>
                                <label className="block text-xs font-medium text-[var(--foreground-muted)] mb-1.5">Select Class</label>
                                <div className="relative">
                                    <select
                                        value={selectedClass}
                                        onChange={(e) => handleClassChange(e.target.value)}
                                        className="appearance-none w-full px-4 py-3 pr-10 bg-[var(--background-secondary)] rounded-xl text-sm font-medium text-[var(--foreground)] border border-transparent hover:border-[var(--border)] focus:outline-none focus:border-emerald-500 cursor-pointer"
                                    >
                                        {classes.map(cls => (
                                            <option key={cls} value={cls}>{cls}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--foreground-muted)] pointer-events-none" />
                                </div>
                            </div>

                            {/* Date Selector */}
                            <div>
                                <label className="block text-xs font-medium text-[var(--foreground-muted)] mb-1.5">Date</label>
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    className="w-full px-4 py-3 bg-[var(--background-secondary)] rounded-xl text-sm font-medium text-[var(--foreground)] border border-transparent hover:border-[var(--border)] focus:outline-none focus:border-emerald-500"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-[1.5]">
                            {/* Search */}
                            <div>
                                <label className="block text-xs font-medium text-[var(--foreground-muted)] mb-1.5">Search Student</label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--foreground-muted)]" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Name or roll..."
                                        className="w-full pl-10 pr-4 py-3 bg-[var(--background-secondary)] rounded-xl text-sm font-medium text-[var(--foreground)] border border-transparent hover:border-[var(--border)] focus:outline-none focus:border-emerald-500"
                                    />
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="flex items-end gap-2">
                                <Button variant="secondary" size="sm" className="flex-1 gap-2 h-11" onClick={markAllPresent}>
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                    Mark All
                                </Button>
                                <Button variant="ghost" size="sm" className="flex-1 gap-2 h-11" onClick={resetAll}>
                                    <RotateCcw className="w-4 h-4" />
                                    Reset
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                <Card className="bg-[var(--background-secondary)]">
                    <CardContent className="p-3 text-center">
                        <p className="font-display text-2xl font-bold text-[var(--foreground)]">{stats.total}</p>
                        <p className="text-xs text-[var(--foreground-muted)]">Total</p>
                    </CardContent>
                </Card>
                <Card className="bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800">
                    <CardContent className="p-3 text-center">
                        <p className="font-display text-2xl font-bold text-emerald-600">{stats.present}</p>
                        <p className="text-xs text-emerald-600/70">Present</p>
                    </CardContent>
                </Card>
                <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                    <CardContent className="p-3 text-center">
                        <p className="font-display text-2xl font-bold text-red-600">{stats.absent}</p>
                        <p className="text-xs text-red-600/70">Absent</p>
                    </CardContent>
                </Card>
                <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
                    <CardContent className="p-3 text-center">
                        <p className="font-display text-2xl font-bold text-amber-600">{stats.late}</p>
                        <p className="text-xs text-amber-600/70">Late</p>
                    </CardContent>
                </Card>
                <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                    <CardContent className="p-3 text-center">
                        <p className="font-display text-2xl font-bold text-blue-600">{stats.leave}</p>
                        <p className="text-xs text-blue-600/70">On Leave</p>
                    </CardContent>
                </Card>
                <Card className={`${stats.unmarked > 0 ? 'bg-slate-100 dark:bg-slate-800' : 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500'}`}>
                    <CardContent className="p-3 text-center">
                        <p className={`font-display text-2xl font-bold ${stats.unmarked > 0 ? 'text-slate-600' : 'text-emerald-600'}`}>
                            {stats.unmarked > 0 ? stats.unmarked : <CheckCircle2 className="w-6 h-6 mx-auto" />}
                        </p>
                        <p className={`text-xs ${stats.unmarked > 0 ? 'text-slate-500' : 'text-emerald-600/70'}`}>
                            {stats.unmarked > 0 ? 'Unmarked' : 'Complete!'}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Student List */}
            <Card className="relative">
                {isFetching && (
                    <div className="absolute inset-0 bg-white/50 dark:bg-black/50 backdrop-blur-[2px] z-10 flex items-center justify-center rounded-2xl">
                        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                    </div>
                )}
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div>
                        <CardTitle className="font-display text-lg">{selectedClass}</CardTitle>
                        <p className="text-sm text-[var(--foreground-muted)] mt-0.5">
                            {new Date(selectedDate).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                    {!isComplete && (
                        <Badge variant="warning" className="gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {stats.unmarked} pending
                        </Badge>
                    )}
                </CardHeader>
                <CardContent className="space-y-2">
                    {filteredStudents.length > 0 ? (
                        filteredStudents.map(student => (
                            <AttendanceRow
                                key={student.id}
                                student={student}
                                onStatusChange={handleStatusChange}
                            />
                        ))
                    ) : (
                        <div className="py-12 text-center bg-[var(--background-secondary)] rounded-xl border border-dashed border-[var(--border)]">
                            <p className="text-[var(--foreground-muted)]">No students found matching your search.</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Save Button */}
            <div className="sticky bottom-4 flex justify-end">
                <Button
                    size="lg"
                    className={`gap-2 shadow-2xl min-w-[200px] ${isComplete ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-slate-400'}`}
                    disabled={!isComplete || isSaving}
                    onClick={handleSave}
                >
                    {isSaving ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <Save className="w-5 h-5" />
                    )}
                    {isSaving ? 'Saving...' : 'Save Attendance'}
                </Button>
            </div>
        </div>
    )
}
