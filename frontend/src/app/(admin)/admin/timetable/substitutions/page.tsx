'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    UserMinus,
    UserPlus,
    ChevronLeft,
    Calendar,
    Search,
    Clock,
    CheckCircle2,
    AlertCircle,
    MoreHorizontal
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

const absences = [
    { id: '1', name: 'Dr. Sarah Wilson', reason: 'Medical Leave', session: '08:00 - 14:00', substitute: 'Assigned (John Doe)', status: 'Resolved' },
    { id: '2', name: 'Alice Smith', reason: 'Personal', session: '10:00 - 12:00', substitute: 'Pending', status: 'Action Required' },
]

const availableTeachers = [
    { name: 'Robert Brown', freePeriods: 'P3, P4', load: 'Low' },
    { name: 'Emma Davis', freePeriods: 'P1, P2', load: 'Medium' },
    { name: 'Kevin Lee', freePeriods: 'P5, P6', load: 'Low' },
]

export default function SubstitutionPage() {
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
                    <h1 className="text-3xl font-black tracking-tight text-[var(--foreground)]">Daily Substitution Manager</h1>
                    <p className="text-[var(--foreground-secondary)] mt-1 font-medium">Coordinate faculty absences and assign period-wise substitutes.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="h-12 bg-[var(--card-background)] rounded-2xl px-6 flex items-center gap-3 border border-[var(--border)] shadow-sm">
                        <Calendar className="w-4 h-4 text-indigo-600" />
                        <span className="text-sm font-bold text-[var(--foreground)]">02 Feb 2026 (Today)</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Active Absences */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-none bg-[var(--card-background)] rounded-[2.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-none overflow-hidden">
                        <CardHeader className="p-8 border-b border-[var(--border)] flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-xl font-black text-[var(--foreground)]">Absence Registry</CardTitle>
                                <CardDescription className="text-rose-600 font-bold text-[10px] uppercase tracking-widest mt-1">2 Faculty Members Offline</CardDescription>
                            </div>
                            <Button className="rounded-xl bg-slate-900 text-white font-bold h-10 px-6">
                                <UserMinus className="w-4 h-4 mr-2" />
                                Record Absence
                            </Button>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-[var(--border)]">
                                {absences.map((abs) => (
                                    <div key={abs.id} className="p-8 hover:bg-[var(--background-secondary)]/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center text-rose-600">
                                                <UserMinus className="w-7 h-7" />
                                            </div>
                                            <div>
                                                <p className="font-black text-[var(--foreground)] text-lg leading-tight">{abs.name}</p>
                                                <p className="text-xs font-bold text-[var(--foreground-muted)] uppercase tracking-tight">{abs.reason}</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2 text-[var(--foreground-secondary)]">
                                                <Clock className="w-3.5 h-3.5" />
                                                <span className="text-xs font-bold">{abs.session}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {abs.status === 'Resolved' ? (
                                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                                ) : (
                                                    <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                                                )}
                                                <span className={cn(
                                                    "text-xs font-black",
                                                    abs.status === 'Resolved' ? "text-emerald-600" : "text-rose-600"
                                                )}>{abs.substitute}</span>
                                            </div>
                                        </div>

                                        <Button variant="outline" className="rounded-xl border-[var(--border)] h-10 font-bold px-6">
                                            {abs.status === 'Resolved' ? 'Change Sub' : 'Assign Substitute'}
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none bg-[var(--card-background)] rounded-[2.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-none p-8">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600">
                                <UserPlus className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-black text-[var(--foreground)]">Substitution Smart-Match</h3>
                        </div>
                        <div className="space-y-4">
                            {availableTeachers.map((t, i) => (
                                <div key={i} className="flex items-center justify-between p-6 rounded-3xl bg-[var(--background-secondary)]/50 border border-[var(--border)] group hover:border-indigo-400 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-xs">
                                            {t.name[0]}
                                        </div>
                                        <div>
                                            <p className="font-bold text-[var(--foreground)]">{t.name}</p>
                                            <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{t.freePeriods} Available</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-right hidden md:block">
                                            <p className="text-[10px] font-black text-[var(--foreground-muted)] uppercase tracking-widest">Load Level</p>
                                            <p className="text-xs font-bold text-[var(--foreground)]">{t.load}</p>
                                        </div>
                                        <Button size="sm" className="rounded-lg h-8 bg-indigo-600 text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity">Draft Assign</Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Sidebar Alerts */}
                <div className="space-y-6">
                    <Card className="border-none bg-indigo-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
                        <div className="relative z-10">
                            <h4 className="text-xl font-black mb-1">Instant Notice</h4>
                            <p className="text-indigo-100 text-xs font-medium mb-6">Broadcast sub list to parents/students.</p>
                            <Button className="w-full h-12 bg-white text-indigo-700 hover:bg-slate-50 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all">
                                Send Alert (all)
                            </Button>
                        </div>
                        <AlertCircle className="absolute -bottom-10 -right-10 w-48 h-48 opacity-10 group-hover:opacity-20 transition-opacity rotate-12" />
                    </Card>

                    <Card className="border-none bg-[var(--card-background)] rounded-[2.5rem] shadow-xl shadow-slate-200/40 dark:shadow-none p-8">
                        <h4 className="text-lg font-black text-[var(--foreground)] mb-6">Conflict Stats</h4>
                        <div className="space-y-6">
                            {[
                                { label: 'Unfilled Slots', value: '3', color: 'rose' },
                                { label: 'Double Booked', value: '0', color: 'emerald' },
                                { label: 'Free Faculty', value: '8', color: 'indigo' },
                            ].map((stat, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            "w-2 h-2 rounded-full",
                                            stat.color === 'rose' ? "bg-rose-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" :
                                                stat.color === 'emerald' ? "bg-emerald-500" : "bg-indigo-500"
                                        )} />
                                        <span className="text-sm font-bold text-[var(--foreground-secondary)]">{stat.label}</span>
                                    </div>
                                    <span className="text-sm font-black text-[var(--foreground)]">{stat.value}</span>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <div className="p-8 rounded-[2rem] bg-[var(--background-secondary)]/30 border-2 border-dashed border-[var(--border)] text-center">
                        <p className="text-xs font-bold text-[var(--foreground-muted)] leading-relaxed">
                            Substitutions are automatically synced with the teacher mobile app once "Resolved".
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
