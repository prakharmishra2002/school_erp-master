'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    Plus,
    Calendar,
    Clock,
    User,
    ChevronRight,
    Download,
    Printer,
    Filter,
    Search,
    AlertTriangle,
    Zap,
    CheckCircle2,
    Settings2,
    LayoutGrid,
    Users,
    ArrowUpRight,
    ArrowLeftRight,
    Library,
    DoorOpen,
    UserCheck,
    ShieldCheck,
    MapPin,
    History,
    Info
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from 'sonner'

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const periods = ['P1', 'P2', 'P3', 'P4', 'Break', 'P5', 'P6', 'P7', 'P8']

interface ScheduleSlot {
    subject: string
    teacherId: string
    teacherName: string
    color: string
}

const mockSchedule: Record<string, Record<string, ScheduleSlot>> = {
    'Monday': {
        'P1': { subject: 'Mathematics', teacherId: 'T001', teacherName: 'Meenkashi Iyer', color: 'bg-indigo-500' },
        'P2': { subject: 'Chemistry', teacherId: 'T008', teacherName: 'Dr. Verma', color: 'bg-emerald-600' },
        'P3': { subject: 'Physics', teacherId: 'T001', teacherName: 'Suresh Kumar', color: 'bg-rose-500' },
        'P5': { subject: 'English', teacherId: 'T012', teacherName: 'Anita Desai', color: 'bg-amber-500' },
    },
    'Tuesday': {
        'P1': { subject: 'Physics', teacherId: 'T001', teacherName: 'Suresh Kumar', color: 'bg-rose-500' },
        'P2': { subject: 'Mathematics', teacherId: 'T001', teacherName: 'Meenkashi Iyer', color: 'bg-indigo-500' },
        'P4': { subject: 'Biology', teacherId: 'T015', teacherName: 'Sneha Rao', color: 'bg-blue-600' },
    }
}

export default function TimetableBuilderPage() {
    const [selectedClass, setSelectedClass] = useState('10A')
    const [schedule, setSchedule] = useState(mockSchedule)

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Link href="/admin/dashboard" className="text-sm font-medium text-[var(--foreground-secondary)] hover:text-indigo-600 transition-colors">Admin Dashboard</Link>
                        <ChevronRight className="w-4 h-4 text-[var(--foreground-muted)]" />
                        <span className="text-sm font-bold text-indigo-600 uppercase tracking-widest">Timetable Hub</span>
                    </div>
                    <h1 className="text-3xl font-black tracking-tight text-[var(--foreground)]">Class Schedule Designer</h1>
                    <p className="text-[var(--foreground-secondary)] mt-1 font-medium">Design weekly routines, manage teacher workloads, and prevent schedule overlaps.</p>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-12 border-[var(--border)] rounded-2xl px-6 font-bold text-[var(--foreground-secondary)] bg-[var(--card-background)] shadow-sm">
                        <Printer className="w-4 h-4 mr-2" />
                        Print Layout
                    </Button>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="h-12 bg-indigo-600 hover:bg-indigo-700 rounded-2xl px-8 font-bold text-white shadow-xl shadow-indigo-600/20 transform hover:scale-105 transition-all">
                                <Plus className="w-5 h-5 mr-2" />
                                Assign Period
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] rounded-[2rem] border-[var(--border)] bg-[var(--card-background)] p-8 shadow-2xl">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-black text-[var(--foreground)]">New Assignment</DialogTitle>
                                <DialogDescription className="text-[var(--foreground-secondary)] font-medium">Link a subject and teacher to a time slot.</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-6 py-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)] ml-1">Subject</label>
                                    <Select>
                                        <SelectTrigger className="h-12 rounded-2xl bg-[var(--background-secondary)] border-[var(--border)] font-bold italic">
                                            <SelectValue placeholder="Select subject" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-2xl border-[var(--border)] bg-[var(--card-background)]">
                                            <SelectItem value="math" className="font-bold text-[var(--foreground)]">Mathematics</SelectItem>
                                            <SelectItem value="sci" className="font-bold text-[var(--foreground)]">Natural Sciences</SelectItem>
                                            <SelectItem value="eng" className="font-bold text-[var(--foreground)]">English Literature</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)] ml-1">Faculty Member</label>
                                    <Select>
                                        <SelectTrigger className="h-12 rounded-2xl bg-[var(--background-secondary)] border-[var(--border)] font-bold italic">
                                            <SelectValue placeholder="Select teacher" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-2xl border-[var(--border)] bg-[var(--card-background)]">
                                            <SelectItem value="t1" className="font-bold text-[var(--foreground)]">Meenkashi Iyer</SelectItem>
                                            <SelectItem value="t2" className="font-bold text-[var(--foreground)]">Dr. Verma</SelectItem>
                                            <SelectItem value="t3" className="font-bold text-[var(--foreground)]">Suresh Kumar</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)] ml-1">Day</label>
                                        <Select>
                                            <SelectTrigger className="h-12 rounded-2xl bg-[var(--background-secondary)] border-[var(--border)] font-bold italic">
                                                <SelectValue placeholder="Select day" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-2xl border-[var(--border)] bg-[var(--card-background)]">
                                                {days.map(d => <SelectItem key={d} value={d} className="font-bold text-[var(--foreground)]">{d}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)] ml-1">Slot</label>
                                        <Select>
                                            <SelectTrigger className="h-12 rounded-2xl bg-[var(--background-secondary)] border-[var(--border)] font-bold italic">
                                                <SelectValue placeholder="Select period" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-2xl border-[var(--border)] bg-[var(--card-background)]">
                                                {periods.filter(p => p !== 'Break').map(p => <SelectItem key={p} value={p} className="font-bold text-[var(--foreground)]">{p}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={() => toast.success('Assignment Synchronized')} className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all">
                                    Confirm Assignment
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Sub-Module Navigation */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { name: 'Periods', path: '/admin/timetable/periods', icon: Clock, color: 'indigo' },
                    { name: 'Workload', path: '/admin/timetable/teacher-workload', icon: Users, color: 'emerald' },
                    { name: 'Substitution', path: '/admin/timetable/substitutions', icon: UserCheck, color: 'rose' },
                    { name: 'Rooms', path: '/admin/timetable/room-allocation', icon: DoorOpen, color: 'amber' },
                ].map((link, i) => (
                    <Link key={i} href={link.path}>
                        <Card className="border-none bg-[var(--card-background)] rounded-3xl shadow-lg shadow-slate-200/40 dark:shadow-none p-4 hover:shadow-xl transition-all group flex items-center gap-4 cursor-pointer">
                            <div className={cn(
                                "w-10 h-10 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110",
                                link.color === 'indigo' ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30" :
                                    link.color === 'emerald' ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30" :
                                        link.color === 'rose' ? "bg-rose-50 text-rose-600 dark:bg-rose-900/30" :
                                            "bg-amber-50 text-amber-600 dark:bg-amber-900/30"
                            )}>
                                <link.icon className="w-5 h-5" />
                            </div>
                            <span className="text-[11px] font-black uppercase tracking-widest text-[var(--foreground)] group-hover:text-indigo-600 transition-colors">{link.name}</span>
                        </Card>
                    </Link>
                ))}
            </div>

            {/* Selection & Quick Stats Control */}
            <div className="flex flex-col xl:flex-row gap-6">
                <Card className="border-none bg-[var(--card-background)] rounded-[2rem] shadow-xl shadow-slate-200/40 dark:shadow-none p-6 flex-1">
                    <div className="flex flex-col md:flex-row gap-6 items-center">
                        <div className="w-full md:w-64 space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--foreground-muted)] ml-1">Target Academic Class</label>
                            <Select defaultValue="10A">
                                <SelectTrigger className="h-14 rounded-2xl border-[var(--border)] bg-[var(--background-secondary)] font-black text-[var(--foreground)] focus:bg-[var(--card-background)] transition-all">
                                    <SelectValue placeholder="Select class" />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-[var(--border)] p-2 bg-[var(--card-background)]">
                                    <SelectItem value="10A" className="rounded-xl font-bold py-3 px-4 italic">Class 10 - Section A</SelectItem>
                                    <SelectItem value="10B" className="rounded-xl font-bold py-3 px-4 italic">Class 10 - Section B</SelectItem>
                                    <SelectItem value="9A" className="rounded-xl font-bold py-3 px-4 italic">Class 9 - Section A</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="hidden md:block w-px h-16 bg-[var(--border)]" />
                        <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { label: 'Working Days', value: '06', color: 'text-indigo-600' },
                                { label: 'Weekly Periods', value: '42', color: 'text-emerald-600' },
                                { label: 'Assigned Slots', value: '38', color: 'text-amber-500' },
                                { label: 'Conflicts Found', value: '00', color: 'text-[var(--foreground-muted)]' },
                            ].map((stat, i) => (
                                <div key={i} className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--foreground-muted)] mb-1">{stat.label}</span>
                                    <span className={cn("text-xl font-black leading-none", stat.color)}>{stat.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>
            </div>

            {/* Visual Timetable Grid */}
            <Card className="border-none bg-[var(--card-background)] rounded-[2.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-none overflow-hidden">
                <div className="overflow-x-auto">
                    <div className="min-w-[1200px]">
                        {/* Period Header */}
                        <div className="grid grid-cols-[140px_repeat(9,1fr)] bg-[var(--background-secondary)]/80 border-b border-[var(--border)] italic">
                            <div className="px-6 py-6 border-r border-[var(--border)] text-[10px] font-black uppercase tracking-[0.2em] text-[var(--foreground-muted)]">Weekdays</div>
                            {periods.map((p, i) => (
                                <div key={i} className={cn(
                                    "px-4 py-6 text-center text-[10px] font-black uppercase tracking-[0.2em]",
                                    p === 'Break' ? "bg-amber-50/50 dark:bg-amber-900/20 text-amber-600" : "text-[var(--foreground)]"
                                )}>
                                    <div className="flex flex-col gap-1 items-center">
                                        <Clock className="w-3 h-3 opacity-30" />
                                        <span>{p}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Days Body */}
                        {days.map((day, di) => (
                            <div key={di} className="grid grid-cols-[140px_repeat(9,1fr)] border-b border-[var(--border)] last:border-none group">
                                <div className="px-6 py-8 border-r border-[var(--border)] flex items-center justify-center bg-[var(--background-secondary)]/30 group-hover:bg-[var(--background-secondary)] transition-colors">
                                    <h4 className="text-xs font-black text-[var(--foreground)] tracking-tight uppercase whitespace-nowrap">{day}</h4>
                                </div>
                                {periods.map((p, pi) => {
                                    const slot = schedule[day]?.[p]
                                    const isBreak = p === 'Break'

                                    if (isBreak) {
                                        return (
                                            <div key={pi} className="flex items-center justify-center p-2 bg-amber-50/20 dark:bg-amber-900/10 border-r border-[var(--border)]/50">
                                                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500/30 -rotate-90">Lunch Interval</div>
                                            </div>
                                        )
                                    }

                                    return (
                                        <div key={pi} className="p-3 border-r border-[var(--border)] last:border-none relative min-h-[140px] hover:bg-[var(--background-secondary)]/50 transition-all cursor-pointer group/slot">
                                            {slot ? (
                                                <div className={cn(
                                                    "h-full w-full rounded-3xl p-4 flex flex-col justify-between shadow-lg shadow-indigo-500/5 transition-all group-hover/slot:scale-[1.03] group-hover/slot:shadow-xl",
                                                    "bg-[var(--card-background)] border-l-4",
                                                    slot.color.replace('bg-', 'border-')
                                                )}>
                                                    <div>
                                                        <h5 className="text-xs font-black text-[var(--foreground)] leading-tight mb-2 uppercase tracking-tight">{slot.subject}</h5>
                                                        <div className="flex items-center gap-1.5">
                                                            <div className={cn("w-1.5 h-1.5 rounded-full", slot.color)} />
                                                            <span className="text-[10px] font-bold text-[var(--foreground-secondary)] truncate">{slot.teacherName.split(' ')[0]}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between mt-auto pt-4">
                                                        <Badge variant="outline" className="text-[8px] font-black border-[var(--border)] text-[var(--foreground-muted)] rounded-lg px-2 shadow-none">
                                                            {p}
                                                        </Badge>
                                                        <Button variant="ghost" size="icon" className="h-6 w-6 rounded-lg text-[var(--foreground-muted)] hover:text-indigo-600 transition-colors">
                                                            <Settings2 className="w-3 h-3" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="h-full w-full rounded-2xl border-2 border-dashed border-[var(--border)] flex flex-col items-center justify-center opacity-0 group-hover/slot:opacity-100 transition-all duration-500 hover:border-indigo-200 dark:hover:border-indigo-700">
                                                    <Plus className="w-5 h-5 text-[var(--foreground-muted)] mb-2" />
                                                    <span className="text-[8px] font-black uppercase tracking-widest text-[var(--foreground-muted)]">Assign Slot</span>
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </Card>

            {/* Smart Conflict & Insights Hub */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="border-none bg-[var(--card-background)] rounded-[2.5rem] shadow-xl shadow-slate-200/40 dark:shadow-none p-8">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 flex items-center justify-center">
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="text-lg font-black text-[var(--foreground)]">Conflict Health Check</h4>
                            <p className="text-xs font-semibold text-[var(--foreground-secondary)]">Real-time validation against school scheduling policies.</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 p-5 rounded-3xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100/50 dark:border-emerald-800/50">
                            <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                            <div>
                                <h5 className="text-sm font-bold text-emerald-900 dark:text-emerald-300 leading-none mb-1">Teacher Availability Validated</h5>
                                <p className="text-xs text-emerald-700/70 dark:text-emerald-400/70 font-medium">All assigned faculty are free during their selected slots for Class 10A.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-5 rounded-3xl bg-[var(--background-secondary)] border border-[var(--border)]">
                            <Info className="w-6 h-6 text-[var(--foreground-muted)] shrink-0" />
                            <div>
                                <h5 className="text-sm font-bold text-[var(--foreground)] leading-none mb-1">Capacity Optimization</h5>
                                <p className="text-xs text-[var(--foreground-secondary)] font-medium">Classroom #402 has 12% usage. Consider re-allocating periods for energy efficiency.</p>
                            </div>
                        </div>
                    </div>
                </Card>

                <div className="space-y-6">
                    <div className="p-8 rounded-[2.5rem] bg-indigo-600 shadow-2xl shadow-indigo-600/30 text-white relative overflow-hidden group h-full">
                        <div className="relative z-10 flex flex-col justify-between h-full">
                            <div className="space-y-3">
                                <h4 className="text-2xl font-black flex items-center gap-3">
                                    <Zap className="w-8 h-8 text-indigo-300" />
                                    Smart Scheduler
                                </h4>
                                <p className="text-indigo-100/80 text-sm font-medium leading-relaxed max-w-sm">
                                    Automatically populate the rest of the week based on historical teacher workloads and subject priorities.
                                </p>
                            </div>
                            <Button onClick={() => toast.info('AI Engine Initializing...')} className="h-14 mt-8 rounded-2xl bg-white text-indigo-600 hover:bg-white/90 font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all">
                                Request Auto-Population
                                <ArrowLeftRight className="w-4 h-4 ml-3" />
                            </Button>
                        </div>
                        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000" />
                    </div>
                </div>
            </div>

            {/* Legend / Resource Guide Bottom */}
            <div className="flex flex-wrap items-center justify-center gap-8 py-8 opacity-40 hover:opacity-100 transition-opacity">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-indigo-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]">Mathematics</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]">Physical Sciences</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-600" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]">Biological Sciences</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]">Languages & Lit.</span>
                </div>
            </div>
        </div>
    )
}
