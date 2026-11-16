'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    Users,
    Search,
    ChevronLeft,
    BarChart3,
    AlertCircle,
    CheckCircle2,
    BookOpen,
    Filter,
    Plus
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Progress } from "@/components/ui/progress"
import { Input } from '@/components/ui/input'

const facultyWorkload = [
    { id: '1', name: 'Dr. Sarah Wilson', subjects: ['Physics', 'Maths'], currentHours: 28, maxHours: 30, status: 'Optimal' },
    { id: '2', name: 'John Doe', subjects: ['Chemistry'], currentHours: 32, maxHours: 30, status: 'Overloaded' },
    { id: '3', name: 'Alice Smith', subjects: ['English', 'History'], currentHours: 15, maxHours: 30, status: 'Under-utilized' },
    { id: '4', name: 'Robert Brown', subjects: ['Computer Sci'], currentHours: 25, maxHours: 25, status: 'At Capacity' },
    { id: '5', name: 'Emma Davis', subjects: ['Biology'], currentHours: 18, maxHours: 30, status: 'Optimal' },
]

export default function TeacherWorkloadPage() {
    const [search, setSearch] = useState('')

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Link href="/admin/timetable" className="text-sm font-medium text-[var(--foreground-secondary)] hover:text-indigo-600 transition-colors flex items-center gap-1">
                            <ChevronLeft className="w-4 h-4" />
                            Back to Designer
                        </Link>
                    </div>
                    <h1 className="text-3xl font-black tracking-tight text-[var(--foreground)]">Teacher Workload Analytics</h1>
                    <p className="text-[var(--foreground-secondary)] mt-1 font-medium">Monitor faculty distribution, weekly hours, and assignment balance.</p>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-12 border-[var(--border)] rounded-2xl px-6 font-bold text-[var(--foreground)] hover:bg-[var(--background-secondary)]">
                        <Filter className="w-4 h-4 mr-2" />
                        Refine View
                    </Button>
                    <Button className="h-12 bg-indigo-600 hover:bg-indigo-700 rounded-2xl px-8 font-bold text-white shadow-xl shadow-indigo-600/20 transform hover:scale-105 transition-all">
                        Generate Report
                    </Button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Total Faculty', value: '42', icon: Users, color: 'indigo' },
                    { label: 'Avg Weekly Hours', value: '24.5', icon: BarChart3, color: 'emerald' },
                    { label: 'Overloaded Staff', value: '3', icon: AlertCircle, color: 'rose' },
                    { label: 'Assigned Subjects', value: '18', icon: BookOpen, color: 'amber' },
                ].map((stat, i) => (
                    <Card key={i} className="border-none bg-[var(--card-background)] rounded-3xl shadow-lg shadow-slate-200/40 dark:shadow-none p-6 flex items-center gap-4">
                        <div className={cn(
                            "w-12 h-12 rounded-2xl flex items-center justify-center",
                            stat.color === 'indigo' ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30" :
                                stat.color === 'emerald' ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30" :
                                    stat.color === 'rose' ? "bg-rose-50 text-rose-600 dark:bg-rose-900/30" :
                                        "bg-amber-50 text-amber-600 dark:bg-amber-900/30"
                        )}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)]">{stat.label}</p>
                            <p className="text-2xl font-black text-[var(--foreground)]">{stat.value}</p>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Faculty List */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-none bg-[var(--card-background)] rounded-[2.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-none overflow-hidden">
                        <CardHeader className="p-8 border-b border-[var(--border)]">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <CardTitle className="text-xl font-black text-[var(--foreground)]">Workload Distribution</CardTitle>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--foreground-muted)]" />
                                    <Input
                                        placeholder="Search faculty..."
                                        className="h-10 pl-10 rounded-xl bg-[var(--background-secondary)] border-transparent w-[250px] font-medium"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-[var(--border)]">
                                {facultyWorkload.filter(f => f.name.toLowerCase().includes(search.toLowerCase())).map((f) => {
                                    const percentage = (f.currentHours / f.maxHours) * 100
                                    return (
                                        <div key={f.id} className="p-8 hover:bg-[var(--background-secondary)]/30 transition-all group">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-indigo-600/20">
                                                        {f.name.split(' ').map(n => n[0]).join('')}
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-[var(--foreground)] text-lg leading-tight">{f.name}</p>
                                                        <div className="flex gap-2 mt-1">
                                                            {f.subjects.map(s => (
                                                                <Badge key={s} variant="outline" className="text-[9px] font-bold border-indigo-100 text-indigo-600 dark:border-indigo-900">
                                                                    {s}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex-1 max-w-[300px] space-y-2">
                                                    <div className="flex justify-between items-end">
                                                        <p className="text-[10px] font-black text-[var(--foreground-muted)] uppercase tracking-widest">Load Velocity</p>
                                                        <p className="text-xs font-black text-[var(--foreground)]">{f.currentHours} / {f.maxHours} hrs</p>
                                                    </div>
                                                    <Progress value={percentage} className={cn(
                                                        "h-2 rounded-full",
                                                        percentage > 100 ? "[&>div]:bg-rose-500" :
                                                            percentage === 100 ? "[&>div]:bg-amber-500" :
                                                                "[&>div]:bg-indigo-600"
                                                    )} />
                                                </div>
                                                <div className="flex flex-row md:flex-col items-center md:items-end gap-1">
                                                    <Badge className={cn(
                                                        "rounded-lg border-none px-3 py-1 font-bold text-[10px]",
                                                        f.status === 'Optimal' ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30" :
                                                            f.status === 'Overloaded' ? "bg-rose-50 text-rose-600 dark:bg-rose-900/30" :
                                                                f.status === 'Under-utilized' ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30" :
                                                                    "bg-amber-50 text-amber-600 dark:bg-amber-900/30"
                                                    )}>
                                                        {f.status}
                                                    </Badge>
                                                    <p className="text-[9px] font-bold text-[var(--foreground-muted)] uppercase tracking-widest mt-1">Update: 2h ago</p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Insights Hub */}
                <div className="space-y-6">
                    <Card className="border-none bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
                        <div className="relative z-10">
                            <CheckCircle2 className="w-10 h-10 mb-6 text-indigo-200" />
                            <h4 className="text-xl font-black mb-2">Workload Health</h4>
                            <p className="text-indigo-100 text-sm font-medium leading-relaxed opacity-80 mb-6">
                                92% of faculty members are within their optimal teaching capacity. No critical bottlenecks detected.
                            </p>
                            <Button className="w-full h-12 bg-white text-indigo-600 hover:bg-white/90 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl">
                                Detailed Audit
                            </Button>
                        </div>
                        <BarChart3 className="absolute -bottom-10 -right-10 w-48 h-48 text-white/10 rotate-12" />
                    </Card>

                    <Card className="border-none bg-[var(--card-background)] rounded-[2.5rem] shadow-xl shadow-slate-200/40 dark:shadow-none p-8">
                        <h4 className="font-black text-[var(--foreground)] mb-6">Capacity Alerts</h4>
                        <div className="space-y-4">
                            {[
                                { teacher: 'John Doe', issue: 'Overloaded by 2 hours', level: 'High' },
                                { teacher: 'Physics Dept', issue: 'Resource gap for Class 10', level: 'Medium' },
                            ].map((alert, i) => (
                                <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-[var(--background-secondary)]/50 border border-[var(--border)]">
                                    <div className={cn(
                                        "w-2 h-2 rounded-full mt-2",
                                        alert.level === 'High' ? "bg-rose-500" : "bg-amber-500"
                                    )} />
                                    <div>
                                        <p className="font-bold text-sm text-[var(--foreground)]">{alert.teacher}</p>
                                        <p className="text-xs text-[var(--foreground-muted)] font-medium">{alert.issue}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <div className="p-8 rounded-[2rem] border-2 border-dashed border-[var(--border)] flex flex-col items-center justify-center text-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-[var(--background-secondary)] flex items-center justify-center text-[var(--foreground-muted)]">
                            <Plus className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="font-bold text-[var(--foreground)]">New Faculty Node</p>
                            <p className="text-[10px] text-[var(--foreground-muted)] font-bold uppercase tracking-widest">Provision profile</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
