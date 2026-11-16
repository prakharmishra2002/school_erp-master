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
    Download,
    ChevronRight,
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    Receipt,
    CreditCard,
    Wallet,
    IndianRupee,
    CheckCircle2,
    Clock,
    XCircle,
    MoreVertical,
    History
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

interface Transaction {
    id: string
    date: string
    studentName: string
    admissionNo: string
    class: string
    type: string
    amount: number
    method: 'UPI' | 'Cash' | 'Bank' | 'Card'
    status: 'Success' | 'Pending' | 'Failed'
    collectedBy: string
}

const mockTransactions: Transaction[] = [
    { id: 'RCP-2026-001', date: '2026-02-01 10:24 AM', studentName: 'Aarav Sharma', admissionNo: '2026001', class: 'X-A', type: 'Tuition Fee', amount: 12500, method: 'UPI', status: 'Success', collectedBy: 'Rajesh K.' },
    { id: 'RCP-2026-002', date: '2026-02-01 11:15 AM', studentName: 'Priya Patel', admissionNo: '2026002', class: 'X-A', type: 'Transport Fee', amount: 3500, method: 'Cash', status: 'Success', collectedBy: 'Rajesh K.' },
    { id: 'RCP-2026-003', date: '2026-02-01 12:30 PM', studentName: 'Ishaan Gupta', admissionNo: '2026003', class: 'IX-B', type: 'Exam Fee', amount: 2000, method: 'Bank', status: 'Pending', collectedBy: 'Admin' },
    { id: 'RCP-2026-004', date: '2026-01-31 02:45 PM', studentName: 'Ananya Singh', admissionNo: '2026004', class: 'XI-SCI', type: 'Admission Fee', amount: 25000, method: 'UPI', status: 'Success', collectedBy: 'Suresh V.' },
    { id: 'RCP-2026-005', date: '2026-01-31 04:10 PM', studentName: 'Vivaan Shah', admissionNo: '2026005', class: 'VIII-C', type: 'Tuition Fee', amount: 4500, method: 'Card', status: 'Failed', collectedBy: 'Rajesh K.' },
    { id: 'RCP-2026-006', date: '2026-01-30 09:00 AM', studentName: 'Karan Malhotra', admissionNo: '2026112', class: 'IX-C', type: 'Tuition Fee', amount: 8000, method: 'UPI', status: 'Success', collectedBy: 'Rajesh K.' },
    { id: 'RCP-2026-007', date: '2026-01-30 11:30 AM', studentName: 'Meera Deshmukh', admissionNo: '2026115', class: 'XI-COM', type: 'Sports Fee', amount: 1500, method: 'Cash', status: 'Success', collectedBy: 'Admin' },
    { id: 'RCP-2026-008', date: '2026-01-29 03:20 PM', studentName: 'Sanya Iyer', admissionNo: '2026105', class: 'X-B', type: 'Transport Fee', amount: 3500, method: 'Bank', status: 'Success', collectedBy: 'Suresh V.' },
]

export default function CollectionLogsPage() {
    const [searchQuery, setSearchQuery] = useState('')

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Link href="/admin/fees" className="text-sm font-medium text-[var(--foreground-secondary)] hover:text-indigo-600 transition-all">Financial Hub</Link>
                        <ChevronRight className="w-4 h-4 text-[var(--foreground-muted)]" />
                        <span className="text-sm font-bold text-indigo-600 uppercase tracking-widest">Audit Logs</span>
                    </div>
                    <h1 className="text-3xl font-black tracking-tight text-[var(--foreground)]">Transaction Ledger</h1>
                    <p className="text-[var(--foreground-secondary)] mt-1 font-medium">Detailed audit trail of all revenue inflows and collection history.</p>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-12 border-[var(--border)] rounded-2xl px-6 font-bold text-[var(--foreground-secondary)] bg-[var(--card-background)] shadow-sm hover:bg-[var(--background-secondary)] transition-all">
                        <Download className="w-4 h-4 mr-2" />
                        Export Ledger
                    </Button>
                    <Button className="h-12 bg-indigo-600 hover:bg-indigo-700 rounded-2xl px-8 font-bold text-white shadow-xl shadow-indigo-600/20 transform hover:scale-105 transition-all">
                        <Calendar className="w-4 h-4 mr-2" />
                        Filter Date Range
                    </Button>
                </div>
            </div>

            {/* Collection Insights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Today Total', value: '₹18,000', icon: IndianRupee, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-900/30', sub: 'from 3 entries' },
                    { label: 'Digital (UPI/Bank)', value: '₹14,500', icon: CreditCard, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/30', sub: '80.5% of total' },
                    { label: 'Cash Collection', value: '₹3,500', icon: Wallet, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/30', sub: 'Counter Entry' },
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

            {/* Main Ledger Table */}
            <Card className="border-none bg-[var(--card-background)] rounded-[2.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-none overflow-hidden">
                <div className="p-8 border-b border-[var(--border)] bg-[var(--background-secondary)]/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--foreground-muted)]" />
                        <Input
                            placeholder="Search by receipt #, student or class..."
                            className="h-12 pl-12 rounded-2xl border-[var(--border)] bg-[var(--card-background)] focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" className="rounded-2xl border-[var(--border)] font-bold h-12 flex items-center gap-2">
                            <Filter className="w-4 h-4" />
                            Advance Filter
                        </Button>
                        <Badge className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 border-none px-4 py-2 rounded-xl font-bold">
                            Total: 1,240 Receipts
                        </Badge>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-[var(--background-secondary)]/50 hover:bg-[var(--background-secondary)]/50 border-b border-[var(--border)]">
                                <TableHead className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)]">Receipt Details</TableHead>
                                <TableHead className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)]">Student Info</TableHead>
                                <TableHead className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)] text-center">Amount</TableHead>
                                <TableHead className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)] text-center">Method</TableHead>
                                <TableHead className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)] text-center">Status</TableHead>
                                <TableHead className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)] text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockTransactions.map((txn) => (
                                <TableRow key={txn.id} className="group hover:bg-[var(--background-secondary)]/50 transition-colors border-b border-[var(--border)]">
                                    <TableCell className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 flex items-center justify-center">
                                                <Receipt className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-[var(--foreground)]">{txn.id}</p>
                                                <p className="text-[10px] font-bold text-[var(--foreground-muted)] uppercase tracking-tight">{txn.date}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-8 py-6">
                                        <div>
                                            <p className="font-bold text-[var(--foreground)]">{txn.studentName}</p>
                                            <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">
                                                {txn.class} • {txn.admissionNo}
                                            </p>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-8 py-6 text-center">
                                        <p className="text-base font-black text-[var(--foreground)] tracking-tight">₹{txn.amount.toLocaleString()}</p>
                                        <p className="text-[10px] font-bold text-[var(--foreground-muted)] uppercase mt-0.5">{txn.type}</p>
                                    </TableCell>
                                    <TableCell className="px-8 py-6 text-center">
                                        <Badge variant="outline" className="rounded-lg border-[var(--border)] text-[var(--foreground-secondary)] font-bold text-[9px] uppercase px-2 py-0.5">
                                            {txn.method}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="px-8 py-6 text-center">
                                        <Badge className={cn(
                                            "rounded-xl border-none px-3 py-1 font-black text-[9px] uppercase tracking-widest",
                                            txn.status === 'Success' ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600" :
                                                txn.status === 'Pending' ? "bg-amber-50 dark:bg-amber-900/30 text-amber-600" : "bg-rose-50 dark:bg-rose-900/30 text-rose-600"
                                        )}>
                                            {txn.status === 'Success' ? <CheckCircle2 className="w-3 h-3 mr-1 inline" /> :
                                                txn.status === 'Pending' ? <Clock className="w-3 h-3 mr-1 inline" /> : <XCircle className="w-3 h-3 mr-1 inline" />}
                                            {txn.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="px-8 py-6 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-10 w-10 p-0 rounded-xl hover:bg-[var(--card-background)] hover:shadow-md transition-all">
                                                    <MoreVertical className="w-5 h-5 text-[var(--foreground-muted)]" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl border-[var(--border)] shadow-2xl bg-[var(--card-background)]">
                                                <DropdownMenuItem className="rounded-xl p-3 font-bold text-[var(--foreground-secondary)] hover:bg-[var(--background-secondary)] cursor-pointer flex items-center gap-3">
                                                    <Receipt className="w-4 h-4 text-indigo-500" /> View Digital Receipt
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="rounded-xl p-3 font-bold text-[var(--foreground-secondary)] hover:bg-[var(--background-secondary)] cursor-pointer flex items-center gap-3">
                                                    <History className="w-4 h-4 text-emerald-500" /> Student Ledger
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="rounded-xl p-3 font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 cursor-pointer flex items-center gap-3">
                                                    <XCircle className="w-4 h-4" /> Void Transaction
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <div className="p-8 border-t border-[var(--border)] bg-[var(--background-secondary)]/20 flex items-center justify-between">
                    <p className="text-sm text-[var(--foreground-secondary)] font-medium">Showing 5 of 1,240 transactions</p>
                    <div className="flex gap-2">
                        <Button variant="outline" className="rounded-xl font-bold border-[var(--border)]">Previous</Button>
                        <Button variant="outline" className="rounded-xl font-bold border-[var(--border)]">Next</Button>
                    </div>
                </div>
            </Card>

            {/* Reconciliation Note */}
            <div className="p-8 rounded-[2.5rem] bg-indigo-600 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-indigo-600/20 relative overflow-hidden group">
                <div className="relative z-10 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md">
                        <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="text-lg font-black">Daily Reconciliation Completed</h4>
                        <p className="text-indigo-100/70 text-sm font-medium">Last automated bank sync: Today, 06:00 PM</p>
                    </div>
                </div>
                <Button className="relative z-10 bg-white text-indigo-600 hover:bg-indigo-50 px-8 h-12 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg">
                    Re-Sync Cloud Ledger
                </Button>
                {/* Decorative blob */}
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000" />
            </div>
        </div>
    )
}
