'use client'

import { useState, useTransition } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Wallet,
    Download,
    FileText,
    Calendar,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    TrendingUp,
    CreditCard,
    Building2,
    Receipt,
    Printer,
    Eye,
    Plus,
    Check,
    Loader2,
} from 'lucide-react'
import { SalarySlip, BankAccount } from '../actions/types'
import { getSalarySlips, addBankAccount } from '../actions/salaryActions'

function SalarySlipCard({ slip, onView, onDownload, onPrint }: {
    slip: SalarySlip;
    onView: () => void;
    onDownload: () => void;
    onPrint: () => void
}) {
    const statusStyles = {
        paid: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400',
        processing: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400',
        pending: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400',
    }

    return (
        <Card className="group hover:shadow-lg hover:border-emerald-300 transition-all duration-300">
            <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h3 className="font-display text-lg font-semibold text-[var(--foreground)]">
                            {slip.month} {slip.year}
                        </h3>
                        <p className="text-sm text-[var(--foreground-muted)]">
                            {slip.paidOn ? `Paid on ${new Date(slip.paidOn).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}` : 'Not yet paid'}
                        </p>
                    </div>
                    <Badge className={statusStyles[slip.status]}>
                        {slip.status.charAt(0).toUpperCase() + slip.status.slice(1)}
                    </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                        <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mb-1 uppercase font-bold tracking-wider">Net Salary</p>
                        <p className="font-display text-lg font-semibold text-emerald-700 dark:text-emerald-400">
                            ₹{slip.netSalary.toLocaleString('en-IN')}
                        </p>
                    </div>
                    <div className="p-3 rounded-xl bg-[var(--background-secondary)] border border-[var(--border)]">
                        <p className="text-[10px] text-[var(--foreground-muted)] mb-1 uppercase font-bold tracking-wider">Gross</p>
                        <p className="font-display text-lg font-semibold text-[var(--foreground)]">
                            ₹{slip.grossSalary.toLocaleString('en-IN')}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="secondary" size="sm" className="flex-1 gap-2 h-10" onClick={onView}>
                        <Eye className="w-4 h-4" />
                        Details
                    </Button>
                    <Button variant="ghost" size="icon" className="shrink-0 h-10 w-10" onClick={onDownload} title="Download PDF">
                        <Download className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="shrink-0 h-10 w-10" onClick={onPrint} title="Print">
                        <Printer className="w-4 h-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

export default function SalaryContent({
    initialSlips,
    initialBankAccounts
}: {
    initialSlips: SalarySlip[],
    initialBankAccounts: BankAccount[]
}) {
    const [selectedYear, setSelectedYear] = useState('2026')
    const [selectedSlip, setSelectedSlip] = useState<SalarySlip | null>(null)
    const [bankAccountIndex, setBankAccountIndex] = useState(0)
    const [showAddAccountModal, setShowAddAccountModal] = useState(false)
    const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(initialBankAccounts)
    const [salarySlips, setSalarySlips] = useState<SalarySlip[]>(initialSlips)
    const [isFetching, startFetchingTransition] = useTransition()

    const handleYearChange = (year: string) => {
        setSelectedYear(year)
        startFetchingTransition(async () => {
            const newList = await getSalarySlips(parseInt(year))
            setSalarySlips(newList)
        })
    }

    const nextAccount = () => {
        setBankAccountIndex((prev) => (prev + 1) % bankAccounts.length)
    }

    const prevAccount = () => {
        setBankAccountIndex((prev) => (prev - 1 + bankAccounts.length) % bankAccounts.length)
    }

    const totalEarnings = salarySlips.filter(s => s.status === 'paid').reduce((acc, s) => acc + s.netSalary, 0)

    return (
        <div className="space-y-6 animate-slide-up">
            {/* Header */}
            <header>
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-xs font-medium tracking-widest uppercase text-[var(--foreground-muted)]">
                        Personal
                    </span>
                </div>
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                    <div>
                        <h1 className="font-display text-3xl font-semibold tracking-tight text-[var(--foreground)]">
                            Salary & Payslips
                        </h1>
                        <p className="mt-1 text-[var(--foreground-secondary)]">
                            View and download your salary receipts
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <select
                                value={selectedYear}
                                onChange={(e) => handleYearChange(e.target.value)}
                                className="appearance-none px-4 py-2.5 pr-10 bg-[var(--background-secondary)] rounded-xl text-sm font-medium text-[var(--foreground)] border border-transparent hover:border-[var(--border)] focus:outline-none focus:border-emerald-500 cursor-pointer"
                            >
                                <option value="2026">2026</option>
                                <option value="2025">2025</option>
                                <option value="2024">2024</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--foreground-muted)] pointer-events-none" />
                        </div>
                        <Button variant="secondary" size="sm" className="gap-2">
                            <Download className="w-4 h-4" />
                            Download All
                        </Button>
                    </div>
                </div>
            </header>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-emerald-200/50 dark:border-emerald-800/50 bg-gradient-to-br from-emerald-500/5 to-teal-500/5">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center">
                            <Wallet className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div>
                            <p className="font-display text-xl font-semibold text-emerald-600">
                                ₹{salarySlips[0]?.netSalary.toLocaleString('en-IN') || '0'}
                            </p>
                            <p className="text-sm text-[var(--foreground-muted)]">Current Salary</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-blue-200/50 dark:border-blue-800/50 bg-gradient-to-br from-blue-500/5 to-indigo-500/5">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="font-display text-xl font-semibold text-blue-600">
                                ₹{totalEarnings.toLocaleString('en-IN')}
                            </p>
                            <p className="text-sm text-[var(--foreground-muted)]">Total Received</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-amber-200/50 dark:border-amber-800/50 bg-gradient-to-br from-amber-500/5 to-orange-500/5">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
                            <CreditCard className="w-6 h-6 text-amber-600" />
                        </div>
                        <div>
                            <p className="font-display text-xl font-semibold text-amber-600">
                                ₹{salarySlips.reduce((acc, s) => acc + s.deductions.pf, 0).toLocaleString('en-IN')}
                            </p>
                            <p className="text-sm text-[var(--foreground-muted)]">Total PF</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-violet-200/50 dark:border-violet-800/50 bg-gradient-to-br from-violet-500/5 to-purple-500/5">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center">
                            <Receipt className="w-6 h-6 text-violet-600" />
                        </div>
                        <div>
                            <p className="font-display text-xl font-semibold text-violet-600">
                                {salarySlips.filter(s => s.status === 'paid').length}
                            </p>
                            <p className="text-sm text-[var(--foreground-muted)]">Slips Generated</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Bank Accounts Carousel */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-display text-lg font-semibold text-[var(--foreground)] flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-blue-500" />
                        Linked Bank Accounts
                    </h2>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2 text-emerald-600 hover:text-emerald-700"
                        onClick={() => setShowAddAccountModal(true)}
                    >
                        <Plus className="w-4 h-4" />
                        Add Account
                    </Button>
                </div>
                <div className="relative">
                    {bankAccounts.length > 0 && (
                        <>
                            <button
                                onClick={prevAccount}
                                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 sm:-translate-x-3 z-10 w-8 h-8 rounded-full bg-white dark:bg-slate-800 shadow-lg border border-[var(--border)] flex items-center justify-center hover:bg-[var(--background-secondary)] transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                                onClick={nextAccount}
                                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 sm:translate-x-3 z-10 w-8 h-8 rounded-full bg-white dark:bg-slate-800 shadow-lg border border-[var(--border)] flex items-center justify-center hover:bg-[var(--background-secondary)] transition-colors"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </>
                    )}

                    <div className="overflow-hidden">
                        <div
                            className="flex transition-transform duration-300 ease-out"
                            style={{ transform: `translateX(-${bankAccountIndex * 100}%)` }}
                        >
                            {bankAccounts.map((account) => (
                                <div key={account.id} className="w-full flex-shrink-0 px-1">
                                    <Card className={`relative overflow-hidden border-0 bg-gradient-to-br ${account.color} text-white`}>
                                        <div className="absolute inset-0 opacity-10">
                                            <div className="absolute top-4 right-4 w-20 h-20 rounded-full border-4 border-white/30" />
                                            <div className="absolute top-8 right-8 w-20 h-20 rounded-full border-4 border-white/20" />
                                        </div>
                                        <CardContent className="relative p-6">
                                            <div className="flex items-start justify-between mb-6">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h3 className="font-display text-lg font-semibold">{account.bankName}</h3>
                                                        {account.isPrimary && (
                                                            <Badge className="bg-white/20 text-white text-[10px] border-0">
                                                                Primary
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-white/70">{account.type} Account</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {account.verified ? (
                                                        <div className="flex items-center gap-1 text-xs bg-white/20 px-2 py-1 rounded-full">
                                                            <Check className="w-3 h-3" />
                                                            Verified
                                                        </div>
                                                    ) : (
                                                        <Badge variant="outline" className="text-white/70 border-white/30 text-xs">
                                                            Pending
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="mb-4">
                                                <p className="text-xs text-white/60 mb-1">Account Number</p>
                                                <p className="font-mono text-xl tracking-widest">{account.accountNumber}</p>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-xs text-white/60 mb-0.5">IFSC Code</p>
                                                    <p className="font-mono text-sm">{account.ifsc}</p>
                                                </div>
                                                <div className="w-12 h-8 bg-white/10 rounded flex items-center justify-center text-xs font-bold">
                                                    {account.logo}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-2 mt-4">
                        {bankAccounts.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setBankAccountIndex(index)}
                                className={`w-2 h-2 rounded-full transition-all ${index === bankAccountIndex
                                    ? 'w-6 bg-emerald-500'
                                    : 'bg-slate-300 dark:bg-slate-600 hover:bg-slate-400'
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Salary Slips Grid */}
            <div className="relative">
                {isFetching && (
                    <div className="absolute inset-0 bg-white/50 dark:bg-black/50 backdrop-blur-[2px] z-10 flex items-center justify-center rounded-2xl">
                        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                    </div>
                )}
                <h2 className="font-display text-lg font-semibold text-[var(--foreground)] mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-emerald-500" />
                    Salary Slips
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {salarySlips.map(slip => (
                        <SalarySlipCard
                            key={slip.id}
                            slip={slip}
                            onView={() => setSelectedSlip(slip)}
                            onDownload={() => alert(`Downloading Salary Slip for ${slip.month} ${slip.year}...`)}
                            onPrint={() => {
                                setSelectedSlip(slip)
                                setTimeout(() => window.print(), 500)
                            }}
                        />
                    ))}
                    {salarySlips.length === 0 && !isFetching && (
                        <div className="md:col-span-2 lg:col-span-3 py-12 text-center bg-[var(--background-secondary)] rounded-2xl border border-dashed border-[var(--border)]">
                            <p className="text-[var(--foreground-muted)]">No salary slips found for {selectedYear}.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Detail Modal */}
            {selectedSlip && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedSlip(null)}>
                    <Card className="w-full max-w-lg animate-slide-up max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <CardHeader className="border-b border-[var(--border)]">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                                        <Receipt className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <CardTitle className="font-display text-lg">Salary Slip</CardTitle>
                                        <p className="text-sm text-[var(--foreground-muted)]">{selectedSlip.month} {selectedSlip.year}</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm" onClick={() => setSelectedSlip(null)}>✕</Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-5 space-y-4">
                            {/* Earnings */}
                            <div>
                                <h4 className="font-semibold text-emerald-600 mb-2">Earnings</h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-[var(--foreground-muted)]">Basic Salary</span>
                                        <span className="font-medium">₹{selectedSlip.basicSalary.toLocaleString('en-IN')}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[var(--foreground-muted)]">HRA</span>
                                        <span className="font-medium">₹{selectedSlip.allowances.hra.toLocaleString('en-IN')}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[var(--foreground-muted)]">DA</span>
                                        <span className="font-medium">₹{selectedSlip.allowances.da.toLocaleString('en-IN')}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[var(--foreground-muted)]">TA</span>
                                        <span className="font-medium">₹{selectedSlip.allowances.ta.toLocaleString('en-IN')}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[var(--foreground-muted)]">Medical</span>
                                        <span className="font-medium">₹{selectedSlip.allowances.medical.toLocaleString('en-IN')}</span>
                                    </div>
                                    <div className="flex justify-between pt-2 border-t border-dashed border-[var(--border)]">
                                        <span className="font-semibold">Gross Salary</span>
                                        <span className="font-semibold">₹{selectedSlip.grossSalary.toLocaleString('en-IN')}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Deductions */}
                            <div>
                                <h4 className="font-semibold text-red-600 mb-2">Deductions</h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-[var(--foreground-muted)]">Provident Fund</span>
                                        <span className="font-medium text-red-600">-₹{selectedSlip.deductions.pf.toLocaleString('en-IN')}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[var(--foreground-muted)]">Income Tax</span>
                                        <span className="font-medium text-red-600">-₹{selectedSlip.deductions.tax.toLocaleString('en-IN')}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[var(--foreground-muted)]">Insurance</span>
                                        <span className="font-medium text-red-600">-₹{selectedSlip.deductions.insurance.toLocaleString('en-IN')}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-[var(--border)]">
                                <div className="flex justify-between items-center">
                                    <span className="font-display text-lg font-semibold">Net Salary</span>
                                    <span className="font-display text-2xl font-bold text-emerald-600">
                                        ₹{selectedSlip.netSalary.toLocaleString('en-IN')}
                                    </span>
                                </div>
                            </div>

                            <div className="flex gap-2 pt-2">
                                <Button
                                    className="flex-1 gap-2 bg-emerald-500 hover:bg-emerald-600 text-white"
                                    onClick={() => alert(`Downloading...`)}
                                >
                                    <Download className="w-4 h-4" />
                                    Download PDF
                                </Button>
                                <Button variant="secondary" className="gap-2" onClick={() => window.print()}>
                                    <Printer className="w-4 h-4" />
                                    Print
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}
