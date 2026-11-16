'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
    Search,
    Filter,
    Bell,
    ChevronRight,
    AlertTriangle,
    Mail,
    Phone,
    TrendingDown,
    IndianRupee,
    Clock,
    User,
    ShieldAlert,
    MessageSquare,
    MoreVertical,
    CheckCircle2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from 'sonner'

interface Defaulter {
    id: string
    studentName: string
    admissionNo: string
    class: string
    parentName: string
    parentPhone: string
    overdueAmount: number
    lastReminder: string
    priority: 'Critical' | 'High' | 'Medium'
    monthsPending: number
}

const mockDefaulters: Defaulter[] = [
    { id: '1', studentName: 'Rohan Mehta', admissionNo: '2026102', class: 'XII-SCI', parentName: 'Sanjay Mehta', parentPhone: '+91 98765 43210', overdueAmount: 45000, lastReminder: '2 days ago', priority: 'Critical', monthsPending: 3 },
    { id: '2', studentName: 'Sanya Iyer', admissionNo: '2026105', class: 'X-B', parentName: 'Karthik Iyer', parentPhone: '+91 98234 56789', overdueAmount: 12500, lastReminder: '5 days ago', priority: 'High', monthsPending: 1 },
    { id: '3', studentName: 'Aditya Rao', admissionNo: '2026108', class: 'VIII-A', parentName: 'Nitin Rao', parentPhone: '+91 91234 56780', overdueAmount: 8000, lastReminder: 'Never', priority: 'Medium', monthsPending: 1 },
    { id: '4', studentName: 'Karan Malhotra', admissionNo: '2026112', class: 'IX-C', parentName: 'Raj Malhotra', parentPhone: '+91 99887 76655', overdueAmount: 32000, lastReminder: 'Today', priority: 'High', monthsPending: 2 },
    { id: '5', studentName: 'Meera Deshmukh', admissionNo: '2026115', class: 'XI-COM', parentName: 'Anil Deshmukh', parentPhone: '+91 95544 33221', overdueAmount: 55000, lastReminder: '1 week ago', priority: 'Critical', monthsPending: 4 },
    { id: '6', studentName: 'Arjun Verma', admissionNo: '2026201', class: 'V-B', parentName: 'Vijay Verma', parentPhone: '+91 88776 65544', overdueAmount: 9500, lastReminder: '3 days ago', priority: 'Medium', monthsPending: 1 },
    { id: '7', studentName: 'Zara Khan', admissionNo: '2026205', class: 'VII-A', parentName: 'Aslam Khan', parentPhone: '+91 77665 54433', overdueAmount: 22000, lastReminder: '2 weeks ago', priority: 'High', monthsPending: 2 },
    { id: '8', studentName: 'Kabir Das', admissionNo: '2026210', class: 'III-C', parentName: 'Manoj Das', parentPhone: '+91 66554 43322', overdueAmount: 62000, lastReminder: '1 month ago', priority: 'Critical', monthsPending: 5 },
]

export default function DefaultersPage() {
    const [searchQuery, setSearchQuery] = useState('')

    const sendBulkReminders = () => {
        toast.info('Initiating bulk reminders...', {
            description: 'Sending SMS and Email alerts to 5 priority households.'
        })
        setTimeout(() => {
            toast.success('Reminders Dispatched', {
                description: 'Automated follow-up sequence started successfully.'
            })
        }, 2000)
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Link href="/admin/fees" className="text-sm font-medium text-[var(--foreground-secondary)] hover:text-indigo-600 transition-all">Financial Hub</Link>
                        <ChevronRight className="w-4 h-4 text-[var(--foreground-muted)]" />
                        <span className="text-sm font-bold text-indigo-600 uppercase tracking-widest">Recovery Center</span>
                    </div>
                    <h1 className="text-3xl font-black tracking-tight text-[var(--foreground)]">Defaulters List</h1>
                    <p className="text-[var(--foreground-secondary)] mt-1 font-medium">Track overdue payments and manage collection escalations.</p>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-12 border-[var(--border)] rounded-2xl px-6 font-bold text-[var(--foreground-secondary)] bg-[var(--card-background)] shadow-sm">
                        <TrendingDown className="w-4 h-4 mr-2" />
                        Aged Receivables
                    </Button>
                    <Button
                        onClick={sendBulkReminders}
                        className="h-12 bg-rose-600 hover:bg-rose-700 rounded-2xl px-8 font-bold text-white shadow-xl shadow-rose-600/20 transform hover:scale-105 transition-all"
                    >
                        <Bell className="w-4 h-4 mr-2" />
                        Send Bulk Reminders
                    </Button>
                </div>
            </div>

            {/* Recovery Insights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Total Outstanding', value: '₹4.2L', icon: IndianRupee, color: 'text-rose-600', bg: 'bg-rose-50 dark:bg-rose-900/30', sub: 'Critical Recovery' },
                    { label: 'High Priority', value: '18 Cases', icon: ShieldAlert, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/30', sub: '> 2 Months Pending' },
                    { label: 'Avg. Delay', value: '42 Days', icon: Clock, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-900/30', sub: 'Past Due Date' },
                ].map((stat, i) => (
                    <Card key={i} className="border-none bg-[var(--card-background)] rounded-[2rem] shadow-xl shadow-slate-200/40 dark:shadow-none p-6">
                        <div className="flex items-center gap-4">
                            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center", stat.bg, stat.color)}>
                                <stat.icon className="w-7 h-7" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)] mb-1">{stat.label}</p>
                                <h3 className="text-2xl font-black text-[var(--foreground)] tracking-tight">{stat.value}</h3>
                                <p className="text-[10px] font-bold text-[var(--foreground-muted)] mt-0.5">{stat.sub}</p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Priority Queue Table */}
            <Card className="border-none bg-[var(--card-background)] rounded-[2.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-none overflow-hidden">
                <div className="p-8 border-b border-[var(--border)] bg-[var(--background-secondary)]/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--foreground-muted)]" />
                        <Input
                            placeholder="Student name, admission ID or parent..."
                            className="h-12 pl-12 rounded-2xl border-[var(--border)] bg-[var(--card-background)] focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" className="rounded-2xl border-[var(--border)] font-bold h-12 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-rose-500" />
                            All Priority
                        </Button>
                        <Badge className="bg-rose-50 dark:bg-rose-900/30 text-rose-600 border-none px-4 py-2 rounded-xl font-bold">
                            Pending Total: ₹12.4L
                        </Badge>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-[var(--background-secondary)]/50 hover:bg-[var(--background-secondary)]/50 border-b border-[var(--border)]">
                                <TableHead className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)]">Student & Parent</TableHead>
                                <TableHead className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)] text-center">Overdue (₹)</TableHead>
                                <TableHead className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)] text-center">Duration</TableHead>
                                <TableHead className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)] text-center">Priority</TableHead>
                                <TableHead className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)] text-center">Last Contact</TableHead>
                                <TableHead className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)] text-right">Escalate</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockDefaulters.map((item) => (
                                <TableRow key={item.id} className="group hover:bg-[var(--background-secondary)]/50 transition-colors border-b border-[var(--border)]">
                                    <TableCell className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-[var(--background-secondary)] text-[var(--foreground-muted)] flex items-center justify-center border border-[var(--border)] group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 group-hover:text-indigo-600 transition-colors">
                                                <User className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-[var(--foreground)]">{item.studentName}</p>
                                                <p className="text-[10px] font-bold text-[var(--foreground-muted)]">{item.parentName} • {item.parentPhone}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-8 py-6 text-center">
                                        <p className="text-base font-black text-[var(--foreground)] tracking-tight">₹{item.overdueAmount.toLocaleString()}</p>
                                        <Badge variant="secondary" className="text-[8px] font-black text-[var(--foreground-muted)] p-0 uppercase bg-transparent shadow-none">Incl. Fine</Badge>
                                    </TableCell>
                                    <TableCell className="px-8 py-6 text-center">
                                        <div className="flex flex-col items-center">
                                            <span className="text-sm font-bold text-[var(--foreground-secondary)]">{item.monthsPending} Months</span>
                                            <div className="flex gap-0.5 mt-1">
                                                {[...Array(4)].map((_, i) => (
                                                    <div key={i} className={cn(
                                                        "w-3 h-1 rounded-full",
                                                        i < item.monthsPending ? "bg-rose-500" : "bg-[var(--background-tertiary)]"
                                                    )} />
                                                ))}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-8 py-6 text-center">
                                        <Badge className={cn(
                                            "rounded-xl border-none px-3 py-1 font-black text-[9px] uppercase tracking-widest shadow-sm",
                                            item.priority === 'Critical' ? "bg-rose-600 text-white" :
                                                item.priority === 'High' ? "bg-amber-500 text-white" : "bg-indigo-500 text-white"
                                        )}>
                                            {item.priority}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="px-8 py-6 text-center">
                                        <p className="text-sm font-bold text-[var(--foreground-secondary)]">{item.lastReminder}</p>
                                        <p className="text-[9px] font-bold text-[var(--foreground-muted)] uppercase tracking-tighter">via SMS/Push</p>
                                    </TableCell>
                                    <TableCell className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button variant="outline" className="h-10 w-10 p-0 rounded-xl border-[var(--border)] hover:bg-[var(--background-secondary)] transition-all text-indigo-600">
                                                <MessageSquare className="w-4 h-4" />
                                            </Button>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-10 w-10 p-0 rounded-xl hover:bg-[var(--background-secondary)] transition-all">
                                                        <MoreVertical className="w-5 h-5 text-[var(--foreground-muted)]" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl border-[var(--border)] shadow-2xl bg-[var(--card-background)]">
                                                    <DropdownMenuItem className="rounded-xl p-3 font-bold text-[var(--foreground-secondary)] hover:bg-[var(--background-secondary)] cursor-pointer flex items-center gap-3">
                                                        <ShieldAlert className="w-4 h-4 text-rose-500" /> Immediate Escalation
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="rounded-xl p-3 font-bold text-[var(--foreground-secondary)] hover:bg-[var(--background-secondary)] cursor-pointer flex items-center gap-3">
                                                        <Mail className="w-4 h-4 text-indigo-500" /> Send Warning Email
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="rounded-xl p-3 font-bold text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 cursor-pointer flex items-center gap-3">
                                                        <CheckCircle2 className="w-4 h-4" /> Mark as Promised
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </Card>

            {/* Quick Action Bottom Bar */}
            <div className="p-8 rounded-[2.5rem] bg-indigo-900 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-indigo-900/40 border border-white/10 relative overflow-hidden group">
                <div className="relative z-10 flex items-center gap-6">
                    <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md">
                        <ShieldAlert className="w-8 h-8 text-indigo-200" />
                    </div>
                    <div>
                        <h4 className="text-xl font-black">Escalation Policy Active</h4>
                        <p className="text-indigo-200/70 text-sm font-medium">Automatic system blocks apply after 90 days of non-payment.</p>
                    </div>
                </div>
                <div className="relative z-10 flex gap-3">
                    <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-2xl px-6 h-12 font-bold transition-all">
                        Update Policy
                    </Button>
                    <Button className="bg-white text-indigo-900 hover:bg-indigo-50 rounded-2xl px-8 h-12 font-black uppercase tracking-widest text-[11px] shadow-xl">
                        Download Notice templates
                    </Button>
                </div>
            </div>
        </div>
    )
}
