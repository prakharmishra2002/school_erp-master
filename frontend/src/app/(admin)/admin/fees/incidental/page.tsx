'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
    IndianRupee,
    Plus,
    ChevronLeft,
    Trash2,
    Edit2,
    Search,
    BookOpen,
    CreditCard,
    AlertTriangle,
    Filter
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface IncidentalCharge {
    id: string
    name: string
    category: 'Fine' | 'Service' | 'Event' | 'Asset'
    amount: number
    frequency: 'One-Time' | 'Per Request' | 'Recurring'
}

const initialCharges: IncidentalCharge[] = [
    { id: '1', name: 'Late Payment Fine', category: 'Fine', amount: 50, frequency: 'One-Time' },
    { id: '2', name: 'Library Membership', category: 'Service', amount: 800, frequency: 'Recurring' },
    { id: '3', name: 'Identity Card', category: 'Asset', amount: 200, frequency: 'Per Request' },
    { id: '4', name: 'Lab Breakage', category: 'Fine', amount: 0, frequency: 'Per Request' },
    { id: '5', name: 'Annual Sports Day', category: 'Event', amount: 1500, frequency: 'One-Time' },
    { id: '6', name: 'TC Issuance', category: 'Service', amount: 500, frequency: 'Per Request' },
]

export default function IncidentalChargesPage() {
    const [charges, setCharges] = useState<IncidentalCharge[]>(initialCharges)
    const [search, setSearch] = useState('')

    const handleAdd = () => {
        toast.info('Opening definition wizard...')
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Link href="/admin/fees" className="text-sm font-medium text-[var(--foreground-secondary)] hover:text-indigo-600 transition-colors flex items-center gap-1">
                            <ChevronLeft className="w-4 h-4" />
                            Fees Control
                        </Link>
                    </div>
                    <h1 className="text-3xl font-black tracking-tight text-[var(--foreground)]">Incidental Charges Manager</h1>
                    <p className="text-[var(--foreground-secondary)] mt-1 font-medium">Manage non-recurring liabilities, fines, and optional school services.</p>
                </div>

                <div className="flex items-center gap-3">
                    <Button onClick={handleAdd} className="h-12 bg-indigo-600 hover:bg-indigo-700 rounded-2xl px-8 font-bold text-white shadow-xl shadow-indigo-600/20 transform hover:scale-105 transition-all">
                        <Plus className="w-5 h-5 mr-2" />
                        Define New Head
                    </Button>
                </div>
            </div>

            {/* Insight Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Active Heads', value: charges.length.toString(), icon: BookOpen, color: 'indigo' },
                    { label: 'Avg Collection/Mo', value: '₹14,500', icon: IndianRupee, color: 'emerald' },
                    { label: 'Pending Fines', value: '₹2,800', icon: AlertTriangle, color: 'amber' },
                ].map((item, i) => (
                    <Card key={i} className="border-none bg-[var(--card-background)] rounded-3xl shadow-lg shadow-slate-200/40 dark:shadow-none p-6 flex items-center gap-4">
                        <div className={cn(
                            "w-12 h-12 rounded-2xl flex items-center justify-center",
                            item.color === 'indigo' ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30" :
                                item.color === 'emerald' ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30" :
                                    "bg-amber-50 text-amber-600 dark:bg-amber-900/30"
                        )}>
                            <item.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)]">{item.label}</p>
                            <p className="text-xl font-black text-[var(--foreground)]">{item.value}</p>
                        </div>
                    </Card>
                ))}
            </div>

            <Card className="border-none bg-[var(--card-background)] rounded-[2.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-none overflow-hidden">
                <CardHeader className="p-8 border-b border-[var(--border)]">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <CardTitle className="text-xl font-black text-[var(--foreground)]">Ledger Categories</CardTitle>
                            <CardDescription className="text-[var(--foreground-secondary)] font-medium">Fine-tune the pricing for auxiliary items.</CardDescription>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--foreground-muted)]" />
                                <Input
                                    placeholder="Search charges..."
                                    className="h-11 pl-10 rounded-xl bg-[var(--background-secondary)] border-transparent w-[250px] font-medium"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <Button variant="outline" className="rounded-xl border-[var(--border)] h-11 px-4">
                                <Filter className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-[var(--border)]">
                        {charges.filter(c => c.name.toLowerCase().includes(search.toLowerCase())).map((charge) => (
                            <div key={charge.id} className="p-6 md:p-8 hover:bg-[var(--background-secondary)]/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 group">
                                <div className="flex items-center gap-4">
                                    <div className={cn(
                                        "w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg",
                                        charge.category === 'Fine' ? "bg-rose-50 text-rose-600 dark:bg-rose-900/40" :
                                            charge.category === 'Service' ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/40" :
                                                charge.category === 'Asset' ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/40" :
                                                    "bg-amber-50 text-amber-600 dark:bg-amber-900/40"
                                    )}>
                                        {charge.category === 'Fine' ? <AlertTriangle className="w-7 h-7" /> : <CreditCard className="w-7 h-7" />}
                                    </div>
                                    <div>
                                        <p className="font-black text-[var(--foreground)] text-lg leading-tight">{charge.name}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Badge variant="outline" className="text-[8px] font-black border-none bg-[var(--background-secondary)] text-[var(--foreground-muted)] uppercase tracking-widest px-2">
                                                {charge.category}
                                            </Badge>
                                            <span className="w-1 h-1 rounded-full bg-[var(--border)]" />
                                            <span className="text-[10px] font-bold text-[var(--foreground-muted)]">{charge.frequency}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between md:justify-end gap-12">
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-[var(--foreground-muted)] uppercase tracking-widest">Base Amount</p>
                                        <p className="text-xl font-black text-indigo-600">
                                            {charge.amount > 0 ? `₹${charge.amount}` : 'Variable'}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-[var(--foreground-muted)] hover:bg-[var(--card-background)] hover:text-indigo-600 transition-colors">
                                            <Edit2 className="w-5 h-5" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-[var(--foreground-muted)] hover:bg-rose-50 hover:text-rose-600 transition-colors">
                                            <Trash2 className="w-5 h-5" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="border-none bg-indigo-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
                    <div className="relative z-10">
                        <h4 className="text-xl font-black mb-1">Global Waiver Logic</h4>
                        <p className="text-indigo-100 text-xs font-medium mb-6 leading-relaxed">Define rules for automatic waiver of incidental charges based on student categories or merit status.</p>
                        <Button className="w-full h-12 bg-white text-indigo-700 hover:bg-slate-50 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all">
                            Configure Waiver Rules
                        </Button>
                    </div>
                    <BookOpen className="absolute -bottom-10 -right-10 w-48 h-48 opacity-10 group-hover:opacity-20 transition-opacity rotate-12" />
                </Card>

                <Card className="border-none bg-[var(--card-background)] rounded-[2.5rem] shadow-xl shadow-slate-200/40 dark:shadow-none p-8 flex flex-col justify-center text-center gap-4">
                    <p className="text-sm font-bold text-[var(--foreground-secondary)] leading-relaxed">
                        Need to charge something not on this list? <br />
                        Use the "Custom Ledger Entry" during fee deposit.
                    </p>
                    <Link href="/admin/fees/deposit" className="text-xs font-black text-indigo-600 hover:underline uppercase tracking-widest">
                        Go to Deposit Desk
                    </Link>
                </Card>
            </div>
        </div>
    )
}
