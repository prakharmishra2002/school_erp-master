'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
    IndianRupee,
    ArrowUpRight,
    ArrowDownRight,
    TrendingUp,
    Clock,
    Users,
    Search,
    Filter,
    ChevronRight,
    Plus,
    Download,
    CreditCard,
    MoreVertical,
    Wallet,
    Receipt,
    ShieldAlert,
    CheckCircle2,
    Calendar,
    BarChart3,
    Settings2,
    AlertTriangle,
    AlertCircle
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
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { getUpcomingFees, FeeRecord } from '@/app/(admin)/actions'

interface Transaction {
    id: string
    studentName: string
    admissionNo: string
    amount: number
    date: string
    method: 'UPI' | 'Cash' | 'Bank' | 'Card'
    status: 'success' | 'pending' | 'failed'
}

const recentTransactions: Transaction[] = [
    { id: 'TXN88921', studentName: 'Aarav Sharma', admissionNo: '20260001', amount: 12500, date: 'Today, 10:24 AM', method: 'UPI', status: 'success' },
    { id: 'TXN88922', studentName: 'Priya Patel', admissionNo: '20260002', amount: 3500, date: 'Today, 09:15 AM', method: 'Cash', status: 'success' },
    { id: 'TXN88923', studentName: 'Ishaan Gupta', admissionNo: '20260003', amount: 8000, date: 'Yesterday', method: 'Bank', status: 'success' },
    { id: 'TXN88924', studentName: 'Ananya Singh', admissionNo: '20260004', amount: 15000, date: 'Yesterday', method: 'Card', status: 'pending' },
    { id: 'TXN88925', studentName: 'Vivaan Shah', admissionNo: '20260005', amount: 4500, date: '2 days ago', method: 'UPI', status: 'success' },
    { id: 'TXN88926', studentName: 'Sanya Iyer', admissionNo: '20260105', amount: 12500, date: '2 days ago', method: 'Bank', status: 'failed' },
    { id: 'TXN88927', studentName: 'Rohan Mehta', admissionNo: '2026102', amount: 45000, date: '3 days ago', method: 'Cash', status: 'success' },
]

export default function FeeManagementPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isProcessing, setIsProcessing] = useState(false)

    useEffect(() => {
        const fetchFees = async () => {
            setIsLoading(true)
            const response = await getUpcomingFees()
            if (response.success) {
                // Adapt FeeRecord to Transaction
                const adapted: Transaction[] = response.data.map(fee => ({
                    id: `TXN${10000 + fee.id}`,
                    studentName: fee.studentName,
                    admissionNo: `2026${fee.id.toString().padStart(4, '0')}`,
                    amount: fee.amount,
                    date: fee.dueDate,
                    method: 'UPI',
                    status: fee.status === 'paid' ? 'success' : 'pending'
                }))
                setTransactions(adapted)
            }
            setIsLoading(false)
        }
        fetchFees()
    }, [])

    const handleCollectFee = (e: React.FormEvent) => {
        e.preventDefault()
        setIsProcessing(true)
        setTimeout(() => {
            setIsProcessing(true)
            toast.success('Fee collected successfully!', {
                description: 'Receipt #RCP20260045 has been generated.',
            })
            setIsProcessing(false)
        }, 1500)
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Link href="/admin/dashboard" className="text-sm font-medium text-[var(--foreground-secondary)] hover:text-indigo-600 transition-colors">Dashboard</Link>
                        <ChevronRight className="w-4 h-4 text-[var(--foreground-muted)]" />
                        <span className="text-sm font-bold text-indigo-600">Fee Management</span>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">Financial Ledger</h1>
                    <p className="text-[var(--foreground-secondary)] mt-1">Monitor revenue streams and manage student fee records.</p>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" className="rounded-2xl border-[var(--border)] h-12 px-5 font-bold bg-[var(--card-background)]">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                    </Button>
                    <Button className="gap-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 px-6 h-12 font-bold transform hover:scale-105 transition-all text-white border-none">
                        <Plus className="w-5 h-5" />
                        Collect Fee
                    </Button>
                </div>
            </div>

            {/* Financial Overview Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                    { label: 'Weekly Collection', value: '₹4,85,000', icon: IndianRupee, color: 'text-indigo-600', bg: 'bg-indigo-500/10' },
                    { label: 'Pending Dues', value: '₹12,40,000', icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-500/10' },
                    { label: 'Success Rate', value: '94.2%', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
                ].map((stat, i) => (
                    <div key={i} className="p-6 rounded-[2rem] bg-[var(--card-background)] border border-[var(--border)] flex items-center gap-5 shadow-sm hover:shadow-md transition-shadow">
                        <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-transform", stat.bg, stat.color)}>
                            <stat.icon className="w-7 h-7" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)] leading-none mb-1">{stat.label}</p>
                            <p className="text-2xl font-bold text-[var(--foreground)] leading-none">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Transaction Ledger */}
                <Card className="lg:col-span-2 border-none bg-[var(--card-background)] rounded-[2.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-none overflow-hidden">
                    <CardHeader className="p-8 border-b border-[var(--border)] flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-xl font-bold text-[var(--foreground)] tracking-tight">Recent Transactions</CardTitle>
                            <CardDescription className="font-medium text-[var(--foreground-secondary)]">Live feed of processed and pending payments.</CardDescription>
                        </div>
                        <Button variant="ghost" className="rounded-xl h-10 w-10 p-0 text-[var(--foreground-muted)]">
                            <BarChart3 className="w-5 h-5" />
                        </Button>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table className="w-full">
                                <TableHeader>
                                    <TableRow className="bg-[var(--background-secondary)]/50 hover:bg-[var(--background-secondary)]/50 border-b border-[var(--border)]">
                                        <TableHead className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--foreground-muted)]">Payer Information</TableHead>
                                        <TableHead className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--foreground-muted)]">Amount (₹)</TableHead>
                                        <TableHead className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--foreground-muted)]">Timestamp</TableHead>
                                        <TableHead className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--foreground-muted)] text-center">Status</TableHead>
                                        <TableHead className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--foreground-muted)] text-right">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoading ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="px-10 py-12 text-center text-[var(--foreground-muted)] font-bold italic">
                                                Loading transaction ledger...
                                            </TableCell>
                                        </TableRow>
                                    ) : transactions.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="px-10 py-20 text-center">
                                                <div className="flex flex-col items-center gap-3">
                                                    <div className="w-16 h-16 rounded-full bg-[var(--background-secondary)] flex items-center justify-center text-[var(--foreground-muted)]">
                                                        <IndianRupee className="w-8 h-8" />
                                                    </div>
                                                    <p className="font-bold text-[var(--foreground-secondary)]">No payments recorded today</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : transactions.map((txn) => (
                                        <TableRow key={txn.id} className="group hover:bg-[var(--background-secondary)] transition-colors border-b border-[var(--border)]">
                                            <TableCell className="px-10 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-[var(--background-secondary)] flex items-center justify-center text-[var(--foreground-muted)] font-black text-xs">
                                                        ID
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-[var(--foreground)] group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{txn.studentName}</p>
                                                        <p className="text-[10px] font-black text-[var(--foreground-muted)] uppercase tracking-widest">{txn.admissionNo}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-10 py-6 font-black text-[var(--foreground)] text-lg tracking-tighter">
                                                {txn.amount.toLocaleString('en-IN')}
                                            </TableCell>
                                            <TableCell className="px-10 py-6">
                                                <p className="text-sm font-bold text-[var(--foreground-secondary)]">{txn.date}</p>
                                                <p className="text-[10px] font-black text-[var(--foreground-muted)] uppercase tracking-tighter">{txn.method}</p>
                                            </TableCell>
                                            <TableCell className="px-10 py-6 text-center">
                                                <Badge className={cn(
                                                    "rounded-lg border-none font-black text-[9px] uppercase px-2 py-1 shadow-none",
                                                    txn.status === 'success' ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600' : 'bg-amber-50 dark:bg-amber-900/30 text-amber-600'
                                                )}>
                                                    <div className="flex items-center gap-1">
                                                        {txn.status === 'success' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                                        {txn.status}
                                                    </div>
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="px-10 py-6 text-right">
                                                <Button variant="ghost" size="icon" className="rounded-xl h-10 w-10 text-[var(--foreground-muted)] hover:text-indigo-600 hover:bg-[var(--card-background)]">
                                                    <MoreVertical className="w-5 h-5" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                        <div className="p-8 bg-[var(--background-secondary)]/50 flex items-center justify-center border-t border-[var(--border)]">
                            <Button variant="ghost" className="font-bold text-indigo-600 hover:bg-[var(--card-background)] h-12 rounded-2xl px-8 flex items-center gap-2">
                                View Full Collection History
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Right Sidebar: Quick Actions & Alerts */}
                <div className="space-y-8">
                    {/* Fee Setting Shortcut */}
                    <Card className="border-none bg-slate-900 shadow-2xl shadow-indigo-900/20 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
                        <div className="relative z-10 space-y-2">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-[1.2rem] bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                                    <IndianRupee className="w-5 h-5 text-indigo-400" />
                                </div>
                                <h4 className="text-lg font-bold">New: Fee Installments</h4>
                            </div>
                            <p className="text-indigo-100/60 text-sm max-w-lg font-medium">
                                Enable multi-part payments for students with high dues. System will automatically track upcoming installment dates.
                            </p>
                        </div>
                        <Button className="bg-white text-indigo-950 hover:bg-indigo-50 rounded-2xl font-black text-xs uppercase tracking-widest px-8 h-12 relative z-10 transition-transform hover:scale-105 active:scale-95 border-none">
                            Configure Plans
                        </Button>
                        <div className="absolute top-0 right-0 p-8 transform rotate-12 opacity-5">
                            <IndianRupee className="w-40 h-40" />
                        </div>
                    </Card>

                    {/* Defaulters Critical Alert */}
                    <Card className="border-none bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800/30 rounded-[2.5rem] p-8 shadow-xl shadow-rose-500/5 group hover:bg-[var(--card-background)] transition-all duration-500">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/30 group-hover:scale-110 transition-transform">
                                <ShieldAlert className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="text-lg font-black text-rose-950 dark:text-rose-200">Critical Arrears</h4>
                                <p className="text-xs font-bold text-rose-600/70 uppercase tracking-widest">Action Required</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-[var(--card-background)]/50 rounded-2xl border border-rose-100/50 dark:border-rose-800/30 group-hover:bg-rose-50 dark:group-hover:bg-rose-900/30 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-900/50 text-rose-600 flex items-center justify-center font-black text-xs">A</div>
                                    <div>
                                        <p className="text-xs font-bold text-[var(--foreground)] leading-none mb-1">Aarav M.</p>
                                        <p className="text-[9px] font-black uppercase text-[var(--foreground-muted)]">Class 10A</p>
                                    </div>
                                </div>
                                <p className="text-xs font-black text-rose-600 tracking-tight">₹42,000 Overdue</p>
                            </div>
                            <Button variant="ghost" className="w-full h-12 rounded-xl text-rose-600 font-bold hover:bg-rose-100/50 dark:hover:bg-rose-900/30 bg-[var(--card-background)]/30 border border-rose-100/50 dark:border-rose-800/30">
                                View 12 Persistent Defaulters
                            </Button>
                        </div>
                    </Card>

                    {/* Quick Payment Link Generation */}
                    <Card className="border-none bg-[var(--card-background)] rounded-[2.5rem] shadow-xl shadow-slate-200/40 dark:shadow-none p-8 relative overflow-hidden group">
                        <div className="space-y-4">
                            <h4 className="text-lg font-black text-[var(--foreground)] flex items-center gap-2">
                                <Plus className="w-5 h-5 text-indigo-500" />
                                Collect Direct Fee
                            </h4>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)] ml-1">Search Student by ID</label>
                                <div className="relative">
                                    <Input placeholder="Enrollment No..." className="h-12 rounded-xl bg-[var(--background-secondary)] border-[var(--border)] font-bold text-sm pl-10" />
                                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--foreground-muted)]" />
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}

// Missing icons helper
import { History, Info } from 'lucide-react'
