'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
    Clock,
    MapPin,
    User,
    Calendar as CalendarIcon,
    ChevronRight,
    FileText,
    Download
} from 'lucide-react'
import { ParentChild } from '../actions/types'
import { DaySchedule } from '../actions/scheduleActions'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'

export default function ScheduleContent({
    initialChildren,
    timetableData,
    selectedChildId: propSelectedChildId
}: {
    initialChildren: ParentChild[],
    timetableData: DaySchedule[],
    selectedChildId: string
}) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const [localSelectedChildId, setLocalSelectedChildId] = useState(propSelectedChildId)
    const [activeDay, setActiveDay] = useState(new Date().toLocaleDateString('en-US', { weekday: 'long' }))

    const handleChildSelect = (id: string) => {
        setLocalSelectedChildId(id)
        const params = new URLSearchParams(searchParams.toString())
        params.set('childId', id)
        router.push(`${pathname}?${params.toString()}`)
    }

    const selectedChild = initialChildren.find(c => c.id === localSelectedChildId) || initialChildren[0]
    const selectedDaySchedule = timetableData.find(d => d.day === activeDay) || timetableData[0]

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight dark:text-white">Class Timetable</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        View weekly schedule and upcoming academic sessions.
                    </p>
                </div>

                <div className="flex bg-white dark:bg-slate-900 p-1 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    {initialChildren.map((child) => (
                        <button
                            key={child.id}
                            onClick={() => handleChildSelect(child.id)}
                            className={cn(
                                "px-4 py-2 rounded-xl text-sm font-bold transition-all",
                                localSelectedChildId === child.id
                                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                                    : "text-slate-500 hover:text-blue-600"
                            )}
                        >
                            {child.name.split(' ')[0]}
                        </button>
                    ))}
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Day Selection Sidebar */}
                <div className="space-y-4">
                    <h2 className="text-sm font-black uppercase tracking-widest text-slate-500 px-1">Weekly Routine</h2>
                    <div className="flex lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 no-scrollbar">
                        {days.map((day) => (
                            <button
                                key={day}
                                onClick={() => setActiveDay(day)}
                                className={cn(
                                    "flex-shrink-0 lg:w-full text-left px-5 py-4 rounded-2xl border transition-all flex items-center justify-between",
                                    activeDay === day
                                        ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20"
                                        : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-300"
                                )}
                            >
                                <span className="font-bold">{day}</span>
                                {activeDay === day && <ChevronRight className="hidden lg:block w-4 h-4 opacity-70" />}
                            </button>
                        ))}
                    </div>

                    <Card className="p-6 border-0 bg-slate-900 text-white rounded-3xl relative overflow-hidden hidden lg:block">
                        <div className="relative z-10">
                            <h4 className="font-bold mb-2">Exam Schedule</h4>
                            <p className="text-xs text-slate-400 mb-4">Upcoming final examinations start from March 10th.</p>
                            <button
                                onClick={() => alert('Final Examination Datesheet:\n\nMarch 10: Mathematics\nMarch 12: Science\nMarch 14: English\nMarch 17: History\nMarch 19: Geography\nMarch 21: Computer Science')}
                                className="flex items-center gap-2 text-xs font-black text-blue-400 uppercase tracking-widest hover:text-blue-300 transition-colors"
                            >
                                View Datesheet <ChevronRight className="w-3 h-3" />
                            </button>
                        </div>
                        <FileText className="absolute -bottom-4 -right-4 w-24 h-24 text-white/10 -rotate-12" />
                    </Card>
                </div>

                {/* Timetable View */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 flex items-center justify-center">
                                <CalendarIcon className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-white">{activeDay}</h3>
                                <p className="text-xs text-slate-500">Scheduled Classes & Labs</p>
                            </div>
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold text-xs hover:bg-slate-200 transition-colors">
                            <Download className="w-4 h-4" /> Export
                        </button>
                    </div>

                    <div className="space-y-4 relative before:absolute before:left-[1.625rem] before:top-4 before:bottom-4 before:w-px before:bg-slate-200 dark:before:bg-slate-800">
                        {selectedDaySchedule?.slots.map((slot, i) => (
                            <div key={i} className="flex gap-6 relative group">
                                <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 flex items-center justify-center font-black text-[10px] text-blue-600 shadow-sm z-10 transition-transform group-hover:scale-110">
                                    {slot.time.split(' ')[0]}
                                    <span className="text-[8px] opacity-60 ml-0.5">{slot.time.split(' ')[1]}</span>
                                </div>
                                <Card className="flex-1 border-0 shadow-lg shadow-slate-200/40 dark:shadow-none bg-white dark:bg-slate-900 rounded-3xl overflow-hidden group-hover:border-blue-500/50 transition-all border-l-4 border-l-blue-600">
                                    <CardContent className="p-6">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h4 className="text-xl font-bold text-slate-900 dark:text-white">{slot.subject}</h4>
                                                    <Badge variant="outline" className="text-[10px] py-0 px-2 font-black uppercase tracking-tighter text-blue-600 border-blue-100 bg-blue-50/50">Theory</Badge>
                                                </div>
                                                <div className="flex flex-wrap gap-4">
                                                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                                                        <User className="w-3.5 h-3.5" />
                                                        {slot.teacher}
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                                                        <MapPin className="w-3.5 h-3.5" />
                                                        Room No. {slot.room}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                                    <Clock className="w-4 h-4" />
                                                </div>
                                                <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">Ongoing</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>

                    {!selectedDaySchedule && (
                        <div className="p-12 text-center bg-white dark:bg-slate-900 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-3xl">
                            <CalendarIcon className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                            <p className="font-bold text-slate-400">No classes scheduled for {activeDay}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ')
}
