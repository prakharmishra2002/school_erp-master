'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
    ChevronLeft,
    ChevronRight,
    Calendar as CalendarIcon,
    CheckCircle2,
    XCircle,
    Clock,
    Info
} from 'lucide-react'
import { ParentChild } from '../actions/types'
import { DayAttendance, submitLeaveRequest } from '../actions/attendanceActions'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import LeaveRequestModal from './LeaveRequestModal'
import { cn } from '@/lib/utils'

export default function AttendanceContent({
    initialChildren,
    attendanceData,
    selectedChildId: propSelectedChildId
}: {
    initialChildren: ParentChild[],
    attendanceData: DayAttendance[],
    selectedChildId: string
}) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const [localSelectedChildId, setLocalSelectedChildId] = useState(propSelectedChildId)
    const [currentDate, setCurrentDate] = useState(new Date())
    const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false)

    const handleChildSelect = (id: string) => {
        setLocalSelectedChildId(id)
        const params = new URLSearchParams(searchParams.toString())
        params.set('childId', id)
        router.push(`${pathname}?${params.toString()}`)
    }

    const selectedChild = initialChildren.find(c => c.id === localSelectedChildId) || initialChildren[0]

    // Calendar logic
    const month = currentDate.getMonth()
    const year = currentDate.getFullYear()
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    const monthName = currentDate.toLocaleString('default', { month: 'long' })

    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))

    const stats = {
        present: attendanceData.filter(d => d.status === 'present').length,
        absent: attendanceData.filter(d => d.status === 'absent').length,
        late: attendanceData.filter(d => d.status === 'late').length,
        leave: attendanceData.filter(d => d.status === 'leave').length,
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'present': return 'bg-emerald-500'
            case 'absent': return 'bg-red-500'
            case 'late': return 'bg-amber-500'
            case 'leave': return 'bg-blue-500'
            default: return 'bg-slate-200 dark:bg-slate-800'
        }
    }

    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight dark:text-white">Attendance Tracker</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Monitor daily presence and monthly statistics.
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Calendar Card */}
                <Card className="lg:col-span-2 border-0 shadow-xl rounded-3xl overflow-hidden">
                    <CardHeader className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                                    <CalendarIcon className="w-5 h-5" />
                                </div>
                                <CardTitle className="text-xl">{monthName} {year}</CardTitle>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="icon" onClick={prevMonth} className="rounded-xl">
                                    <ChevronLeft className="w-4 h-4" />
                                </Button>
                                <Button variant="outline" size="icon" onClick={nextMonth} className="rounded-xl">
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="grid grid-cols-7 mb-4">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                <div key={day} className="text-center text-xs font-bold uppercase tracking-widest text-slate-400 py-2">
                                    {day}
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-7 gap-1 sm:gap-2">
                            {Array.from({ length: firstDay }).map((_, i) => (
                                <div key={`empty-${i}`} className="h-10 sm:h-20" />
                            ))}
                            {Array.from({ length: daysInMonth }).map((_, i) => {
                                const day = i + 1
                                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                                const attendance = attendanceData.find(d => d.date === dateStr)

                                return (
                                    <div
                                        key={day}
                                        className={cn(
                                            "h-10 sm:h-20 rounded-xl sm:rounded-2xl flex flex-col items-center justify-center sm:justify-between p-1 sm:p-3 relative group transition-colors",
                                            attendance ? "bg-slate-50 dark:bg-slate-950" : "bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800"
                                        )}
                                    >
                                        <span className="text-xs sm:text-sm font-bold opacity-60">{day}</span>
                                        {attendance && (
                                            <div className={cn(
                                                "w-1.5 h-1.5 sm:w-8 sm:h-1.5 rounded-full mt-1",
                                                getStatusColor(attendance.status)
                                            )} />
                                        )}
                                        {/* Status text on desktop */}
                                        {attendance && (
                                            <span className={cn(
                                                "hidden sm:block text-[8px] font-black uppercase tracking-tighter mt-1",
                                                attendance.status === 'present' ? 'text-emerald-600' :
                                                    attendance.status === 'absent' ? 'text-red-600' :
                                                        attendance.status === 'late' ? 'text-amber-600' : 'text-blue-600'
                                            )}>
                                                {attendance.status}
                                            </span>
                                        )}
                                    </div>
                                )
                            })}
                        </div>

                        {/* Legend */}
                        <div className="mt-8 flex flex-wrap gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                            {[
                                { label: 'Present', color: 'bg-emerald-500' },
                                { label: 'Absent', color: 'bg-red-500' },
                                { label: 'Late', color: 'bg-amber-500' },
                                { label: 'Leave', color: 'bg-blue-500' },
                            ].map(item => (
                                <div key={item.label} className="flex items-center gap-2">
                                    <div className={cn("w-3 h-3 rounded-full", item.color)} />
                                    <span className="text-xs font-bold text-slate-500">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Monthly Summary */}
                <div className="space-y-6">
                    <Card className="border-0 shadow-lg rounded-3xl bg-blue-600 text-white p-6 relative overflow-hidden">
                        <div className="relative z-10">
                            <p className="text-blue-100 text-sm font-medium">Monthly Attendance Rate</p>
                            <h3 className="text-4xl font-black mt-2 tracking-tight">{selectedChild.attendance}%</h3>
                            <div className="mt-6 flex items-center gap-2 text-xs font-bold bg-white/20 px-3 py-1.5 rounded-full w-fit">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                On track for excellence
                            </div>
                        </div>
                        <CheckCircle2 className="absolute -bottom-4 -right-4 w-32 h-32 text-white/10 -rotate-12" />
                    </Card>

                    <div className="grid grid-cols-2 gap-4">
                        <StatWidget icon={CheckCircle2} label="Present" value={stats.present} color="text-emerald-500" bgColor="bg-emerald-50 dark:bg-emerald-500/10" />
                        <StatWidget icon={XCircle} label="Absent" value={stats.absent} color="text-red-500" bgColor="bg-red-50 dark:bg-red-500/10" />
                        <StatWidget icon={Clock} label="Late" value={stats.late} color="text-amber-500" bgColor="bg-amber-50 dark:bg-amber-500/10" />
                        <StatWidget icon={Info} label="Leave" value={stats.leave} color="text-blue-500" bgColor="bg-blue-50 dark:bg-blue-500/10" />
                    </div>

                    <Card className="p-5 border-slate-200 dark:border-slate-800 rounded-3xl bg-slate-50 dark:bg-slate-900">
                        <h4 className="font-bold text-slate-900 dark:text-white mb-3">Leave Request?</h4>
                        <p className="text-xs text-slate-500 leading-relaxed mb-4">
                            You can apply for your child&apos;s leave directly from the portal. Applications will be reviewed by the class teacher.
                        </p>
                        <Button
                            onClick={() => setIsLeaveModalOpen(true)}
                            className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 hover:bg-slate-50 font-bold rounded-xl shadow-sm"
                        >
                            Apply for Leave
                        </Button>
                    </Card>
                </div>
            </div>

            <LeaveRequestModal
                isOpen={isLeaveModalOpen}
                onClose={() => setIsLeaveModalOpen(false)}
                childId={localSelectedChildId}
                childName={selectedChild.name}
                onSubmit={submitLeaveRequest}
            />
        </div>
    )
}

function StatWidget({ icon: Icon, label, value, color, bgColor }: any) {
    return (
        <Card className="border-0 shadow-sm p-4 rounded-3xl bg-white dark:bg-slate-900">
            <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center mb-3", bgColor)}>
                <Icon className={cn("w-5 h-5", color)} />
            </div>
            <p className="text-2xl font-black tracking-tight">{value}</p>
            <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">{label}</p>
        </Card>
    )
}

