'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Calendar,
    Download,
    Eye,
    Upload,
    FileImage,
    Clock,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react'

interface TimetableSlot {
    subject: string
    class: string
    room: string
    type: 'class' | 'break' | 'free'
}

interface DayRow {
    time: string
    slots: { [key: string]: TimetableSlot }
}

export default function TimetablePage() {
    const [viewMode, setViewMode] = useState<'grid' | 'uploaded'>('grid')

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

    const timeSlots: DayRow[] = [
        {
            time: '8:00 - 8:45',
            slots: {
                Monday: { subject: 'Mathematics', class: '10-A', room: '301', type: 'class' },
                Tuesday: { subject: 'Mathematics', class: '10-B', room: '302', type: 'class' },
                Wednesday: { subject: 'Mathematics', class: '9-B', room: '205', type: 'class' },
                Thursday: { subject: 'Mathematics', class: '8-A', room: '102', type: 'class' },
                Friday: { subject: 'Mathematics', class: '9-A', room: '204', type: 'class' },
                Saturday: { subject: 'Mathematics', class: '10-A', room: '301', type: 'class' },
            },
        },
        {
            time: '9:00 - 9:45',
            slots: {
                Monday: { subject: 'Mathematics', class: '9-B', room: '205', type: 'class' },
                Tuesday: { subject: 'Mathematics', class: '9-A', room: '204', type: 'class' },
                Wednesday: { subject: 'Free Period', class: '', room: '', type: 'free' },
                Thursday: { subject: 'Mathematics', class: '10-A', room: '301', type: 'class' },
                Friday: { subject: 'Mathematics', class: '10-B', room: '302', type: 'class' },
                Saturday: { subject: 'Mathematics', class: '10-B', room: '302', type: 'class' },
            },
        },
        {
            time: '10:00 - 10:45',
            slots: {
                Monday: { subject: 'Mathematics', class: '8-A', room: '102', type: 'class' },
                Tuesday: { subject: 'Free Period', class: '', room: '', type: 'free' },
                Wednesday: { subject: 'Mathematics', class: '10-B', room: '302', type: 'class' },
                Thursday: { subject: 'Mathematics', class: '9-B', room: '205', type: 'class' },
                Friday: { subject: 'Free Period', class: '', room: '', type: 'free' },
                Saturday: { subject: 'Mathematics', class: '9-A', room: '204', type: 'class' },
            },
        },
        {
            time: '10:45 - 11:00',
            slots: {
                Monday: { subject: 'Short Break', class: '', room: '', type: 'break' },
                Tuesday: { subject: 'Short Break', class: '', room: '', type: 'break' },
                Wednesday: { subject: 'Short Break', class: '', room: '', type: 'break' },
                Thursday: { subject: 'Short Break', class: '', room: '', type: 'break' },
                Friday: { subject: 'Short Break', class: '', room: '', type: 'break' },
                Saturday: { subject: 'Short Break', class: '', room: '', type: 'break' },
            },
        },
        {
            time: '11:00 - 11:45',
            slots: {
                Monday: { subject: 'Free Period', class: '', room: '', type: 'free' },
                Tuesday: { subject: 'Mathematics', class: '10-A', room: '301', type: 'class' },
                Wednesday: { subject: 'Mathematics', class: '9-A', room: '204', type: 'class' },
                Thursday: { subject: 'Free Period', class: '', room: '', type: 'free' },
                Friday: { subject: 'Mathematics', class: '8-A', room: '102', type: 'class' },
                Saturday: { subject: 'Mathematics', class: '9-B', room: '205', type: 'class' },
            },
        },
        {
            time: '12:00 - 12:45',
            slots: {
                Monday: { subject: 'Lunch Break', class: '', room: '', type: 'break' },
                Tuesday: { subject: 'Lunch Break', class: '', room: '', type: 'break' },
                Wednesday: { subject: 'Lunch Break', class: '', room: '', type: 'break' },
                Thursday: { subject: 'Lunch Break', class: '', room: '', type: 'break' },
                Friday: { subject: 'Lunch Break', class: '', room: '', type: 'break' },
                Saturday: { subject: '', class: '', room: '', type: 'free' },
            },
        },
        {
            time: '1:00 - 1:45',
            slots: {
                Monday: { subject: 'Mathematics', class: '9-A', room: '204', type: 'class' },
                Tuesday: { subject: 'Mathematics', class: '8-A', room: '102', type: 'class' },
                Wednesday: { subject: 'Mathematics', class: '10-A', room: '301', type: 'class' },
                Thursday: { subject: 'Mathematics', class: '10-B', room: '302', type: 'class' },
                Friday: { subject: 'Mathematics', class: '9-B', room: '205', type: 'class' },
                Saturday: { subject: '', class: '', room: '', type: 'free' },
            },
        },
    ]

    return (
        <div className="space-y-6 animate-slide-up">
            {/* Header */}
            <header>
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <span className="text-xs font-medium tracking-widest uppercase text-[var(--foreground-muted)]">
                        Schedule
                    </span>
                </div>
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                    <div>
                        <h1 className="font-display text-3xl font-semibold tracking-tight text-[var(--foreground)]">
                            Weekly Timetable
                        </h1>
                        <p className="mt-1 text-[var(--foreground-secondary)]">
                            Your complete teaching schedule for the week
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center bg-[var(--background-secondary)] rounded-xl p-1">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'grid'
                                        ? 'bg-[var(--card-background)] text-[var(--foreground)] shadow-sm'
                                        : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)]'
                                    }`}
                            >
                                Grid View
                            </button>
                            <button
                                onClick={() => setViewMode('uploaded')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'uploaded'
                                        ? 'bg-[var(--card-background)] text-[var(--foreground)] shadow-sm'
                                        : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)]'
                                    }`}
                            >
                                Uploaded
                            </button>
                        </div>
                        <Button variant="secondary" size="sm" className="gap-2">
                            <Download className="w-4 h-4" />
                            Download
                        </Button>
                    </div>
                </div>
            </header>

            {viewMode === 'grid' ? (
                /* Grid View */
                <Card className="overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[900px]">
                            <thead>
                                <tr className="bg-[var(--background-secondary)]">
                                    <th className="p-4 text-left font-semibold text-[var(--foreground)] w-28">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-[var(--foreground-muted)]" />
                                            Time
                                        </div>
                                    </th>
                                    {days.map(day => (
                                        <th key={day} className="p-4 text-center font-semibold text-[var(--foreground)]">
                                            {day}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {timeSlots.map((row, i) => (
                                    <tr key={i} className="border-t border-[var(--border)]">
                                        <td className="p-4 font-mono text-sm text-[var(--foreground-muted)] bg-[var(--background-secondary)]">
                                            {row.time}
                                        </td>
                                        {days.map(day => {
                                            const slot = row.slots[day]
                                            return (
                                                <td key={day} className="p-2">
                                                    {slot.type === 'break' ? (
                                                        <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-center">
                                                            <p className="font-medium text-amber-700 dark:text-amber-400 text-sm">
                                                                {slot.subject}
                                                            </p>
                                                        </div>
                                                    ) : slot.type === 'free' || !slot.subject ? (
                                                        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-dashed border-slate-300 dark:border-slate-700 text-center">
                                                            <p className="text-[var(--foreground-muted)] text-sm">Free</p>
                                                        </div>
                                                    ) : (
                                                        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 hover:shadow-md transition-shadow cursor-pointer">
                                                            <p className="font-semibold text-emerald-700 dark:text-emerald-400 text-sm">
                                                                {slot.subject}
                                                            </p>
                                                            <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70 mt-1">
                                                                {slot.class} • {slot.room}
                                                            </p>
                                                        </div>
                                                    )}
                                                </td>
                                            )
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            ) : (
                /* Uploaded Timetable View */
                <Card>
                    <CardContent className="p-8">
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 flex items-center justify-center mb-4">
                                <FileImage className="w-10 h-10 text-blue-500" />
                            </div>
                            <h3 className="font-display text-xl font-semibold text-[var(--foreground)] mb-2">
                                No Timetable Uploaded
                            </h3>
                            <p className="text-[var(--foreground-muted)] mb-6 max-w-md">
                                The school administration can upload a PDF or image version of the official timetable here.
                            </p>
                            <Button variant="secondary" className="gap-2">
                                <Upload className="w-4 h-4" />
                                Request Upload
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-300" />
                    <span className="text-[var(--foreground-muted)]">Class Period</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-amber-100 dark:bg-amber-900/30 border border-amber-300" />
                    <span className="text-[var(--foreground-muted)]">Break</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-slate-100 dark:bg-slate-800 border border-dashed border-slate-300" />
                    <span className="text-[var(--foreground-muted)]">Free Period</span>
                </div>
            </div>
        </div>
    )
}
