'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    ChevronLeft,
    ChevronRight,
    Clock,
    MapPin,
    Users,
    BookOpen,
    Calendar,
} from 'lucide-react'

interface ScheduleSlot {
    time: string
    endTime: string
    subject: string
    class: string
    room: string
    type: 'class' | 'break' | 'free'
}

interface DaySchedule {
    day: string
    date: string
    isToday: boolean
    slots: ScheduleSlot[]
}

// Schedule Slot Component
function ScheduleSlotCard({ slot }: { slot: ScheduleSlot }) {
    if (slot.type === 'break') {
        return (
            <div className="flex items-center gap-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/50">
                <div className="w-16 text-center">
                    <p className="text-xs font-medium text-amber-600">{slot.time}</p>
                </div>
                <div className="flex-1">
                    <p className="font-medium text-amber-700 dark:text-amber-400">{slot.subject}</p>
                </div>
            </div>
        )
    }

    if (slot.type === 'free') {
        return (
            <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-dashed border-slate-300 dark:border-slate-700">
                <div className="w-16 text-center">
                    <p className="text-xs font-medium text-[var(--foreground-muted)]">{slot.time}</p>
                </div>
                <div className="flex-1">
                    <p className="text-[var(--foreground-muted)]">Free Period</p>
                </div>
            </div>
        )
    }

    return (
        <div className="group flex items-center gap-4 p-4 rounded-xl bg-[var(--card-background)] border border-[var(--border)] hover:border-emerald-300 hover:shadow-lg transition-all duration-200">
            {/* Time */}
            <div className="w-16 text-center shrink-0">
                <p className="text-sm font-semibold text-[var(--foreground)]">{slot.time}</p>
                <p className="text-xs text-[var(--foreground-muted)]">{slot.endTime}</p>
            </div>

            {/* Divider */}
            <div className="w-1 h-12 rounded-full bg-gradient-to-b from-emerald-400 to-teal-500" />

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-[var(--foreground)]">{slot.subject}</h4>
                </div>
                <div className="flex items-center gap-4 text-sm text-[var(--foreground-muted)]">
                    <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        {slot.class}
                    </span>
                    <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {slot.room}
                    </span>
                </div>
            </div>

            {/* Action */}
            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                View
            </Button>
        </div>
    )
}

// Day Column Component
function DayColumn({ day }: { day: DaySchedule }) {
    return (
        <div className={`rounded-2xl border ${day.isToday ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50/50 dark:bg-emerald-900/10' : 'border-[var(--border)] bg-[var(--card-background)]'}`}>
            {/* Day Header */}
            <div className={`p-4 border-b ${day.isToday ? 'border-emerald-200 dark:border-emerald-800' : 'border-[var(--border)]'}`}>
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className={`font-display text-lg font-semibold ${day.isToday ? 'text-emerald-700 dark:text-emerald-400' : 'text-[var(--foreground)]'}`}>
                            {day.day}
                        </h3>
                        <p className="text-sm text-[var(--foreground-muted)]">{day.date}</p>
                    </div>
                    {day.isToday && (
                        <Badge className="bg-emerald-500 text-white">Today</Badge>
                    )}
                </div>
            </div>

            {/* Slots */}
            <div className="p-3 space-y-2">
                {day.slots.map((slot, i) => (
                    <ScheduleSlotCard key={i} slot={slot} />
                ))}
            </div>
        </div>
    )
}

export default function SchedulePage() {
    const [weekOffset, setWeekOffset] = useState(0)

    const weekSchedule: DaySchedule[] = [
        {
            day: 'Monday',
            date: 'Jan 27',
            isToday: false,
            slots: [
                { time: '8:00', endTime: '8:45', subject: 'Mathematics', class: 'Class 10-A', room: 'Room 301', type: 'class' },
                { time: '9:00', endTime: '9:45', subject: 'Mathematics', class: 'Class 9-B', room: 'Room 205', type: 'class' },
                { time: '10:00', endTime: '10:45', subject: 'Mathematics', class: 'Class 8-A', room: 'Room 102', type: 'class' },
                { time: '10:45', endTime: '11:00', subject: 'Short Break', class: '', room: '', type: 'break' },
                { time: '11:00', endTime: '11:45', subject: 'Free Period', class: '', room: '', type: 'free' },
                { time: '12:00', endTime: '12:45', subject: 'Lunch Break', class: '', room: '', type: 'break' },
                { time: '1:00', endTime: '1:45', subject: 'Mathematics', class: 'Class 9-A', room: 'Room 204', type: 'class' },
            ],
        },
        {
            day: 'Tuesday',
            date: 'Jan 28',
            isToday: true,
            slots: [
                { time: '8:00', endTime: '8:45', subject: 'Mathematics', class: 'Class 10-B', room: 'Room 302', type: 'class' },
                { time: '9:00', endTime: '9:45', subject: 'Mathematics', class: 'Class 9-A', room: 'Room 204', type: 'class' },
                { time: '10:00', endTime: '10:45', subject: 'Free Period', class: '', room: '', type: 'free' },
                { time: '10:45', endTime: '11:00', subject: 'Short Break', class: '', room: '', type: 'break' },
                { time: '11:00', endTime: '11:45', subject: 'Mathematics', class: 'Class 10-A', room: 'Room 301', type: 'class' },
                { time: '12:00', endTime: '12:45', subject: 'Lunch Break', class: '', room: '', type: 'break' },
                { time: '1:00', endTime: '1:45', subject: 'Mathematics', class: 'Class 8-A', room: 'Room 102', type: 'class' },
            ],
        },
        {
            day: 'Wednesday',
            date: 'Jan 29',
            isToday: false,
            slots: [
                { time: '8:00', endTime: '8:45', subject: 'Mathematics', class: 'Class 9-B', room: 'Room 205', type: 'class' },
                { time: '9:00', endTime: '9:45', subject: 'Free Period', class: '', room: '', type: 'free' },
                { time: '10:00', endTime: '10:45', subject: 'Mathematics', class: 'Class 10-B', room: 'Room 302', type: 'class' },
                { time: '10:45', endTime: '11:00', subject: 'Short Break', class: '', room: '', type: 'break' },
                { time: '11:00', endTime: '11:45', subject: 'Mathematics', class: 'Class 9-A', room: 'Room 204', type: 'class' },
                { time: '12:00', endTime: '12:45', subject: 'Lunch Break', class: '', room: '', type: 'break' },
                { time: '1:00', endTime: '1:45', subject: 'Mathematics', class: 'Class 10-A', room: 'Room 301', type: 'class' },
            ],
        },
        {
            day: 'Thursday',
            date: 'Jan 30',
            isToday: false,
            slots: [
                { time: '8:00', endTime: '8:45', subject: 'Mathematics', class: 'Class 8-A', room: 'Room 102', type: 'class' },
                { time: '9:00', endTime: '9:45', subject: 'Mathematics', class: 'Class 10-A', room: 'Room 301', type: 'class' },
                { time: '10:00', endTime: '10:45', subject: 'Mathematics', class: 'Class 9-B', room: 'Room 205', type: 'class' },
                { time: '10:45', endTime: '11:00', subject: 'Short Break', class: '', room: '', type: 'break' },
                { time: '11:00', endTime: '11:45', subject: 'Free Period', class: '', room: '', type: 'free' },
                { time: '12:00', endTime: '12:45', subject: 'Lunch Break', class: '', room: '', type: 'break' },
                { time: '1:00', endTime: '1:45', subject: 'Mathematics', class: 'Class 10-B', room: 'Room 302', type: 'class' },
            ],
        },
        {
            day: 'Friday',
            date: 'Jan 31',
            isToday: false,
            slots: [
                { time: '8:00', endTime: '8:45', subject: 'Mathematics', class: 'Class 9-A', room: 'Room 204', type: 'class' },
                { time: '9:00', endTime: '9:45', subject: 'Mathematics', class: 'Class 10-B', room: 'Room 302', type: 'class' },
                { time: '10:00', endTime: '10:45', subject: 'Free Period', class: '', room: '', type: 'free' },
                { time: '10:45', endTime: '11:00', subject: 'Short Break', class: '', room: '', type: 'break' },
                { time: '11:00', endTime: '11:45', subject: 'Mathematics', class: 'Class 8-A', room: 'Room 102', type: 'class' },
                { time: '12:00', endTime: '12:45', subject: 'Lunch Break', class: '', room: '', type: 'break' },
                { time: '1:00', endTime: '1:45', subject: 'Mathematics', class: 'Class 9-B', room: 'Room 205', type: 'class' },
            ],
        },
        {
            day: 'Saturday',
            date: 'Feb 1',
            isToday: false,
            slots: [
                { time: '8:00', endTime: '8:45', subject: 'Mathematics', class: 'Class 10-A', room: 'Room 301', type: 'class' },
                { time: '9:00', endTime: '9:45', subject: 'Mathematics', class: 'Class 10-B', room: 'Room 302', type: 'class' },
                { time: '10:00', endTime: '10:45', subject: 'Mathematics', class: 'Class 9-A', room: 'Room 204', type: 'class' },
                { time: '10:45', endTime: '11:00', subject: 'Short Break', class: '', room: '', type: 'break' },
                { time: '11:00', endTime: '11:45', subject: 'Mathematics', class: 'Class 9-B', room: 'Room 205', type: 'class' },
            ],
        },
    ]

    const totalClasses = weekSchedule.reduce((acc, day) => acc + day.slots.filter(s => s.type === 'class').length, 0)

    return (
        <div className="space-y-6 animate-slide-up">
            {/* Header */}
            <header>
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-2 h-2 rounded-full bg-violet-500" />
                    <span className="text-xs font-medium tracking-widest uppercase text-[var(--foreground-muted)]">
                        Schedule
                    </span>
                </div>
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                    <div>
                        <h1 className="font-display text-3xl font-semibold tracking-tight text-[var(--foreground)]">
                            My Schedule
                        </h1>
                        <p className="mt-1 text-[var(--foreground-secondary)]">
                            View your weekly teaching schedule
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="secondary" size="sm" onClick={() => setWeekOffset(prev => prev - 1)}>
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <Button variant="secondary" size="sm" className="gap-2" onClick={() => setWeekOffset(0)}>
                            <Calendar className="w-4 h-4" />
                            This Week
                        </Button>
                        <Button variant="secondary" size="sm" onClick={() => setWeekOffset(prev => prev + 1)}>
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </header>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-violet-200/50 dark:border-violet-800/50 bg-gradient-to-br from-violet-500/5 to-purple-500/5">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center">
                            <Clock className="w-6 h-6 text-violet-600" />
                        </div>
                        <div>
                            <p className="font-display text-2xl font-semibold text-violet-600">{totalClasses}</p>
                            <p className="text-sm text-[var(--foreground-muted)]">Classes This Week</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-emerald-200/50 dark:border-emerald-800/50 bg-gradient-to-br from-emerald-500/5 to-teal-500/5">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center">
                            <BookOpen className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div>
                            <p className="font-display text-2xl font-semibold text-emerald-600">4</p>
                            <p className="text-sm text-[var(--foreground-muted)]">Sections Teaching</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-blue-200/50 dark:border-blue-800/50 bg-gradient-to-br from-blue-500/5 to-indigo-500/5">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justify-center">
                            <Users className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="font-display text-2xl font-semibold text-blue-600">186</p>
                            <p className="text-sm text-[var(--foreground-muted)]">Total Students</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-amber-200/50 dark:border-amber-800/50 bg-gradient-to-br from-amber-500/5 to-orange-500/5">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
                            <MapPin className="w-6 h-6 text-amber-600" />
                        </div>
                        <div>
                            <p className="font-display text-2xl font-semibold text-amber-600">5</p>
                            <p className="text-sm text-[var(--foreground-muted)]">Rooms Used</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Week Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {weekSchedule.map((day, i) => (
                    <DayColumn key={i} day={day} />
                ))}
            </div>
        </div>
    )
}
