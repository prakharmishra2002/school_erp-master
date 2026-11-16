'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { searchFeeAccount, recordFeeDeposit } from '@/app/(admin)/_actions/fees'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
    IndianRupee,
    ChevronRight,
    ArrowLeft,
    Search,
    Users,
    Wallet,
    CreditCard,
    Send,
    Building2,
    CheckCircle2,
    Printer,
    Receipt,
    History,
    Calendar,
    ArrowDownRight,
    QrCode,
    Sparkles
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

interface FeeDue {
    id: string
    head: string
    amount: number
    dueDate: string
}

export default function CollectionDeskPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedStudent, setSelectedStudent] = useState<any>(null)
    const [paymentMethod, setPaymentMethod] = useState('Cash')
    const [receivedAmount, setReceivedAmount] = useState('')
    const [isProcessing, setIsProcessing] = useState(false)

    const mockDues: FeeDue[] = [
        { id: '1', head: 'Tuition Fee (Q3)', amount: 12500, dueDate: 'Jan 10, 2026' },
        { id: '2', head: 'Transport Fee (Jan)', amount: 2500, dueDate: 'Jan 10, 2026' },
        { id: '3', head: 'Library Fine', amount: 450, dueDate: 'Immediate' },
    ]

    const handleSearch = async () => {
        if (searchQuery.length > 2) {
            const res = await searchFeeAccount(searchQuery)
            if (res.success && res.data) {
                setSelectedStudent({
                    name: res.data.name,
                    admissionNo: res.data.admissionNo,
                    class: res.data.class,
                    parent: res.data.parent,
                    totalDue: res.data.totalBalance,
                    dues: res.data.feeHeads.map((f: any) => ({
                        id: f.id,
                        head: f.name,
                        amount: f.due - f.paid,
                        dueDate: 'Continuous' // Since we don't return dueDate exactly
                    }))
                })
                toast.success('Account Loaded')
            } else {
                toast.error(res.message || 'Student fee account not found')
            }
        }
    }

    const handleFinalize = async () => {
        if (!selectedStudent || !receivedAmount) return;
        setIsProcessing(true);

        const amountToPay = parseFloat(receivedAmount);

        // Simple allocation logic: FIFO 
        const amounts: Record<string, number> = {};
        let remaining = amountToPay;
        for (const due of selectedStudent.dues) {
            if (remaining <= 0) break;
            const toApply = Math.min(remaining, due.amount);
            amounts[due.id] = toApply;
            remaining -= toApply;
        }

        const res = await recordFeeDeposit(selectedStudent.admissionNo, amounts, paymentMethod);
        setIsProcessing(false);

        if (res.success && res.data) {
            toast.success('Collection Recorded', {
                description: `Receipt #${res.data.receiptId} generated for ₹${amountToPay}`
            })
            setSelectedStudent(null)
            setReceivedAmount('')
            setSearchQuery('')
        } else {
            toast.error(res.message || 'Deposit Failed')
        }
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Link href="/admin/fees" className="text-sm font-medium text-[var(--foreground-secondary)] hover:text-indigo-600 transition-colors">Fees Hub</Link>
                        <ChevronRight className="w-4 h-4 text-[var(--foreground-muted)]" />
                        <span className="text-sm font-bold text-emerald-600 uppercase tracking-widest">Collection Desk</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/admin/fees">
                            <Button variant="ghost" className="rounded-xl h-10 w-10 p-0 hover:bg-[var(--background-secondary)] text-[var(--foreground-muted)]">
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                        </Link>
                        <h1 className="text-3xl font-black tracking-tight text-[var(--foreground)]">In-Person Collection Entry</h1>
                    </div>
                </div>

                <div className="flex items-center gap-4 bg-emerald-50 dark:bg-emerald-500/10 px-6 py-3 rounded-2xl border border-emerald-100 dark:border-emerald-500/20">
                    <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                        <Wallet className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-widest">Drawer Total Today</p>
                        <p className="text-xl font-black text-emerald-900 dark:text-emerald-50 tracking-tight">₹42,500.00</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left: Terminal Input (8 cols) */}
                <div className="lg:col-span-8 space-y-8">
                    <Card className="border-none bg-[var(--card-background)] rounded-[2.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-none p-8">
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <label className="text-xs font-black uppercase tracking-[0.2em] text-[var(--foreground-muted)] ml-1">Step 1: Identify Student</label>
                                <div className="flex gap-3">
                                    <div className="relative flex-1">
                                        <Input
                                            placeholder="Enter Admission No, Name or Scan ID..."
                                            className="h-16 rounded-2xl bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 pl-14 font-black text-lg focus:ring-4 focus:ring-indigo-500/10 transition-all dark:text-slate-100"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                        />
                                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
                                    </div>
                                    <Button onClick={handleSearch} className="h-16 rounded-2xl px-8 bg-slate-900 text-white font-black uppercase tracking-widest text-xs">Load Profile</Button>
                                </div>
                            </div>

                            {selectedStudent ? (
                                <div className="space-y-8 animate-in slide-in-from-top duration-500">
                                    <div className="p-6 rounded-3xl bg-indigo-50/50 dark:bg-indigo-500/5 border border-indigo-100 dark:border-indigo-500/10 flex items-center justify-between">
                                        <div className="flex items-center gap-5">
                                            <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center text-2xl font-black text-indigo-600 dark:text-indigo-400 shadow-xl shadow-indigo-600/10">
                                                AS
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight">{selectedStudent.name}</h3>
                                                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{selectedStudent.class} • {selectedStudent.admissionNo}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Outstanding</p>
                                            <p className="text-2xl font-black text-rose-600 tracking-tighter">₹{selectedStudent.totalDue.toLocaleString()}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-xs font-black uppercase tracking-[0.2em] text-[var(--foreground-muted)] ml-1">Step 2: Payment Entry</label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-4">
                                                <div className="relative">
                                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-3xl font-black text-slate-400">₹</div>
                                                    <Input
                                                        type="number"
                                                        placeholder="0.00"
                                                        className="h-20 rounded-[2rem] bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 pl-12 text-4xl font-black text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 transition-all shadow-inner"
                                                        value={receivedAmount}
                                                        onChange={(e) => setReceivedAmount(e.target.value)}
                                                        autoFocus
                                                    />
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {[500, 1000, 2000, 5000].map(amt => (
                                                        <button
                                                            key={amt}
                                                            onClick={() => setReceivedAmount(amt.toString())}
                                                            className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-xs font-black text-slate-500 dark:text-slate-400 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all shadow-sm"
                                                        >
                                                            +₹{amt}
                                                        </button>
                                                    ))}
                                                    <button
                                                        onClick={() => setReceivedAmount(selectedStudent.totalDue.toString())}
                                                        className="px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                                                    >
                                                        Clear Full Due
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3">
                                                {[
                                                    { id: 'Cash', icon: Wallet, color: 'text-emerald-500' },
                                                    { id: 'UPI', icon: QrCode, color: 'text-indigo-500' },
                                                    { id: 'Card', icon: CreditCard, color: 'text-blue-500' },
                                                    { id: 'Bank', icon: Building2, color: 'text-slate-500' },
                                                ].map((mode) => (
                                                    <button
                                                        key={mode.id}
                                                        onClick={() => setPaymentMethod(mode.id)}
                                                        className={cn(
                                                            "flex flex-col items-center justify-center p-4 rounded-3xl border transition-all gap-2 group",
                                                            paymentMethod === mode.id
                                                                ? "bg-slate-900 dark:bg-indigo-600 border-slate-900 dark:border-indigo-600 text-white shadow-xl scale-[1.02]"
                                                                : "bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:border-indigo-200 dark:hover:border-indigo-500/30"
                                                        )}
                                                    >
                                                        <mode.icon className={cn("w-6 h-6", paymentMethod === mode.id ? "text-white" : mode.color)} />
                                                        <span className="text-[10px] font-black uppercase tracking-widest">{mode.id}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="py-20 flex flex-col items-center justify-center text-center space-y-6">
                                    <div className="w-32 h-32 bg-slate-50 dark:bg-slate-800 rounded-[3rem] flex items-center justify-center relative shadow-inner group overflow-hidden">
                                        <Users className="w-12 h-12 text-slate-200 dark:text-slate-700 group-hover:scale-110 transition-transform duration-500" />
                                        <div className="absolute top-0 right-0 p-4 opacity-5 bg-indigo-600 w-full h-full rounded-full animate-pulse" />
                                    </div>
                                    <div className="space-y-2">
                                        <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Ready for Transaction</h2>
                                        <p className="text-slate-400 font-medium max-w-sm mx-auto text-sm">Enter a student's ID or Name to begin the in-person collection process.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>

                    {selectedStudent && (
                        <Card className="border-none bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-none overflow-hidden animate-in fade-in slide-in-from-bottom duration-700">
                            <CardHeader className="p-8 pb-4 border-b border-slate-50 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/20 flex flex-row items-center justify-between">
                                <div>
                                    <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100">Automatic Allocation Preference</h4>
                                    <p className="text-xs text-slate-400 font-medium italic">FIFO Strategy: Payments applied to oldest dues first.</p>
                                </div>
                                <Sparkles className="w-5 h-5 text-indigo-400" />
                            </CardHeader>
                            <div className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-slate-50/50 dark:bg-slate-800/50 border-none">
                                            <TableHead className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-200">Fee Component</TableHead>
                                            <TableHead className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-center">Due Date</TableHead>
                                            <TableHead className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-right">Amount (₹)</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {selectedStudent.dues.map((due: any) => (
                                            <TableRow key={due.id} className="border-b border-slate-50 dark:border-slate-800 transition-colors">
                                                <TableCell className="px-8 py-5">
                                                    <span className="font-bold text-slate-800 dark:text-slate-200">{due.head}</span>
                                                </TableCell>
                                                <TableCell className="px-8 py-5 text-center text-xs font-bold text-slate-500 dark:text-slate-400">
                                                    {due.dueDate}
                                                </TableCell>
                                                <TableCell className="px-8 py-5 text-right font-black text-slate-800 dark:text-slate-100">
                                                    ₹{due.amount.toLocaleString()}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </Card>
                    )}
                </div>

                {/* Right: Checkout & Status (4 cols) */}
                <div className="lg:col-span-4 space-y-8">
                    <Card className="border-none bg-slate-900 text-white rounded-[2.5rem] p-8 shadow-2xl shadow-indigo-950/20 sticky top-8">
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-2xl font-black mb-1">Entry Summary</h3>
                                <p className="text-indigo-200/50 text-xs font-bold uppercase tracking-widest mt-1">Transaction Processing</p>
                            </div>

                            <div className="space-y-6">
                                <div className="p-6 bg-white/5 rounded-[2rem] border border-white/10 backdrop-blur-md space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-bold text-indigo-200">Payment Mode</span>
                                        <Badge variant="outline" className="border-indigo-400/30 text-indigo-200 text-[10px] uppercase font-black px-3 py-1 rounded-lg bg-indigo-500/10">
                                            {paymentMethod}
                                        </Badge>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-bold text-indigo-200">Collector Hub</span>
                                        <span className="text-sm font-black text-emerald-400">Main Cashier</span>
                                    </div>
                                    <div className="h-px bg-white/10 w-full" />
                                    <div className="flex justify-between items-center pt-2">
                                        <span className="text-base font-black">Gross Amount</span>
                                        <span className="text-4xl font-black text-indigo-400 tracking-tighter">₹{receivedAmount || '0.00'}</span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-200/30 ml-2">
                                        <History className="w-3 h-3" />
                                        Cloud Ledger Sync Enabled
                                    </div>
                                    <Button
                                        onClick={handleFinalize}
                                        disabled={isProcessing || !receivedAmount || !selectedStudent}
                                        className="w-full h-16 bg-white dark:bg-indigo-600 dark:hover:bg-indigo-700 text-slate-900 dark:text-white hover:bg-slate-100 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all group"
                                    >
                                        {isProcessing ? 'Finalizing Entry...' : (
                                            <div className="flex items-center gap-2">
                                                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                                Finalize Collection
                                                <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        )}
                                    </Button>
                                    <Button variant="ghost" className="w-full h-14 rounded-2xl text-indigo-200 font-bold hover:bg-white/5 border border-white/10">
                                        <Printer className="w-4 h-4 mr-2" />
                                        Save & Print Receipt
                                    </Button>
                                    <Button variant="ghost" className="w-full h-14 rounded-2xl text-indigo-200 font-bold hover:bg-white/5 border border-white/10">
                                        <Send className="w-4 h-4 mr-2" />
                                        Record & Send SMS
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Visual background element */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] pointer-events-none">
                            <Receipt className="w-80 h-80" />
                        </div>
                    </Card>

                    <Card className="border-none bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-[2.5rem] p-8 relative overflow-hidden group">
                        <div className="relative z-10 space-y-4">
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                                <Sparkles className="w-4 h-4" />
                                Daily Performance
                            </div>
                            <h4 className="text-lg font-black text-emerald-950 dark:text-emerald-50">Counter Efficiency</h4>
                            <div className="flex justify-between items-end border-b border-emerald-200 dark:border-emerald-500/20 pb-4">
                                <div className="space-y-1">
                                    <p className="text-2xl font-black text-emerald-800 dark:text-emerald-200 leading-none">14</p>
                                    <p className="text-[10px] font-bold text-emerald-600/70 dark:text-emerald-400 uppercase">Receipts Today</p>
                                </div>
                                <div className="space-y-1 text-right">
                                    <p className="text-2xl font-black text-emerald-800 dark:text-emerald-200 leading-none">₹3,035</p>
                                    <p className="text-[10px] font-bold text-emerald-600/70 dark:text-emerald-400 uppercase">Avg per txn</p>
                                </div>
                            </div>
                            <Link href="/admin/fees/logs">
                                <Button variant="link" className="p-0 h-auto text-emerald-600 dark:text-emerald-400 font-black uppercase tracking-widest text-[10px] hover:text-emerald-900 dark:hover:text-emerald-200 transition-colors">
                                    View Full History
                                    <ChevronRight className="w-3 h-3 ml-1" />
                                </Button>
                            </Link>
                        </div>
                        {/* Decorative circle */}
                        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-emerald-200/50 dark:bg-emerald-500/20 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-1000" />
                    </Card>
                </div>
            </div>
        </div>
    )
}
