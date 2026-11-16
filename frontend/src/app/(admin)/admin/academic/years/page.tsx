'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
    Plus,
    Calendar,
    Edit,
    Trash2,
    CheckCircle2,
    AlertCircle,
    MoreVertical,
    History as HistoryIcon,
    Search,
    ChevronRight,
    Loader2,
    Filter,
    Zap,
    Users
} from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface AcademicYear {
    id: number
    name: string
    startDate: string
    endDate: string
    status: 'current' | 'upcoming' | 'past'
    studentCount: number
}

const initialYears: AcademicYear[] = [
    { id: 1, name: '2025-26', startDate: '2025-04-01', endDate: '2026-03-31', status: 'current', studentCount: 1280 },
    { id: 2, name: '2026-27', startDate: '2026-04-01', endDate: '2027-03-31', status: 'upcoming', studentCount: 0 },
    { id: 3, name: '2024-25', startDate: '2024-04-01', endDate: '2025-03-31', status: 'past', studentCount: 1150 },
]

export default function AcademicYearsPage() {
    const [years, setYears] = useState<AcademicYear[]>(initialYears)
    const [isAdding, setIsAdding] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleSetCurrent = (id: number) => {
        setIsLoading(true)
        setTimeout(() => {
            setYears(years.map(y => ({
                ...y,
                status: y.id === id ? 'current' : (y.status === 'current' ? 'past' : y.status)
            })))
            setIsLoading(false)
            toast.success('Current academic year updated successfully')
        }, 800)
    }

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this session? This action cannot be undone.')) {
            setYears(years.filter(y => y.id !== id))
            toast.success('Academic session deleted')
        }
    }

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Link href="/admin/dashboard" className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors">Dashboard</Link>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                        <span className="text-sm font-bold text-indigo-600">Academic Years</span>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">Academic Sessions</h1>
                    <p className="text-[var(--foreground-secondary)] mt-1">Manage school years, start dates, and primary status.</p>
                </div>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="gap-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 px-6 h-12 font-bold transition-all hover:scale-105 active:scale-95">
                            <Plus className="w-5 h-5" />
                            Create New Session
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px] rounded-[2rem] border-[var(--border)] overflow-hidden">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold">New Academic Session</DialogTitle>
                        </DialogHeader>
                        <div className="p-2 space-y-6 mt-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-600 px-1">Session Name</label>
                                <Input placeholder="e.g. 2027-28" className="h-12 rounded-2xl border-slate-200 focus:ring-indigo-500/20" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-600 px-1">Start Date</label>
                                    <Input type="date" className="h-12 rounded-2xl border-slate-200" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-600 px-1">End Date</label>
                                    <Input type="date" className="h-12 rounded-2xl border-slate-200" />
                                </div>
                            </div>
                            <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 flex gap-3">
                                <AlertCircle className="w-5 h-5 text-indigo-500 shrink-0" />
                                <p className="text-xs text-indigo-700 leading-relaxed font-medium">
                                    Creating a new session will not affect existing data. You can set it as "Current" once configuration is complete.
                                </p>
                            </div>
                        </div>
                        <DialogFooter className="p-2 gap-3 mt-4">
                            <Button variant="outline" className="rounded-2xl h-12 px-6 font-bold">Cancel</Button>
                            <Button className="rounded-2xl h-12 px-8 bg-indigo-600 hover:bg-indigo-700 font-bold shadow-lg shadow-indigo-600/20">Create Session</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 gap-8">
                {/* Years Table Card */}
                <Card className="border-[var(--border)] bg-[var(--card-background)] rounded-[2.5rem] overflow-hidden shadow-xl shadow-slate-200/50">
                    <CardHeader className="p-8 pb-4 flex flex-row items-center justify-between border-b border-slate-100">
                        <div>
                            <CardTitle className="text-xl font-bold flex items-center gap-2">
                                <HistoryIcon className="w-6 h-6 text-indigo-500" />
                                Session Directory
                            </CardTitle>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="relative hidden sm:block">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input placeholder="Search sessions..." className="pl-10 h-10 w-64 rounded-xl border-slate-200 bg-slate-50 focus:bg-white transition-all shadow-sm" />
                            </div>
                            <Button variant="outline" size="icon" className="rounded-xl border-slate-200 h-10 w-10">
                                <Filter className="w-4 h-4" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/80 border-b border-slate-100">
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Session Name</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Duration</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Status</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Students</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {years.map((year) => (
                                        <tr key={year.id} className="group hover:bg-slate-50/50 border-b border-slate-100 transition-all duration-300">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className={cn(
                                                        "w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm shadow-sm transition-transform group-hover:scale-110",
                                                        year.status === 'current' ? "bg-indigo-100 text-indigo-600 shadow-indigo-100" :
                                                            year.status === 'upcoming' ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-600"
                                                    )}>
                                                        {year.name.split('-')[1]}
                                                    </div>
                                                    <div>
                                                        <p className="text-base font-bold text-slate-800">{year.name}</p>
                                                        <p className="text-xs font-semibold text-slate-500">Created: Jan 15, 2026</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 rounded-xl bg-slate-100 text-slate-500">
                                                        <Calendar className="w-4 h-4" />
                                                    </div>
                                                    <div className="text-sm font-bold text-slate-700">
                                                        {new Date(year.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                                                        <span className="mx-2 text-slate-300">→</span>
                                                        {new Date(year.endDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                {year.status === 'current' ? (
                                                    <div className="flex items-center gap-2 px-4 py-1.5 bg-indigo-500 text-white rounded-full w-fit shadow-lg shadow-indigo-500/20">
                                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                                        <span className="text-[10px] font-black uppercase tracking-widest">Active Session</span>
                                                    </div>
                                                ) : year.status === 'upcoming' ? (
                                                    <div className="flex items-center gap-2 px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full w-fit border border-emerald-100 font-bold">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                        <span className="text-[10px] font-black uppercase tracking-widest leading-none">Preparing</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2 px-4 py-1.5 bg-slate-100 text-slate-500 rounded-full w-fit font-bold">
                                                        <span className="text-[10px] font-black uppercase tracking-widest leading-none">Archived</span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="inline-flex items-center gap-2 text-sm font-bold text-slate-700">
                                                    <Users className="w-4 h-4 text-slate-400" />
                                                    {year.studentCount.toLocaleString()}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {year.status !== 'current' && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleSetCurrent(year.id)}
                                                            disabled={isLoading}
                                                            className="rounded-xl font-bold text-xs h-9 px-4 border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                                                        >
                                                            {isLoading ? <Loader2 className="w-3 h-3 animate-spin mr-2" /> : <CheckCircle2 className="w-3 h-3 mr-2" />}
                                                            Set Current
                                                        </Button>
                                                    )}
                                                    <Button variant="ghost" size="icon" className="rounded-xl h-9 w-9 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50">
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleDelete(year.id)}
                                                        className="rounded-xl h-9 w-9 text-slate-400 hover:text-red-600 hover:bg-red-50"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                                <Button variant="ghost" size="icon" className="rounded-xl h-9 w-9 text-slate-400 group-hover:hidden">
                                                    <MoreVertical className="w-4 h-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* Bottom Helper Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 rounded-[2rem] bg-indigo-600 text-white shadow-xl shadow-indigo-600/20 flex flex-col justify-between group overflow-hidden relative">
                        <div className="relative z-10">
                            <h3 className="text-base font-bold mb-2">Primary Session</h3>
                            <p className="text-xs text-indigo-100/80 leading-relaxed font-medium">
                                The current session ({years.find(y => y.status === 'current')?.name}) is used as the default filter across all dashboards and reports.
                            </p>
                        </div>
                        <div className="mt-6 flex items-center justify-between relative z-10">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">Live Environment</span>
                            <div className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" />
                        </div>
                        {/* Blob decoration */}
                        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                    </div>

                    <div className="p-6 rounded-[2rem] border-2 border-dashed border-slate-200 hover:border-indigo-300 transition-colors flex items-center gap-4 group cursor-pointer">
                        <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-all">
                            <HistoryIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-800">Archive Previous</p>
                            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mt-0.5">Automated Cleanup</p>
                        </div>
                    </div>

                    <div className="p-6 rounded-[2rem] border-2 border-dashed border-slate-200 hover:border-emerald-300 transition-colors flex items-center gap-4 group cursor-pointer">
                        <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-all">
                            <Zap className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-800">Bulk Rollover</p>
                            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mt-0.5">Promote Students</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Simple Link wrapper for the breadcrumb
function BreadcrumbLink({ href, children }: { href: string, children: React.ReactNode }) {
    return (
        <Link href={href} className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors">
            {children}
        </Link>
    )
}
