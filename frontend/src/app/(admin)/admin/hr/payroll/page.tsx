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
    Users,
    Briefcase,
    TrendingUp,
    Wallet,
    Calendar,
    Search,
    MoreVertical,
    CheckCircle2,
    Clock,
    ShieldCheck,
    Settings2,
    Settings,
    FileText,
} from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
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

interface SalarySlab {
    designation: string
    baseSalary: number
    allowances: number
    deductions: number
    netPay: number
}

const initialSlabs: SalarySlab[] = [
    { designation: 'Senior Teacher', baseSalary: 35000, allowances: 5000, deductions: 2500, netPay: 37500 },
    { designation: 'HOD - Department', baseSalary: 45000, allowances: 8000, deductions: 3500, netPay: 49500 },
    { designation: 'Primary Teacher', baseSalary: 25000, allowances: 3000, deductions: 1500, netPay: 26500 },
    { designation: 'Admin Staff', baseSalary: 22000, allowances: 2000, deductions: 1200, netPay: 22800 },
]

export default function PayrollManagementPage() {
    const [slabs, setSlabs] = useState<SalarySlab[]>(initialSlabs)
    const [payoutStatus, setPayoutStatus] = useState<'pending' | 'processing' | 'completed'>('pending')
    const [isLeaveRulesOpen, setIsLeaveRulesOpen] = useState(false)

    const executePayroll = () => {
        setPayoutStatus('processing')
        toast.info('Initiating bulk payroll processing...', {
            description: 'Verifying attendance and leave deductions for 84 staff members.'
        })

        setTimeout(() => {
            setPayoutStatus('completed')
            toast.success('Payroll Processed Successfully', {
                description: 'Salary slips generated and bank transfer file ready for download.'
            })
        }, 3000)
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Link href="/admin/teachers" className="text-sm font-medium text-[var(--foreground-secondary)] hover:text-indigo-600 transition-colors">Staff Directory</Link>
                        <ChevronRight className="w-4 h-4 text-[var(--foreground-muted)]" />
                        <span className="text-sm font-bold text-indigo-600 uppercase tracking-widest">HR & Payroll</span>
                    </div>
                    <h1 className="text-3xl font-black tracking-tight text-[var(--foreground)]">Payroll Engine</h1>
                    <p className="text-[var(--foreground-secondary)] mt-1 font-medium">Manage salary structures, deductions, and monthly payout disbursements.</p>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        className="h-12 rounded-2xl border-[var(--border)] font-bold px-6"
                        onClick={() => setIsLeaveRulesOpen(true)}
                    >
                        <Settings className="w-4 h-4 mr-2" />
                        Leave Rules
                    </Button>
                    <Button
                        onClick={executePayroll}
                        disabled={payoutStatus !== 'pending'}
                        className={cn(
                            "h-12 rounded-2xl px-8 font-bold text-white shadow-xl transition-all h-14",
                            payoutStatus === 'completed' ? "bg-emerald-600" : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20"
                        )}
                    >
                        <Wallet className="w-5 h-5 mr-2" />
                        {payoutStatus === 'pending' ? 'Release Monthly Payout' :
                            payoutStatus === 'processing' ? 'Processing Salaries...' : 'Payroll Completed'}
                    </Button>
                </div>
            </div>

            {/* Monthly Analytics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Payroll', value: '₹18.4L', change: '+₹1.2L', icon: IndianRupee, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-900/30' },
                    { label: 'Staff Count', value: '84', change: '+2 New', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/30' },
                    { label: 'Total Deductions', value: '₹1.8L', change: '85% Attendance', icon: TrendingUp, color: 'text-rose-600', bg: 'bg-rose-50 dark:bg-rose-900/30' },
                    { label: 'Bonus/Incentives', value: '₹45,000', change: 'Anniv. Bonus', icon: ShieldCheck, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/30' },
                ].map((stat, i) => (
                    <Card key={i} className="border-none bg-[var(--card-background)] rounded-[2rem] shadow-xl shadow-slate-200/40 dark:shadow-none p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", stat.bg, stat.color)}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <Badge variant="outline" className="rounded-lg text-[9px] font-black">{stat.change}</Badge>
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)] mb-1">{stat.label}</p>
                        <p className="text-2xl font-black text-[var(--foreground)] tracking-tight">{stat.value}</p>
                    </Card>
                ))}
            </div>

            {/* Salary Slabs Configuration */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 border-none bg-[var(--card-background)] rounded-[2.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-none overflow-hidden">
                    <CardHeader className="p-8 border-b border-[var(--border)] flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-xl font-bold text-[var(--foreground)]">Designation Slabs</CardTitle>
                            <CardDescription>Base salary and standard allowances per role.</CardDescription>
                        </div>
                        <Button variant="outline" className="rounded-xl border-[var(--border)] font-bold h-10 px-4">
                            <Plus className="w-4 h-4 mr-2" />
                            New Slab
                        </Button>
                    </CardHeader>
                    <div className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-[var(--background-secondary)]/50">
                                    <TableHead className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">Designation</TableHead>
                                    <TableHead className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-center">Base (₹)</TableHead>
                                    <TableHead className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-center">Allowances</TableHead>
                                    <TableHead className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-center">PF/Tax</TableHead>
                                    <TableHead className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-right">Net Payout</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {slabs.map((slab, i) => (
                                    <TableRow key={i} className="group hover:bg-[var(--background-secondary)]/50 transition-colors">
                                        <TableCell className="px-8 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 flex items-center justify-center">
                                                    <Briefcase className="w-4 h-4" />
                                                </div>
                                                <span className="font-bold text-[var(--foreground)]">{slab.designation}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-8 py-5 text-center font-bold text-[var(--foreground-secondary)]">₹{slab.baseSalary.toLocaleString()}</TableCell>
                                        <TableCell className="px-8 py-5 text-center font-bold text-emerald-600">+₹{slab.allowances.toLocaleString()}</TableCell>
                                        <TableCell className="px-8 py-5 text-center font-bold text-rose-500">-₹{slab.deductions.toLocaleString()}</TableCell>
                                        <TableCell className="px-8 py-5 text-right">
                                            <Badge className="bg-indigo-600 text-white border-none font-black px-3 py-1.5 rounded-xl">
                                                ₹{slab.netPay.toLocaleString()}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </Card>

                <div className="space-y-8">
                    {/* Quick Tools */}
                    <Card className="border-none bg-indigo-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group shadow-2xl shadow-indigo-900/40">
                        <div className="relative z-10 space-y-6">
                            <h4 className="text-xl font-black">Payroll Settings</h4>
                            <div className="space-y-4">
                                {[
                                    { label: 'PF Contribution', value: '12%', status: 'active' },
                                    { label: 'Professional Tax', value: '₹200/mo', status: 'active' },
                                    { label: 'Gratuity Year', value: '5 Years', status: 'fixed' },
                                ].map((item, i) => (
                                    <div key={i} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/10">
                                        <span className="text-xs font-bold text-indigo-200">{item.label}</span>
                                        <span className="text-sm font-black">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                            <Button className="w-full h-12 bg-white text-indigo-900 hover:bg-indigo-50 rounded-xl font-bold shadow-xl">
                                Edit Global Structure
                            </Button>
                        </div>
                        <div className="absolute top-0 right-0 p-8 opacity-5 -rotate-12 pointer-events-none">
                            <Settings2 className="w-32 h-32" />
                        </div>
                    </Card>

                    {/* Pending Approvals */}
                    <Card className="border-none bg-[var(--card-background)] rounded-[2.5rem] shadow-xl shadow-slate-200/40 dark:shadow-none p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h4 className="text-lg font-black text-[var(--foreground)]">Payout Tasks</h4>
                            <Badge className="bg-amber-100 dark:bg-amber-900/30 text-amber-600 border-none font-black text-[9px] px-1.5">4 Tasks</Badge>
                        </div>
                        <div className="space-y-4">
                            {[
                                { task: 'Verify OT Claims', count: 12, due: 'Today' },
                                { task: 'Approve Reimbursements', count: 5, due: 'Tomorrow' },
                                { task: 'PF Withdrawal Requests', count: 2, due: '25th' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between group cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                        <span className="text-sm font-bold text-[var(--foreground-secondary)] group-hover:text-amber-600 transition-colors">{item.task}</span>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-[var(--foreground-muted)] group-hover:translate-x-1 transition-transform" />
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>

            <Dialog open={isLeaveRulesOpen} onOpenChange={setIsLeaveRulesOpen}>
                <DialogContent className="sm:max-w-[550px] rounded-[2.5rem] border-[var(--border)] p-0 overflow-hidden shadow-2xl bg-[var(--card-background)]">
                    <div className="bg-indigo-900 p-8 text-white relative overflow-hidden">
                        <div className="relative z-10">
                            <DialogTitle className="text-2xl font-black mb-1">Global Leave Policies</DialogTitle>
                            <DialogDescription className="text-indigo-200 font-medium">Define annual leave quotas and deduction rules.</DialogDescription>
                        </div>
                        <FileText className="absolute top-0 right-0 p-8 w-32 h-32 text-white/10 rotate-12" />
                    </div>
                    <div className="p-8 space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { label: 'Sick Leave (Paid)', value: '12' },
                                { label: 'Casual Leave', value: '15' },
                                { label: 'Earned Leave', value: '20' },
                                { label: 'Maternity Leave', value: '180' },
                            ].map((rule, i) => (
                                <div key={i} className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)] ml-1">{rule.label}</label>
                                    <div className="relative">
                                        <Input defaultValue={rule.value} className="h-12 rounded-2xl bg-[var(--background-secondary)] border-[var(--border)] font-bold pr-12" />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-[var(--foreground-muted)]">DAYS</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl border border-indigo-100 dark:border-indigo-800">
                            <h5 className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-2">Deduction Rule</h5>
                            <p className="text-xs font-medium text-[var(--foreground-secondary)] italic">"Leaves exceeding the specified quota will trigger a daily wage deduction based on the base salary calculation."</p>
                        </div>
                        <Button
                            className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-600/20 text-white"
                            onClick={() => {
                                setIsLeaveRulesOpen(false)
                                toast.success('Leave policies updated successfully')
                            }}
                        >
                            Update Policies
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
