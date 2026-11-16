'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    DoorOpen,
    Plus,
    ChevronLeft,
    Building,
    Search,
    Users,
    AlertCircle,
    CheckCircle2,
    Monitor
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'

interface Room {
    id: string
    name: string
    type: 'Classroom' | 'Laboratory' | 'Sports' | 'Seminar'
    capacity: number
    status: 'Available' | 'Assigned' | 'Maintenance'
    currentAssignment?: string
}

const initialRooms: Room[] = [
    { id: '1', name: 'Room 101', type: 'Classroom', capacity: 40, status: 'Assigned', currentAssignment: 'Class 10A - Physics' },
    { id: '2', name: 'Room 102', type: 'Classroom', capacity: 40, status: 'Available' },
    { id: '3', name: 'Physics Lab', type: 'Laboratory', capacity: 30, status: 'Assigned', currentAssignment: 'Class 12 - Practical' },
    { id: '4', name: 'Computer Lab 1', type: 'Laboratory', capacity: 35, status: 'Assigned', currentAssignment: 'Class 9B - IT' },
    { id: '5', name: 'Seminar Hall', type: 'Seminar', capacity: 150, status: 'Available' },
    { id: '6', name: 'Chemistry Lab', type: 'Laboratory', capacity: 30, status: 'Maintenance' },
]

export default function RoomAllocationPage() {
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
                    <h1 className="text-3xl font-black tracking-tight text-[var(--foreground)]">Room Allocation Manager</h1>
                    <p className="text-[var(--foreground-secondary)] mt-1 font-medium">Map physical spaces to schedule cycles and prevent double-booking.</p>
                </div>

                <div className="flex items-center gap-3">
                    <Button className="h-12 bg-indigo-600 hover:bg-indigo-700 rounded-2xl px-8 font-bold text-white shadow-xl shadow-indigo-600/20 transform hover:scale-105 transition-all">
                        <Plus className="w-5 h-5 mr-2" />
                        Provision New Space
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Filters Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="border-none bg-[var(--card-background)] rounded-[2.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-none p-8">
                        <h4 className="font-black text-[var(--foreground)] mb-6">Filter Nodes</h4>
                        <div className="space-y-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--foreground-muted)]" />
                                <Input
                                    placeholder="Filter by name..."
                                    className="h-11 pl-10 rounded-xl bg-[var(--background-secondary)] border-transparent font-medium"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2 pt-4">
                                {['All Spaces', 'Classrooms', 'Laboratories', 'Seminar Halls'].map((f, i) => (
                                    <div key={i} className={cn(
                                        "px-4 py-3 rounded-xl font-bold text-[13px] cursor-pointer transition-all",
                                        i === 0 ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none" : "text-[var(--foreground-secondary)] hover:bg-[var(--background-secondary)]"
                                    )}>
                                        {f}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>

                    <Card className="border-none bg-emerald-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
                        <div className="relative z-10">
                            <CheckCircle2 className="w-10 h-10 mb-6 text-emerald-200" />
                            <h4 className="text-xl font-black mb-1">Conflict Check</h4>
                            <p className="text-emerald-100 text-xs font-medium mb-6">Zero room collisions found for current period (P2).</p>
                            <Button className="w-full h-12 bg-white text-emerald-700 hover:bg-slate-50 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all">
                                Validate Full Week
                            </Button>
                        </div>
                        <Building className="absolute -bottom-10 -right-10 w-48 h-48 opacity-10 group-hover:opacity-20 transition-opacity rotate-12" />
                    </Card>
                </div>

                {/* Rooms Grid */}
                <div className="lg:col-span-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {initialRooms.filter(r => r.name.toLowerCase().includes(search.toLowerCase())).map((room) => (
                            <Card key={room.id} className="border-none bg-[var(--card-background)] rounded-[2.5rem] shadow-xl shadow-slate-200/40 dark:shadow-none p-8 hover:shadow-2xl transition-all group overflow-hidden relative">
                                <div className="flex items-start justify-between relative z-10">
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            "w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg",
                                            room.type === 'Classroom' ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/40" :
                                                room.type === 'Laboratory' ? "bg-amber-50 text-amber-600 dark:bg-amber-900/40" :
                                                    "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/40"
                                        )}>
                                            {room.type === 'Laboratory' ? <Monitor className="w-6 h-6" /> : <DoorOpen className="w-6 h-6" />}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-[var(--foreground)]">{room.name}</h3>
                                            <Badge variant="outline" className="text-[9px] font-black border-[var(--border)] text-[var(--foreground-muted)] uppercase tracking-widest mt-1">
                                                {room.type}
                                            </Badge>
                                        </div>
                                    </div>
                                    <Badge className={cn(
                                        "rounded-lg border-none px-3 py-1 font-bold text-[10px]",
                                        room.status === 'Available' ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30" :
                                            room.status === 'Maintenance' ? "bg-rose-50 text-rose-600 dark:bg-rose-900/30" :
                                                "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30"
                                    )}>
                                        {room.status}
                                    </Badge>
                                </div>

                                <div className="mt-8 space-y-4 relative z-10">
                                    <div className="flex items-center justify-between text-[var(--foreground-secondary)]">
                                        <div className="flex items-center gap-2">
                                            <Users className="w-4 h-4" />
                                            <span className="text-sm font-bold">Cap: {room.capacity} students</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                            <span className="text-[10px] font-black uppercase">AC ENABLED</span>
                                        </div>
                                    </div>

                                    {room.currentAssignment ? (
                                        <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800">
                                            <p className="text-[9px] font-black text-indigo-600 uppercase tracking-widest mb-1">Current Anchor</p>
                                            <p className="text-xs font-bold text-[var(--foreground)]">{room.currentAssignment}</p>
                                        </div>
                                    ) : (
                                        <div className="p-4 rounded-2xl bg-[var(--background-secondary)]/50 border border-dashed border-[var(--border)] flex items-center justify-center">
                                            <p className="text-[10px] font-bold text-[var(--foreground-muted)] uppercase italic">No assignments for P2</p>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-8 flex gap-3 relative z-10 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
                                    <Button variant="outline" className="h-10 rounded-xl flex-1 border-[var(--border)] font-bold text-xs">Settings</Button>
                                    <Button className="h-10 rounded-xl flex-1 bg-slate-900 text-white font-bold text-xs uppercase tracking-tight">Modify Path</Button>
                                </div>

                                {/* Background decoration */}
                                <Building className="absolute -bottom-6 -right-6 w-32 h-32 opacity-0 group-hover:opacity-[0.03] transition-opacity rotate-12" />
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
