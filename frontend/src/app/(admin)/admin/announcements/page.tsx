'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
    Bell,
    Plus,
    Search,
    Megaphone,
    Calendar,
    Trash2,
    Edit2,
    Eye,
    Globe,
    Users
} from 'lucide-react'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'
import { toast } from 'sonner'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

export default function AnnouncementsPage() {
    const [announcements, setAnnouncements] = useState([
        { id: 1, title: 'Annual Sports Meet 2026', type: 'Event', target: 'Global', date: 'Feb 15, 2026', status: 'Published' },
        { id: 2, title: 'Term 1 Result Declaration', type: 'Academic', target: 'Class 10-12', date: 'Feb 05, 2026', status: 'Scheduled' },
        { id: 3, title: 'Parent-Teacher Meeting', type: 'Academic', target: 'Primary Section', date: 'Feb 10, 2026', status: 'Draft' },
    ])

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <Breadcrumbs items={[{ label: 'Announcements' }]} />
                    <h1 className="text-3xl font-black tracking-tight text-[var(--foreground)]">Broadcast Center</h1>
                    <p className="text-[var(--foreground-secondary)] mt-1 font-medium">Manage school-wide notices, event alerts, and academic updates.</p>
                </div>

                <Button className="h-12 rounded-2xl px-6 bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 font-bold text-white">
                    <Plus className="w-5 h-5 mr-2" />
                    New Announcement
                </Button>
            </div>

            {/* Main Content */}
            <Card className="border-none bg-[var(--card-background)] rounded-[2.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-none overflow-hidden">
                <CardHeader className="p-8 border-b border-[var(--border)] flex flex-row items-center justify-between">
                    <div className="relative w-72">
                        <Input
                            placeholder="Filter broadcasts..."
                            className="h-10 rounded-xl pl-10 bg-[var(--background-secondary)] border-none font-bold text-sm"
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--foreground-muted)]" />
                    </div>
                </CardHeader>
                <div className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-[var(--background-secondary)]/50 hover:bg-[var(--background-secondary)]/50">
                                <TableHead className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)]">Broadcast Details</TableHead>
                                <TableHead className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)]">Scope</TableHead>
                                <TableHead className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)]">Post Date</TableHead>
                                <TableHead className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)] text-center">Status</TableHead>
                                <TableHead className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)] text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {announcements.map((item) => (
                                <TableRow key={item.id} className="group hover:bg-[var(--background-secondary)]/50 transition-colors">
                                    <TableCell className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 flex items-center justify-center">
                                                <Megaphone className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-[var(--foreground)]">{item.title}</p>
                                                <p className="text-xs font-bold text-[var(--foreground-muted)]">{item.type}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-8 py-5 text-sm font-bold text-[var(--foreground-secondary)] capitalize">
                                        <div className="flex items-center gap-2">
                                            {item.target === 'Global' ? <Globe className="w-4 h-4" /> : <Users className="w-4 h-4" />}
                                            {item.target}
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-8 py-5 text-sm font-bold text-[var(--foreground-secondary)]">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 opacity-40 ml-1" />
                                            {item.date}
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-8 py-5 text-center">
                                        <Badge className={
                                            item.status === 'Published' ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 border-none px-3" :
                                                item.status === 'Scheduled' ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 border-none px-3" :
                                                    "bg-[var(--background-secondary)] text-[var(--foreground-muted)] border-none px-3"
                                        }>
                                            {item.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="px-8 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button variant="ghost" className="h-8 w-8 p-0 rounded-lg hover:bg-[var(--background-secondary)]">
                                                <Edit2 className="w-4 h-4 text-[var(--foreground-muted)]" />
                                            </Button>
                                            <Button variant="ghost" className="h-8 w-8 p-0 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/30 hover:text-rose-600">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </Card>
        </div>
    )
}
