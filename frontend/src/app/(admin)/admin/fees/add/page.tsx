'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
    IndianRupee,
    ChevronRight,
    ArrowLeft,
    Search,
    Users,
    Layers,
    Calendar,
    CheckCircle2,
    AlertCircle,
    Plus,
    Minus,
    BookOpen,
    Info
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"

export default function FeeAllocationPage() {
    const [allocationType, setAllocationType] = useState('individual')
    const [isProcessing, setIsProcessing] = useState(false)
    const [selectedStudents, setSelectedStudents] = useState<any[]>([])
    const [searchQuery, setSearchQuery] = useState('')

    const handleAddStudent = () => {
        if (searchQuery.length > 3) {
            setSelectedStudents(prev => [...prev, {
                id: '2026' + Math.floor(Math.random() * 9000),
                name: searchQuery,
                class: 'X-A'
            }])
            setSearchQuery('')
            toast.success('Student Added to Queue')
        }
    }

    const handleAllocate = () => {
        setIsProcessing(true)
        setTimeout(() => {
            setIsProcessing(false)
            toast.success('Fees Allocated Successfully', {
                description: 'Digital ledgers have been updated for all selected students.'
            })
            setSelectedStudents([])
        }, 1500)
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Link href="/admin/fees" className="text-sm font-medium text-[var(--foreground-secondary)] hover:text-indigo-600 transition-colors">Fees Hub</Link>
                        <ChevronRight className="w-4 h-4 text-[var(--foreground-muted)]" />
                        <span className="text-sm font-bold text-indigo-600 uppercase tracking-widest">Allocation Workspace</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/admin/fees">
                            <Button variant="ghost" className="rounded-xl h-10 w-10 p-0 hover:bg-[var(--background-secondary)] text-[var(--foreground-muted)]">
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                        </Link>
                        <h1 className="text-3xl font-black tracking-tight text-[var(--foreground)]">Assign New Dues</h1>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Configuration Form */}
                <Card className="lg:col-span-2 border-none bg-[var(--card-background)] rounded-[2.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-none p-8">
                    <Tabs defaultValue="individual" className="w-full" onValueChange={setAllocationType}>
                        <TabsList className="bg-[var(--background-secondary)] p-1.5 rounded-2xl h-14 mb-8">
                            <TabsTrigger value="individual" className="rounded-xl font-bold data-[state=active]:bg-[var(--card-background)] data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm px-8">
                                <Users className="w-4 h-4 mr-2" />
                                Individual Students
                            </TabsTrigger>
                            <TabsTrigger value="bulk" className="rounded-xl font-bold data-[state=active]:bg-[var(--card-background)] data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm px-8">
                                <Layers className="w-4 h-4 mr-2" />
                                Bulk Class Assignment
                            </TabsTrigger>
                        </TabsList>

                        <div className="space-y-8">
                            {allocationType === 'individual' ? (
                                <div className="space-y-4">
                                    <label className="text-xs font-black uppercase tracking-[0.2em] text-[var(--foreground-muted)]">Select Students</label>
                                    <div className="flex gap-3">
                                        <div className="relative flex-1">
                                            <Input
                                                placeholder="Search by Name or Admission No..."
                                                className="h-12 rounded-2xl bg-[var(--background-secondary)] border-[var(--border)] pl-10 font-bold"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                            />
                                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--foreground-muted)]" />
                                        </div>
                                        <Button onClick={handleAddStudent} className="h-12 rounded-2xl px-6 bg-slate-900 dark:bg-slate-700 font-bold">Add to List</Button>
                                    </div>

                                    {selectedStudents.length > 0 && (
                                        <div className="flex flex-wrap gap-2 pt-2">
                                            {selectedStudents.map((s, i) => (
                                                <Badge key={i} className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 border-none font-bold py-2 px-4 rounded-xl flex items-center gap-2">
                                                    {s.name} ({s.class})
                                                    <button onClick={() => setSelectedStudents(prev => prev.filter((_, idx) => idx !== i))}>
                                                        <Minus className="w-3 h-3 hover:text-rose-500" />
                                                    </button>
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <label className="text-xs font-black uppercase tracking-[0.2em] text-[var(--foreground-muted)]">Target Grade</label>
                                        <Select>
                                            <SelectTrigger className="h-12 rounded-2xl bg-[var(--background-secondary)] border-[var(--border)] font-bold">
                                                <SelectValue placeholder="Select Class" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-2xl">
                                                <SelectItem value="10">Class 10 (All Sections)</SelectItem>
                                                <SelectItem value="11">Class 11 SCI</SelectItem>
                                                <SelectItem value="12">Class 12 SCI</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-xs font-black uppercase tracking-[0.2em] text-[var(--foreground-muted)]">Academic Year</label>
                                        <Select defaultValue="2026">
                                            <SelectTrigger className="h-12 rounded-2xl bg-[var(--background-secondary)] border-[var(--border)] font-bold">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-2xl">
                                                <SelectItem value="2026">2026 - 2027</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                                <div className="space-y-4">
                                    <label className="text-xs font-black uppercase tracking-[0.2em] text-[var(--foreground-muted)]">Fee Category</label>
                                    <Select>
                                        <SelectTrigger className="h-14 rounded-[1.5rem] bg-indigo-50/50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-800/30 text-indigo-900 dark:text-indigo-300 font-black text-lg px-6">
                                            <SelectValue placeholder="CHOOSE FEE TYPE" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-2xl">
                                            <SelectItem value="tuition">Tuition Fee (Q4)</SelectItem>
                                            <SelectItem value="sports">Annual Sports Day Fee</SelectItem>
                                            <SelectItem value="lab">Science Lab Charges</SelectItem>
                                            <SelectItem value="fine">Disciplinary Fine</SelectItem>
                                            <SelectItem value="misc">Miscellaneous Activity</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-xs font-black uppercase tracking-[0.2em] text-[var(--foreground-muted)]">Amount to Allocate (₹)</label>
                                    <div className="relative">
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-[var(--foreground-muted)]">₹</div>
                                        <Input
                                            type="number"
                                            placeholder="0.00"
                                            className="h-14 rounded-[1.5rem] bg-[var(--background-secondary)] border-[var(--border)] pl-12 text-2xl font-black text-[var(--foreground)]"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-xs font-black uppercase tracking-[0.2em] text-[var(--foreground-muted)]">Assignment Description & Terms</label>
                                <Textarea
                                    placeholder="Enter reasoning or breakdown for this fee... This will be visible on the parent receipt."
                                    className="rounded-[2rem] bg-[var(--background-secondary)] border-[var(--border)] p-6 font-medium min-h-[120px]"
                                />
                            </div>

                            <div className="flex items-center gap-4 p-6 bg-amber-50 dark:bg-amber-900/20 rounded-3xl border border-amber-100 dark:border-amber-800/30">
                                <Info className="w-5 h-5 text-amber-600" />
                                <p className="text-sm font-bold text-amber-800 dark:text-amber-300">
                                    <span className="font-black">Note:</span> This allocation will immediately appear as "Due" on the student's ledger and parent portal.
                                </p>
                            </div>
                        </div>
                    </Tabs>
                </Card>

                {/* Right: Summary & Action */}
                <div className="space-y-8">
                    <Card className="border-none bg-slate-900 text-white rounded-[2.5rem] p-8 shadow-2xl shadow-indigo-950/20 flex flex-col justify-between min-h-[400px]">
                        <div>
                            <h3 className="text-2xl font-black mb-1">Allocation Summary</h3>
                            <p className="text-indigo-200/50 text-xs font-bold uppercase tracking-widest mt-1">Verify before finalizing</p>
                        </div>

                        <div className="space-y-6">
                            <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-bold text-indigo-200">Total Students</span>
                                    <span className="text-xl font-black">{allocationType === 'individual' ? selectedStudents.length : '142'}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-bold text-indigo-200">Per Head Charge</span>
                                    <span className="text-xl font-black">₹0.00</span>
                                </div>
                                <div className="h-px bg-white/10 w-full" />
                                <div className="flex justify-between items-center">
                                    <span className="text-base font-black">Gross Receivable</span>
                                    <span className="text-3xl font-black text-indigo-400 tracking-tighter">₹0.00</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-200/50 ml-1">
                                    <Calendar className="w-3 h-3" />
                                    Posting Date: Feb 01, 2026
                                </div>
                                <Button
                                    onClick={handleAllocate}
                                    disabled={isProcessing}
                                    className="w-full h-16 bg-indigo-500 hover:bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl transform active:scale-95 transition-all"
                                >
                                    {isProcessing ? 'Synchronizing Ledgers...' : 'Confirm Allocation'}
                                </Button>
                            </div>
                        </div>
                    </Card>

                    <Card className="border-none bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/30 rounded-[2.5rem] p-8 relative overflow-hidden group">
                        <div className="relative z-10 space-y-3">
                            <h4 className="text-lg font-black text-indigo-900 dark:text-indigo-200">Need a New Category?</h4>
                            <p className="text-sm font-medium text-indigo-700/70 dark:text-indigo-400">If the fee type you need isn't listed, you can define it in the global architecture.</p>
                            <Link href="/admin/fees/structure">
                                <Button variant="link" className="p-0 h-auto text-indigo-600 font-black uppercase tracking-widest text-[10px] hover:text-indigo-900 dark:hover:text-indigo-300 transition-colors">
                                    Open Fee Structure Hub
                                    <ChevronRight className="w-3 h-3 ml-1" />
                                </Button>
                            </Link>
                        </div>
                        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-125 transition-transform duration-700">
                            <BookOpen className="w-20 h-20 text-indigo-600" />
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
