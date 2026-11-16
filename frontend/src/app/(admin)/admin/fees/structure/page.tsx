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
    ChevronRight,
    Settings2,
    Trash2,
    Edit2,
    Save,
    Building2,
    Layers,
    BookOpen
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
import { toast } from 'sonner'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

interface FeeItem {
    id: number
    name: string
    amount: number
    frequency: 'Monthly' | 'Quarterly' | 'Yearly' | 'One-Time'
}

interface ClassFeeStructure {
    grade: string
    baseTuition: number
    transportBase: number
    admissionFee: number
    examFees: number
}

const initialGradeFees: ClassFeeStructure[] = [
    { grade: 'Class 8', baseTuition: 4500, transportBase: 1200, admissionFee: 15000, examFees: 2000 },
    { grade: 'Class 9', baseTuition: 5000, transportBase: 1200, admissionFee: 15000, examFees: 2500 },
    { grade: 'Class 10', baseTuition: 5500, transportBase: 1200, admissionFee: 15000, examFees: 3000 },
    { grade: 'Class 11-SCI', baseTuition: 7500, transportBase: 1500, admissionFee: 25000, examFees: 5000 },
]

export default function FeeStructurePage() {
    const [fees, setFees] = useState<ClassFeeStructure[]>(initialGradeFees)
    const [isSaving, setIsSaving] = useState(false)

    const handleSave = () => {
        setIsSaving(true)
        setTimeout(() => {
            setIsSaving(false)
            toast.success('Fee Structure Updated', {
                description: 'Changes applied to the current academic session.'
            })
        }, 1000)
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Link href="/admin/fees" className="text-sm font-medium text-[var(--foreground-secondary)] hover:text-indigo-600 transition-colors">Fees Control</Link>
                        <ChevronRight className="w-4 h-4 text-[var(--foreground-muted)]" />
                        <span className="text-sm font-bold text-indigo-600">Fee Structure</span>
                    </div>
                    <h1 className="text-3xl font-black tracking-tight text-[var(--foreground)]">Fee Architecture</h1>
                    <p className="text-[var(--foreground-secondary)] mt-1 font-medium">Configure financial benchmarks for each grade level and session.</p>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="h-12 bg-indigo-600 hover:bg-indigo-700 rounded-2xl px-8 font-bold text-white shadow-xl shadow-indigo-600/20 transform hover:scale-105 transition-all"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        {isSaving ? 'Synchronizing...' : 'Save Configuration'}
                    </Button>
                </div>
            </div>

            {/* Quick Config Tabs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Session Period', value: '2026-2027', icon: Settings2 },
                    { label: 'Base Currency', value: 'INR (₹)', icon: IndianRupee },
                    { label: 'Taxation Module', value: 'GST 18% (Applied)', icon: Layers },
                ].map((item, i) => (
                    <Card key={i} className="border-none bg-[var(--card-background)] rounded-3xl shadow-lg shadow-slate-200/40 dark:shadow-none p-6 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-[var(--background-secondary)] flex items-center justify-center text-[var(--foreground-muted)]">
                            <item.icon className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)]">{item.label}</p>
                            <p className="text-lg font-bold text-[var(--foreground)]">{item.value}</p>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Structure Grid */}
            <Card className="border-none bg-[var(--card-background)] rounded-[2.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-none overflow-hidden">
                <CardHeader className="p-10 pb-4 border-b border-[var(--border)]">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-2xl font-black text-[var(--foreground)]">Grade-Wise Fee Benchmarks</CardTitle>
                            <CardDescription className="font-bold text-[var(--foreground-muted)] uppercase text-[10px] tracking-widest mt-1">Configuring Monthly & Annual Liabilities</CardDescription>
                        </div>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="rounded-xl border-[var(--border)] font-bold h-10 px-4 transition-all hover:bg-[var(--background-secondary)]">
                                    <Plus className="w-3.5 h-3.5 mr-1.5" />
                                    Create New Fee Head
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px] rounded-[2rem] border-[var(--border)] bg-[var(--card-background)] shadow-2xl p-0 overflow-hidden">
                                <div className="bg-indigo-600 p-8 text-white relative overflow-hidden">
                                    <div className="relative z-10">
                                        <DialogTitle className="text-2xl font-black mb-1">Global Fee Definition</DialogTitle>
                                        <DialogDescription className="text-indigo-100 font-medium">Create a new ledger category for school billing.</DialogDescription>
                                    </div>
                                    <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
                                        <Layers className="w-32 h-32 text-white" />
                                    </div>
                                </div>

                                <div className="p-8 space-y-6">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)] ml-1">Fee Category Name</label>
                                            <Input placeholder="e.g. Science Fair Fee, Library Fine" className="h-12 rounded-2xl bg-[var(--background-secondary)] border-[var(--border)] font-bold" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)] ml-1">Frequency</label>
                                                <Select defaultValue="one-time">
                                                    <SelectTrigger className="h-12 rounded-2xl bg-[var(--background-secondary)] border-[var(--border)] font-bold">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent className="rounded-2xl">
                                                        <SelectItem value="one-time">One-Time</SelectItem>
                                                        <SelectItem value="monthly">Monthly</SelectItem>
                                                        <SelectItem value="quarterly">Quarterly</SelectItem>
                                                        <SelectItem value="annual">Annual</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)] ml-1">Default Amount (₹)</label>
                                                <Input type="number" placeholder="0.00" className="h-12 rounded-2xl bg-[var(--background-secondary)] border-[var(--border)] font-bold" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)] ml-1">Internal Description</label>
                                            <Textarea placeholder="Define purpose of this fee..." className="rounded-2xl bg-[var(--background-secondary)] border-[var(--border)] font-medium" />
                                        </div>
                                    </div>
                                    <Button onClick={() => toast.success('New Fee Head Defined')} className="w-full h-14 bg-slate-900 hover:bg-black text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all">
                                        Save Fee Category
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardHeader>
                <div className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-[var(--background-secondary)]/50 hover:bg-[var(--background-secondary)]/50">
                                <TableHead className="px-10 py-6 text-[10px] font-black uppercase tracking-widest">Grade Level</TableHead>
                                <TableHead className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-center">Monthly Tuition (₹)</TableHead>
                                <TableHead className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-center">Admission Fee (₹)</TableHead>
                                <TableHead className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-center">Exam Charges (₹)</TableHead>
                                <TableHead className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-center">Transport Slab</TableHead>
                                <TableHead className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {fees.map((grade) => (
                                <TableRow key={grade.grade} className="group hover:bg-indigo-50/10 dark:hover:bg-indigo-900/20 border-b border-[var(--border)] transition-all">
                                    <TableCell className="px-10 py-6 font-black text-[var(--foreground)]">{grade.grade}</TableCell>
                                    <TableCell className="px-10 py-6 text-center">
                                        <Input
                                            defaultValue={grade.baseTuition}
                                            className="w-32 mx-auto h-10 rounded-xl bg-[var(--background-secondary)] border-transparent focus:bg-[var(--card-background)] focus:border-indigo-500 font-bold text-center"
                                        />
                                    </TableCell>
                                    <TableCell className="px-10 py-6 text-center">
                                        <Input
                                            defaultValue={grade.admissionFee}
                                            className="w-32 mx-auto h-10 rounded-xl bg-[var(--background-secondary)] border-transparent focus:bg-[var(--card-background)] focus:border-indigo-500 font-bold text-center"
                                        />
                                    </TableCell>
                                    <TableCell className="px-10 py-6 text-center">
                                        <Input
                                            defaultValue={grade.examFees}
                                            className="w-32 mx-auto h-10 rounded-xl bg-[var(--background-secondary)] border-transparent focus:bg-[var(--card-background)] focus:border-indigo-500 font-bold text-center"
                                        />
                                    </TableCell>
                                    <TableCell className="px-10 py-6 text-center">
                                        <Badge className="rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 border-none font-bold text-[10px] px-3 py-1">
                                            ₹1,200 Base
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="px-10 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button variant="ghost" size="icon" className="rounded-xl h-9 w-9 text-[var(--foreground-muted)] hover:text-indigo-600 hover:bg-[var(--card-background)]">
                                                <Edit2 className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="rounded-xl h-9 w-9 text-[var(--foreground-muted)] hover:text-rose-600 hover:bg-[var(--card-background)]">
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

            {/* Additional Charges Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="border-none bg-[var(--card-background)] rounded-[2.5rem] shadow-xl shadow-slate-200/40 dark:shadow-none p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-black text-[var(--foreground)] flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600">
                                <BookOpen className="w-5 h-5" />
                            </div>
                            Incidental Charges
                        </h3>
                        <Link href="/admin/fees/incidental">
                            <Button variant="ghost" className="text-xs font-black text-indigo-600 hover:bg-indigo-50 rounded-lg">Manage All</Button>
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {[
                            { name: 'Late Payment Fine', detail: 'Per day after 10th of month', amount: '₹50/day' },
                            { name: 'Library Membership', detail: 'Annual one-time charge', amount: '₹800' },
                            { name: 'Identity Card', detail: 'New/Replacement charge', amount: '₹200' },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-[var(--background-secondary)]/50 border border-[var(--border)] group hover:border-indigo-200 dark:hover:border-indigo-600 transition-all cursor-pointer">
                                <div>
                                    <p className="font-bold text-[var(--foreground)]">{item.name}</p>
                                    <p className="text-[10px] font-bold text-[var(--foreground-muted)] uppercase tracking-widest">{item.detail}</p>
                                </div>
                                <p className="text-sm font-black text-indigo-600">{item.amount}</p>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card className="border-none bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2.5rem] shadow-xl shadow-indigo-500/20 p-8 text-white relative overflow-hidden group">
                    <div className="relative z-10 space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md">
                                <Building2 className="w-6 h-6" />
                            </div>
                            <h4 className="text-xl font-black leading-tight">Global Fee Logic<br /><span className="text-indigo-200 text-sm font-medium">Session Policies</span></h4>
                        </div>
                        <p className="text-indigo-100/70 text-sm font-medium leading-relaxed">
                            Configure rounding rules, tax application, and automatic penalty triggers. These settings affect the entire financial module.
                        </p>
                        <Button className="w-full h-14 bg-white text-indigo-700 hover:bg-slate-50 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl transform group-hover:scale-[1.02] transition-all">
                            Global Calculation Rules
                        </Button>
                    </div>
                    {/* Decorative element */}
                    <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/5 rounded-full" />
                </Card>
            </div>
        </div>
    )
}
