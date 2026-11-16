'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
    IndianRupee,
    CreditCard,
    History,
    Download,
    AlertCircle,
    CheckCircle2,
    ChevronRight,
    Search,
    Filter
} from 'lucide-react'
import { ParentChild, FeeItem } from '../actions/types'
import { PaymentHistory } from '../actions/feeActions'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'

export default function FeesContent({
    initialChildren,
    feesData,
    historyData,
    selectedChildId: propSelectedChildId
}: {
    initialChildren: ParentChild[],
    feesData: FeeItem[],
    historyData: PaymentHistory[],
    selectedChildId: string
}) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const [localSelectedChildId, setLocalSelectedChildId] = useState(propSelectedChildId)
    const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending')

    const handleChildSelect = (id: string) => {
        setLocalSelectedChildId(id)
        const params = new URLSearchParams(searchParams.toString())
        params.set('childId', id)
        router.push(`${pathname}?${params.toString()}`)
    }

    const selectedChild = initialChildren.find(c => c.id === localSelectedChildId) || initialChildren[0]

    const totalPending = feesData
        .filter(f => f.status !== 'paid')
        .reduce((acc, curr) => acc + curr.amount, 0)

    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight dark:text-white">Fee Management</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        View invoices, pay online, and download receipts.
                    </p>
                </div>

                <div className="flex bg-white dark:bg-slate-900 p-1 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    {initialChildren.map((child) => (
                        <button
                            key={child.id}
                            onClick={() => handleChildSelect(child.id)}
                            className={cn(
                                "px-4 py-2 rounded-xl text-sm font-bold transition-all",
                                localSelectedChildId === child.id
                                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                                    : "text-slate-500 hover:text-blue-600"
                            )}
                        >
                            {child.name.split(' ')[0]}
                        </button>
                    ))}
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Fee Section */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Tabs */}
                    <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl w-fit border border-slate-200 dark:border-slate-800">
                        <button
                            onClick={() => setActiveTab('pending')}
                            className={cn(
                                "px-6 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2",
                                activeTab === 'pending'
                                    ? "bg-white dark:bg-slate-800 text-blue-600 shadow-sm"
                                    : "text-slate-500 hover:text-slate-700"
                            )}
                        >
                            <CreditCard className="w-4 h-4" /> Pending Bills
                        </button>
                        <button
                            onClick={() => setActiveTab('history')}
                            className={cn(
                                "px-6 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2",
                                activeTab === 'history'
                                    ? "bg-white dark:bg-slate-800 text-blue-600 shadow-sm"
                                    : "text-slate-500 hover:text-slate-700"
                            )}
                        >
                            <History className="w-4 h-4" /> Payment History
                        </button>
                    </div>

                    {activeTab === 'pending' ? (
                        <Card className="border-0 shadow-xl rounded-3xl overflow-hidden bg-white dark:bg-slate-900">
                            <CardHeader className="p-6 border-b border-slate-100 dark:border-slate-800">
                                <CardTitle className="text-lg">Outstanding Invoices</CardTitle>
                                <CardDescription>Itemized breakdown of current dues</CardDescription>
                            </CardHeader>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader className="bg-slate-50 dark:bg-slate-950">
                                        <TableRow className="hover:bg-transparent border-0">
                                            <TableHead className="font-bold text-xs uppercase tracking-widest text-slate-400 pl-6 h-12">Description</TableHead>
                                            <TableHead className="font-bold text-xs uppercase tracking-widest text-slate-400 h-12">Due Date</TableHead>
                                            <TableHead className="font-bold text-xs uppercase tracking-widest text-slate-400 h-12">Amount</TableHead>
                                            <TableHead className="font-bold text-xs uppercase tracking-widest text-slate-400 h-12 text-right pr-6">Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {feesData.filter(f => f.status !== 'paid').map((fee) => (
                                            <TableRow key={fee.id} className="border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                                <TableCell className="pl-6 py-4">
                                                    <p className="font-bold text-slate-900 dark:text-white">{fee.category}</p>
                                                    <p className="text-[10px] text-slate-500 uppercase font-black">INV-{fee.id.split('_')[1]}</p>
                                                </TableCell>
                                                <TableCell className="text-sm font-medium">
                                                    {new Date(fee.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </TableCell>
                                                <TableCell className="text-lg font-black tracking-tight">
                                                    ₹{fee.amount.toLocaleString()}
                                                </TableCell>
                                                <TableCell className="text-right pr-6">
                                                    <Badge className="bg-amber-100 text-amber-600 dark:bg-amber-900/30 border-0 uppercase text-[10px] font-black">
                                                        Pending
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {feesData.filter(f => f.status !== 'paid').length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={4} className="h-40 text-center">
                                                    <div className="flex flex-col items-center justify-center">
                                                        <CheckCircle2 className="w-10 h-10 text-emerald-500 mb-2" />
                                                        <p className="font-bold text-slate-900 dark:text-white">All Clear!</p>
                                                        <p className="text-xs text-slate-500 uppercase font-black tracking-widest mt-1">No pending dues found</p>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="border-0 shadow-xl rounded-3xl overflow-hidden bg-white dark:bg-slate-900">
                            <CardHeader className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="text-lg">Recent Transactions</CardTitle>
                                    <CardDescription>History of all payments made</CardDescription>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="icon" className="rounded-xl"><Search className="w-4 h-4" /></Button>
                                    <Button variant="outline" size="icon" className="rounded-xl"><Filter className="w-4 h-4" /></Button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader className="bg-slate-50 dark:bg-slate-950">
                                        <TableRow className="hover:bg-transparent border-0">
                                            <TableHead className="font-bold text-xs uppercase tracking-widest text-slate-400 pl-6 h-12">Date</TableHead>
                                            <TableHead className="font-bold text-xs uppercase tracking-widest text-slate-400 h-12">Method</TableHead>
                                            <TableHead className="font-bold text-xs uppercase tracking-widest text-slate-400 h-12">Amount</TableHead>
                                            <TableHead className="font-bold text-xs uppercase tracking-widest text-slate-400 h-12 text-right pr-6">Receipt</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {historyData.map((tx) => (
                                            <TableRow key={tx.id} className="border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                                <TableCell className="pl-6 py-4">
                                                    <p className="font-bold text-slate-900 dark:text-white">
                                                        {new Date(tx.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                    </p>
                                                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-tighter">TXN-{tx.id.split('_')[1]}</p>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                                        <span className="text-sm font-medium">{tx.method}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-lg font-black tracking-tight">
                                                    ₹{tx.amount.toLocaleString()}
                                                </TableCell>
                                                <TableCell className="text-right pr-6">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="rounded-xl text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                        onClick={() => alert('Generating receipt for TXN-' + tx.id.split('_')[1] + '...\nYour download will start shortly.')}
                                                    >
                                                        <Download className="w-4 h-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Sidebar Summmary */}
                <div className="space-y-6">
                    <Card className="border-0 shadow-2xl rounded-3xl bg-slate-900 text-white p-8 relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center mb-6 shadow-xl shadow-blue-500/20">
                                <IndianRupee className="w-6 h-6" />
                            </div>
                            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Total Outstanding</p>
                            <h3 className="text-5xl font-black mt-2 tracking-tighter">
                                ₹{totalPending.toLocaleString()}
                            </h3>

                            {totalPending > 0 ? (
                                <div className="mt-8 space-y-4">
                                    <Button className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-black text-lg rounded-2xl shadow-xl shadow-blue-600/30 group">
                                        Pay Now <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                    <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10">
                                        <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
                                        <p className="text-xs text-slate-300 leading-relaxed font-medium">
                                            Please settle the dues by <span className="text-white font-bold">Feb 15, 2026</span> to avoid late payment charges.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="mt-8 p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 flex items-center gap-3 text-emerald-400">
                                    <CheckCircle2 className="w-5 h-5" />
                                    <p className="text-sm font-bold">Account is fully paid!</p>
                                </div>
                            )}
                        </div>
                        {/* Decorative elements */}
                        <div className="absolute -top-12 -right-12 w-48 h-48 bg-blue-600/20 rounded-full blur-3xl" />
                        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-emerald-600/10 rounded-full blur-3xl" />
                    </Card>

                    <Card className="p-6 border-slate-200 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900 shadow-sm">
                        <h4 className="font-bold text-slate-900 dark:text-white mb-4">Payment Methods</h4>
                        <div className="space-y-3">
                            {['UPI / PhonePe / GPay', 'Credit/Debit Cards', 'Net Banking'].map(method => (
                                <div key={method} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-blue-200 transition-colors">
                                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                    </div>
                                    <span className="text-sm font-bold text-slate-600 dark:text-slate-400">{method}</span>
                                </div>
                            ))}
                        </div>
                        <p className="mt-6 text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center">
                            Powered by Razorpay
                        </p>
                    </Card>

                    <Card className="p-6 border-0 bg-blue-50 dark:bg-blue-900/10 rounded-3xl">
                        <h4 className="font-bold text-blue-900 dark:text-blue-400 mb-2">Need a Physical Receipt?</h4>
                        <p className="text-xs text-blue-700/70 dark:text-blue-400/70 leading-relaxed mb-4">
                            All digital payments generate an instant PDF receipt. For cash payments, please contact the school accountant.
                        </p>
                        <Button variant="link" className="p-0 h-auto text-blue-600 font-black text-xs uppercase tracking-widest">
                            Contact Accounts <ChevronRight className="w-3 h-3 ml-1" />
                        </Button>
                    </Card>
                </div>
            </div>
        </div>
    )
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ')
}
