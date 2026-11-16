'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
    Clock,
    Plus,
    ChevronLeft,
    Save,
    Trash2,
    Settings2,
    Coffee,
    Moon
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface Period {
    id: string
    name: string
    start: string
    end: string
    type: 'Period' | 'Break' | 'Assembly'
}

const initialPeriods: Period[] = [
    { id: '1', name: 'Morning Assembly', start: '08:00', end: '08:15', type: 'Assembly' },
    { id: '2', name: 'Period 1', start: '08:15', end: '09:00', type: 'Period' },
    { id: '3', name: 'Period 2', start: '09:00', end: '09:45', type: 'Period' },
    { id: '4', name: 'Short Break', start: '09:45', end: '10:00', type: 'Break' },
    { id: '5', name: 'Period 3', start: '10:00', end: '10:45', type: 'Period' },
    { id: '6', name: 'Period 4', start: '10:45', end: '11:30', type: 'Period' },
    { id: '7', name: 'Lunch Break', start: '11:30', end: '12:15', type: 'Break' },
]

export default function PeriodsConfigPage() {
    const [periods, setPeriods] = useState<Period[]>(initialPeriods)
    const [isSaving, setIsSaving] = useState(false)

    const handleAddPeriod = () => {
        const newId = (periods.length + 1).toString()
        setPeriods([...periods, { id: newId, name: `New Period`, start: '12:15', end: '13:00', type: 'Period' }])
        toast.success('Sequence slot added')
    }

    const handleRemove = (id: string) => {
        setPeriods(periods.filter(p => p.id !== id))
        toast.error('Sequence slot removed')
    }

    const handleSave = () => {
        setIsSaving(true)
        setTimeout(() => {
            toast.success('Time sequence synchronized', {
                description: 'Global school timings have been updated.'
            })
            setIsSaving(false)
        }, 1200)
    }

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
                    <h1 className="text-3xl font-black tracking-tight text-[var(--foreground)]">Period Configuration</h1>
                    <p className="text-[var(--foreground-secondary)] mt-1 font-medium">Define school hours, period durations, and intervals.</p>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="h-12 bg-indigo-600 hover:bg-indigo-700 rounded-2xl px-8 font-bold text-white shadow-xl shadow-indigo-600/20 transform hover:scale-105 transition-all"
                    >
                        <Save className="w-5 h-5 mr-2" />
                        {isSaving ? 'Synchronizing...' : 'Save Sequence'}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Visual Timeline */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="border-none bg-[var(--card-background)] rounded-[2.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-none p-8">
                        <h3 className="text-xl font-black text-[var(--foreground)] mb-6 flex items-center gap-3">
                            <Clock className="w-6 h-6 text-indigo-600" />
                            Live Timeline
                        </h3>
                        <div className="relative pl-8 space-y-8 border-l-2 border-indigo-100 dark:border-indigo-900/50 ml-2">
                            {periods.map((p, i) => (
                                <div key={p.id} className="relative">
                                    <div className={cn(
                                        "absolute -left-[41px] top-0 w-4 h-4 rounded-full border-4 border-[var(--card-background)] shadow-sm",
                                        p.type === 'Period' ? "bg-indigo-600" : p.type === 'Break' ? "bg-emerald-500" : "bg-amber-500"
                                    )} />
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)]">{p.start} - {p.end}</p>
                                        <p className="font-bold text-[var(--foreground)] leading-none">{p.name}</p>
                                        <Badge className={cn(
                                            "text-[8px] font-black px-2 mt-1 border-none",
                                            p.type === 'Period' ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600" : p.type === 'Break' ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600" : "bg-amber-50 dark:bg-amber-900/30 text-amber-600"
                                        )}>
                                            {p.type.toUpperCase()}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card className="border-none bg-indigo-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
                        <h4 className="text-xl font-black mb-2 relative z-10">Smart Timing<br />Optimizer</h4>
                        <p className="text-indigo-100 text-xs font-medium mb-6 relative z-10">Automatically adjust all subsequent periods when a duration changes.</p>
                        <Button className="w-full h-12 bg-white/20 hover:bg-white/30 text-white border-white/20 rounded-xl font-bold relative z-10 backdrop-blur-md">
                            Activate Auto-Sync
                        </Button>
                        <Moon className="absolute -bottom-6 -right-6 w-32 h-32 opacity-10 rotate-12" />
                    </Card>
                </div>

                {/* Edit Section */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-none bg-[var(--card-background)] rounded-[2.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-none overflow-hidden">
                        <CardHeader className="p-8 border-b border-[var(--border)]">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-xl font-black text-[var(--foreground)]">Daily Sequence</CardTitle>
                                    <CardDescription className="text-[var(--foreground-secondary)] font-medium">Reorder or modify individual time slots.</CardDescription>
                                </div>
                                <Button onClick={handleAddPeriod} className="rounded-xl h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Slot
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-[var(--border)]">
                                {periods.map((p, i) => (
                                    <div key={p.id} className="flex items-center gap-6 p-6 hover:bg-[var(--background-secondary)]/30 transition-colors group">
                                        <div className="w-10 h-10 rounded-xl bg-[var(--background-secondary)] flex items-center justify-center font-black text-indigo-600 text-sm">
                                            {i + 1}
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-black uppercase text-[var(--foreground-muted)] tracking-widest ml-1">Label</label>
                                                <Input defaultValue={p.name} className="h-10 rounded-xl bg-[var(--background-secondary)] border-transparent focus:bg-[var(--card-background)] focus:border-indigo-500 font-bold" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-black uppercase text-[var(--foreground-muted)] tracking-widest ml-1">Start Time</label>
                                                <Input type="time" defaultValue={p.start} className="h-10 rounded-xl bg-[var(--background-secondary)] border-transparent focus:bg-[var(--card-background)] focus:border-indigo-500 font-bold" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-black uppercase text-[var(--foreground-muted)] tracking-widest ml-1">End Time</label>
                                                <Input type="time" defaultValue={p.end} className="h-10 rounded-xl bg-[var(--background-secondary)] border-transparent focus:bg-[var(--card-background)] focus:border-indigo-500 font-bold" />
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-[var(--foreground-muted)] hover:bg-rose-50 hover:text-rose-600 transition-colors" onClick={() => handleRemove(p.id)}>
                                                <Trash2 className="w-5 h-5" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="border-none bg-[var(--card-background)] rounded-[2.5rem] shadow-xl shadow-slate-200/40 dark:shadow-none p-8">
                            <h4 className="font-black text-[var(--foreground)] mb-6 flex items-center gap-2">
                                <Coffee className="w-5 h-5 text-emerald-600" />
                                Break Rule Logic
                            </h4>
                            <div className="space-y-4">
                                <div className="p-4 rounded-2xl bg-[var(--background-secondary)]/50 border border-[var(--border)]">
                                    <p className="text-xs font-black text-[var(--foreground-secondary)] uppercase tracking-tight mb-2">Auto-Bell Trigger</p>
                                    <p className="text-xs text-[var(--foreground-muted)] font-medium leading-relaxed">System will broadcast audio alerts 5 minutes before every break period.</p>
                                </div>
                                <Button variant="outline" className="w-full rounded-xl border-[var(--border)] font-bold text-xs">Configure Alerts</Button>
                            </div>
                        </Card>

                        <Card className="border-none bg-[var(--card-background)] rounded-[2.5rem] shadow-xl shadow-slate-200/40 dark:shadow-none p-8">
                            <h4 className="font-black text-[var(--foreground)] mb-6 flex items-center gap-2">
                                <Settings2 className="w-5 h-5 text-indigo-600" />
                                Global Offsets
                            </h4>
                            <div className="space-y-4">
                                <div className="p-4 rounded-2xl bg-[var(--background-secondary)]/50 border border-[var(--border)]">
                                    <p className="text-xs font-black text-[var(--foreground-secondary)] uppercase tracking-tight mb-2">Winter Time Delay</p>
                                    <p className="text-xs text-[var(--foreground-muted)] font-medium leading-relaxed">Shift all sequences by +30 minutes during designated winter months.</p>
                                </div>
                                <Button variant="outline" className="w-full rounded-xl border-[var(--border)] font-bold text-xs">Manage Sessions</Button>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
