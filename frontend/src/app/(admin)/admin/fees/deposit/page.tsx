'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
    IndianRupee,
    Search,
    ChevronRight,
    ArrowLeft,
    User,
    Users,
    CreditCard,
    Wallet,
    Receipt,
    CheckCircle2,
    Calendar,
    Printer,
    Send,
    History,
    AlertCircle,
    Building2,
    Clock,
    Plus
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

interface FeeHead {
    id: string
    name: string
    due: number
    paid: number
    balance: number
}

const quickSearchStudents = [
    { name: 'Aarav Sharma', id: '20260001', class: 'X-A', balance: '12,500' },
    { name: 'Priya Patel', id: '20260002', class: 'X-A', balance: '3,500' },
    { name: 'Ishaan Gupta', id: '20260003', class: 'IX-B', balance: '8,000' },
    { name: 'Ananya Singh', id: '20260004', class: 'XI-SCI', balance: '15,000' },
]

const recentGlobalActivity = [
    { student: 'Vivaan Shah', amount: 4500, time: '10 mins ago', method: 'UPI' },
    { student: 'Sanya Iyer', amount: 3500, time: '45 mins ago', method: 'Cash' },
    { student: 'Rohan Mehta', amount: 12000, time: '2 hours ago', method: 'Bank' },
]

const mockFeeHeads: FeeHead[] = [
    { id: '1', name: 'Tuition Fee (Q3)', due: 15000, paid: 5000, balance: 10000 },
    { id: '2', name: 'Transport Fee (Jan)', due: 2500, paid: 0, balance: 2500 },
    { id: '3', name: 'Lab Charges', due: 1200, paid: 1200, balance: 0 },
    { id: '4', name: 'Exam Fee (Annual)', due: 3000, paid: 0, balance: 3000 },
    { id: '5', name: 'Sports & Cultural', due: 1500, paid: 500, balance: 1000 },
    { id: '6', name: 'Library Membership', due: 500, paid: 500, balance: 0 },
    { id: '7', name: 'Alumni Contribution', due: 2000, paid: 0, balance: 2000 },
]

export default function FeeDepositConsole() {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedStudent, setSelectedStudent] = useState<any>(null)
    const [paymentMethod, setPaymentMethod] = useState('UPI')
    const [isProcessing, setIsProcessing] = useState(false)
    const [depositAmounts, setDepositAmounts] = useState<Record<string, string>>({})

    const handleSearch = () => {
        // Mock search result
        if (searchQuery.length > 3) {
            setSelectedStudent({
                name: 'Aarav Sharma',
                admissionNo: '20260001',
                class: 'X-A',
                parent: 'Sanjay Sharma',
                photo: 'AS',
                totalBalance: 15500
            })
            toast.success('Student Profile Loaded', {
                description: 'Aarav Sharma (20260001) - Outstanding: ₹15,500'
            })
        }
    }

    const handleApplyUniformly = (amount: number) => {
        const newAmounts: Record<string, string> = {}
        let remaining = amount
        mockFeeHeads.forEach(head => {
            if (remaining <= 0) return
            const toPay = Math.min(head.balance, remaining)
            newAmounts[head.id] = toPay.toString()
            remaining -= toPay
        })
        setDepositAmounts(newAmounts)
    }

    const setFormData = (id: string, val: string) => {
        setDepositAmounts(prev => ({ ...prev, [id]: val }))
    }

    const executeDeposit = () => {
        setIsProcessing(true)
        toast.info('Processing payment encryption...', {
            description: 'Validating amounts and cloud ledger synchronization.'
        })

        setTimeout(() => {
            setIsProcessing(false)
            toast.success('Deposit Successful', {
                description: 'Receipt #RCP2026889 has been emailed to the guardian.'
            })
            // Reset flow
            setSelectedStudent(null)
            setDepositAmounts({})
            setSearchQuery('')
        }, 2000)
    }

    const totalToDeposit = Object.values(depositAmounts).reduce((acc, val) => acc + (parseFloat(val) || 0), 0)

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-20">
            {/* Header / Breadcrumb */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Link href="/admin/fees" className="text-sm font-medium text-[var(--foreground-secondary)] hover:text-indigo-600 transition-colors">Fees Hub</Link>
                        <ChevronRight className="w-4 h-4 text-[var(--foreground-muted)]" />
                        <span className="text-sm font-bold text-indigo-600 uppercase tracking-widest">Deposit Console</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/admin/fees">
                            <Button variant="ghost" className="rounded-xl h-10 w-10 p-0 hover:bg-[var(--background-secondary)] text-[var(--foreground-muted)]">
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                        </Link>
                        <h1 className="text-3xl font-black tracking-tight text-[var(--foreground)]">Fee Deposit Console</h1>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Link href="/admin/fees/add">
                        <Button variant="outline" className="h-12 border-[var(--border)] rounded-2xl px-6 font-bold text-[var(--foreground-secondary)] bg-[var(--card-background)] shadow-sm hover:bg-[var(--background-secondary)] transition-all">
                            <Plus className="w-4 h-4 mr-2" />
                            Assign New Due
                        </Button>
                    </Link>
                    {!selectedStudent && (
                        <div className="flex items-center gap-3 bg-[var(--card-background)] p-2 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-[var(--border)] min-w-[350px]">
                            <Search className="w-5 h-5 ml-3 text-[var(--foreground-muted)]" />
                            <Input
                                placeholder="Enter Admission No. or Name..."
                                className="border-none bg-transparent focus-visible:ring-0 font-bold h-10"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            />
                            <Button onClick={handleSearch} className="bg-indigo-600 hover:bg-indigo-700 rounded-xl font-bold px-4 h-10">
                                Search Student
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {selectedStudent ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Student Profile & Balance Card */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card className="border-none bg-[var(--card-background)] rounded-[2.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-none p-8">
                            <div className="flex flex-col items-center text-center space-y-4">
                                <div className="w-24 h-24 rounded-[2rem] bg-indigo-600 flex items-center justify-center text-3xl font-black text-white shadow-xl shadow-indigo-600/30">
                                    {selectedStudent.photo}
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-2xl font-black text-[var(--foreground)] tracking-tight">{selectedStudent.name}</h3>
                                    <p className="text-sm font-bold text-[var(--foreground-muted)] uppercase tracking-widest">{selectedStudent.class} • {selectedStudent.admissionNo}</p>
                                </div>
                                <div className="flex flex-wrap justify-center gap-2">
                                    <Badge className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 border-none font-bold px-3 py-1 rounded-xl">Regular Payer</Badge>
                                    <Badge className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 border-none font-bold px-3 py-1 rounded-xl">Section A</Badge>
                                </div>
                            </div>

                            <div className="mt-8 p-6 bg-rose-50 dark:bg-rose-900/20 rounded-[2rem] border border-rose-100 dark:border-rose-800/30 overflow-hidden relative group">
                                <p className="text-[10px] font-black uppercase tracking-widest text-rose-600 mb-1 relative z-10 text-center">Total Outstanding Balance</p>
                                <h4 className="text-4xl font-black text-rose-600 tracking-tighter relative z-10 text-center">₹{selectedStudent.totalBalance.toLocaleString()}</h4>
                                <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12 group-hover:scale-125 transition-transform duration-700">
                                    <AlertCircle className="w-24 h-24" />
                                </div>
                            </div>

                            <div className="mt-8 space-y-4">
                                <div className="flex justify-between items-center text-xs font-bold text-[var(--foreground-secondary)] uppercase tracking-widest">
                                    <span>Guardian Contact</span>
                                    <span className="text-[var(--foreground)]">{selectedStudent.parent}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs font-bold text-[var(--foreground-secondary)] uppercase tracking-widest">
                                    <span>Last Deposit</span>
                                    <span className="text-[var(--foreground)] tracking-tight">2 weeks ago (₹3,000)</span>
                                </div>
                            </div>
                        </Card>

                        {/* Recent History Mini-Ledger */}
                        <Card className="border-none bg-[var(--background-secondary)] border border-[var(--border)] rounded-[2rem] p-6">
                            <h5 className="text-xs font-black uppercase tracking-widest text-[var(--foreground-muted)] mb-6 flex items-center gap-2">
                                <History className="w-4 h-4" />
                                Recent Activity
                            </h5>
                            <div className="space-y-4">
                                {[
                                    { date: 'Jan 15', type: 'Tuition Q3', amount: 5000, method: 'UPI' },
                                    { date: 'Dec 05', type: 'Lab Fee', amount: 1200, method: 'Cash' },
                                ].map((item, i) => (
                                    <div key={i} className="flex justify-between items-center">
                                        <div>
                                            <p className="text-sm font-bold text-[var(--foreground)] leading-tight">{item.type}</p>
                                            <p className="text-[10px] text-[var(--foreground-muted)] font-bold">{item.date} • {item.method}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-black text-[var(--foreground)] tracking-tight">₹{item.amount.toLocaleString()}</p>
                                            <p className="text-[9px] text-emerald-600 font-black uppercase tracking-tighter">Verified</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>

                    {/* Right: Deposit Interface */}
                    <div className="lg:col-span-2 space-y-8">
                        <Card className="border-none bg-[var(--card-background)] rounded-[2.5rem] shadow-2xl shadow-slate-200/60 dark:shadow-none overflow-hidden">
                            <CardHeader className="p-8 pb-4 border-b border-[var(--border)] bg-[var(--background-secondary)]/30 flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="text-xl font-bold text-[var(--foreground)]">Payment Breakdown</CardTitle>
                                    <CardDescription>Allocate funds to specific fee headers.</CardDescription>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => handleApplyUniformly(selectedStudent.totalBalance)}
                                        className="rounded-xl border-[var(--border)] font-bold text-xs h-9 px-4"
                                    >
                                        Clear Full Duel
                                    </Button>
                                </div>
                            </CardHeader>
                            <div className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-[var(--background-secondary)]/50 border-none">
                                            <TableHead className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">Fee Head</TableHead>
                                            <TableHead className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-center">Outstanding</TableHead>
                                            <TableHead className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-right">Deposit Amount (₹)</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {mockFeeHeads.map((head) => (
                                            <TableRow key={head.id} className="border-b border-[var(--border)] hover:bg-[var(--background-secondary)]/30 transition-colors">
                                                <TableCell className="px-8 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className={cn(
                                                            "w-1.5 h-1.5 rounded-full",
                                                            head.balance > 0 ? "bg-rose-500" : "bg-emerald-500"
                                                        )} />
                                                        <span className="font-bold text-[var(--foreground)]">{head.name}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-8 py-5 text-center">
                                                    <span className={cn(
                                                        "text-sm font-black tracking-tight",
                                                        head.balance > 0 ? "text-rose-600" : "text-emerald-600"
                                                    )}>₹{head.balance.toLocaleString()}</span>
                                                </TableCell>
                                                <TableCell className="px-8 py-5 text-right">
                                                    <Input
                                                        type="number"
                                                        placeholder="0.00"
                                                        value={depositAmounts[head.id] || ''}
                                                        onChange={(e) => setFormData(head.id, e.target.value)}
                                                        className="h-10 w-32 ml-auto rounded-xl bg-[var(--background-secondary)] border-[var(--border)] font-black text-right pr-4 focus:bg-[var(--card-background)] focus:ring-2 focus:ring-indigo-500"
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </Card>

                        {/* Payment Confirmation & Method */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <Card className="border-none bg-[var(--card-background)] rounded-[2.5rem] shadow-xl shadow-slate-200/40 dark:shadow-none p-8 space-y-6">
                                <h4 className="text-lg font-black text-[var(--foreground)]">Transaction Details</h4>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)] ml-1">Payment Method</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {[
                                                { id: 'UPI', icon: Send, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-900/30' },
                                                { id: 'Cash', icon: Wallet, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/30' },
                                                { id: 'Bank', icon: Building2, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/30' },
                                                { id: 'Card', icon: CreditCard, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/30' },
                                            ].map((method) => (
                                                <button
                                                    key={method.id}
                                                    onClick={() => setPaymentMethod(method.id)}
                                                    className={cn(
                                                        "flex flex-col items-center justify-center p-4 rounded-2xl border transition-all gap-2",
                                                        paymentMethod === method.id
                                                            ? "bg-slate-900 text-white border-slate-900"
                                                            : "bg-[var(--background-secondary)] border-[var(--border)] text-[var(--foreground-secondary)] hover:bg-[var(--card-background)]"
                                                    )}
                                                >
                                                    <method.icon className={cn("w-5 h-5", paymentMethod === method.id ? "text-white" : method.color)} />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">{method.id}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)] ml-1">Reference No. (Optional)</label>
                                        <Input placeholder="TXN-ID / Receipt No." className="h-12 rounded-2xl bg-[var(--background-secondary)] border-[var(--border)] font-bold" />
                                    </div>
                                </div>
                            </Card>

                            <Card className="border-none bg-indigo-600 text-white rounded-[2.5rem] p-8 space-y-8 flex flex-col justify-between shadow-2xl shadow-indigo-600/30">
                                <div>
                                    <h4 className="text-xl font-black mb-1">Deposit Summary</h4>
                                    <p className="text-indigo-100/70 text-sm font-medium">Verify total amount before proceeding.</p>
                                </div>

                                <div className="space-y-4 p-6 bg-white/10 rounded-3xl border border-white/10 backdrop-blur-md">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-bold text-indigo-100">Deposit Amount</span>
                                        <span className="text-xl font-black">₹{totalToDeposit.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-bold text-indigo-100">Service Charges</span>
                                        <span className="text-sm font-black">₹0.00</span>
                                    </div>
                                    <div className="border-t border-white/20 pt-4 flex justify-between items-center">
                                        <span className="text-base font-black">Final Total</span>
                                        <span className="text-3xl font-black tracking-tighter">₹{totalToDeposit.toLocaleString()}</span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Button
                                        onClick={executeDeposit}
                                        disabled={isProcessing || totalToDeposit === 0}
                                        className="w-full h-16 bg-white text-indigo-600 hover:bg-slate-50 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all"
                                    >
                                        {isProcessing ? (
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-5 h-5 animate-spin" />
                                                Recording...
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <CheckCircle2 className="w-5 h-5" />
                                                Confirm Deposit
                                            </div>
                                        )}
                                    </Button>
                                    <div className="flex items-center justify-center gap-4 text-indigo-200">
                                        <button className="text-[10px] font-black uppercase tracking-widest hover:text-white flex items-center gap-1">
                                            <Printer className="w-3 h-3" /> Print
                                        </button>
                                        <div className="w-1 h-1 rounded-full bg-indigo-400" />
                                        <button className="text-[10px] font-black uppercase tracking-widest hover:text-white flex items-center gap-1">
                                            <Send className="w-3 h-3" /> SMS Receipt
                                        </button>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 py-10">
                    <div className="space-y-12 animate-in slide-in-from-left duration-700">
                        <div className="space-y-4">
                            <h2 className="text-4xl font-black text-[var(--foreground)] tracking-tight">Financial <span className="text-indigo-600">Reception</span></h2>
                            <p className="text-[var(--foreground-secondary)] font-medium max-w-md">Search for a student account or pick from the high-priority queue below to begin a deposit.</p>
                            <div className="pt-2">
                                <Link href="/admin/fees/add">
                                    <Button className="h-14 bg-slate-900 hover:bg-black text-white rounded-2xl px-8 font-bold shadow-xl shadow-slate-900/20 transform hover:scale-105 transition-all">
                                        <Plus className="w-5 h-5 mr-3" />
                                        Assign New Due / Fine
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-xs font-black uppercase tracking-widest text-[var(--foreground-muted)]">Quick Access Profiles</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {quickSearchStudents.map((student) => (
                                    <button
                                        key={student.id}
                                        onClick={() => {
                                            setSearchQuery(student.id)
                                            setSelectedStudent({
                                                name: student.name,
                                                admissionNo: student.id,
                                                class: student.class,
                                                parent: 'Sanjay Sharma',
                                                photo: student.name.split(' ').map(n => n[0]).join(''),
                                                totalBalance: parseInt(student.balance.replace(',', ''))
                                            })
                                        }}
                                        className="p-5 rounded-3xl bg-[var(--card-background)] border border-[var(--border)] shadow-xl shadow-slate-200/40 dark:shadow-none hover:border-indigo-500 hover:translate-y-[-4px] transition-all text-left flex items-center gap-4 group"
                                    >
                                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 flex items-center justify-center font-black group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                            {student.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <p className="font-bold text-[var(--foreground)]">{student.name}</p>
                                            <p className="text-[10px] font-black text-[var(--foreground-muted)] uppercase tracking-widest">{student.class} • {student.id}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="p-8 rounded-[2.5rem] bg-slate-900 text-white relative overflow-hidden group">
                            <div className="relative z-10 space-y-4">
                                <Badge className="bg-indigo-500 text-white border-none font-bold">Counter Status</Badge>
                                <h4 className="text-xl font-black">Daily Collection Target</h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-bold text-indigo-200">
                                        <span>72% of expected revenue collected</span>
                                        <span>₹1,42,000 / ₹2,00,000</span>
                                    </div>
                                    <div className="w-full bg-white/10 rounded-full h-2">
                                        <div className="bg-indigo-400 h-2 rounded-full w-[72%] shadow-[0_0_15px_rgba(129,140,248,0.5)]" />
                                    </div>
                                </div>
                            </div>
                            <div className="absolute top-0 right-0 p-8 transform rotate-12 opacity-5">
                                <IndianRupee className="w-40 h-40" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8 animate-in slide-in-from-right duration-700 delay-200">
                        <Card className="border-none bg-indigo-50/30 dark:bg-indigo-900/10 rounded-[3rem] p-10 border border-indigo-100 dark:border-indigo-800/30 flex flex-col items-center justify-center text-center space-y-8 relative overflow-hidden">
                            <div className="w-32 h-32 bg-[var(--card-background)] rounded-[2.5rem] flex items-center justify-center relative shadow-2xl">
                                <Users className="w-12 h-12 text-indigo-200" />
                                <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-indigo-600/30 shadow-lg">
                                    <Search className="w-5 h-5 text-white" />
                                </div>
                            </div>
                            <div className="space-y-2 relative z-10">
                                <h3 className="text-2xl font-black text-[var(--foreground)] tracking-tight">No Active Session</h3>
                                <p className="text-[var(--foreground-secondary)] font-medium max-w-xs mx-auto text-sm">Use the search bar above or pick a quick access profile to start recording fees.</p>
                            </div>
                            {/* Decorative background circle */}
                            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-indigo-100/50 dark:bg-indigo-900/20 rounded-full blur-3xl" />
                        </Card>

                        <Card className="border-none bg-[var(--card-background)] rounded-[3rem] shadow-2xl shadow-slate-200/50 dark:shadow-none p-8">
                            <h5 className="text-xs font-black uppercase tracking-widest text-[var(--foreground-muted)] mb-8 flex items-center gap-2">
                                <History className="w-4 h-4" />
                                Console Activity Log
                            </h5>
                            <div className="space-y-6">
                                {recentGlobalActivity.map((activity, i) => (
                                    <div key={i} className="flex items-center justify-between group">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-[var(--background-secondary)] rounded-2xl text-[var(--foreground-muted)] group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/30 group-hover:text-emerald-600 transition-colors">
                                                <CheckCircle2 className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-[var(--foreground)]">{activity.student}</p>
                                                <p className="text-[10px] font-bold text-[var(--foreground-muted)] uppercase tracking-widest">{activity.time} • Recorded by Admin</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-black text-[var(--foreground)] tracking-tight">₹{activity.amount.toLocaleString()}</p>
                                            <Badge variant="outline" className="text-[8px] font-black uppercase rounded-lg px-2 border-[var(--border)]">{activity.method}</Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    )
}

