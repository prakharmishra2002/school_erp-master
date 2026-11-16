'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
    Sparkles,
    Plus,
    Search,
    BookOpen,
    Zap,
    FileText,
    Clock,
    CheckCircle2,
    Settings2,
    MoreVertical,
    Target
} from 'lucide-react'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'
import { toast } from 'sonner'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

// Performance Tip: Define static structures outside the component to avoid re-allocation
const ASSESSMENT_TYPES = [
    { id: 'surprise', label: 'Surprise Test', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/30' },
    { id: 'class', label: 'Class Test', icon: BookOpen, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-900/30' },
    { id: 'term', label: 'Term Exam', icon: FileText, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/30' },
    { id: 'viva', label: 'Viva Voce', icon: Target, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/30' },
]

const MOCK_CURRICULUM = [
    { id: 1, subject: 'Mathematics', class: 'Class 10-A', type: 'class', weightage: '10%', tests: 4, status: 'Active' },
    { id: 2, subject: 'Physics', class: 'Class 12-B', type: 'term', weightage: '40%', tests: 2, status: 'Review' },
    { id: 3, subject: 'Literature', class: 'Class 9-C', type: 'surprise', weightage: '5%', tests: 6, status: 'Draft' },
]

export default function CurriculumPage() {
    const [searchQuery, setSearchQuery] = useState('')

    // Standardized Dummy Actions (Performance: Defined once)
    const handleAction = (type: string, name: string) => {
        toast.info(`Action Triggered: ${type}`, {
            description: `Drafting ${name} configuration in local cache. Synchronizing with cloud...`
        })
    }

    // Performance: Memoize filtered list to avoid re-renders on every scroll/interaction
    const filteredCurriculum = useMemo(() => {
        return MOCK_CURRICULUM.filter(item =>
            item.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.class.toLowerCase().includes(searchQuery.toLowerCase())
        )
    }, [searchQuery])

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <Breadcrumbs items={[{ label: 'Academic Architecture' }, { label: 'Curriculum' }]} />
                    <h1 className="text-3xl font-black tracking-tight text-[var(--foreground)]">Curriculum Structure</h1>
                    <p className="text-[var(--foreground-secondary)] mt-1 font-medium">Define assessment weightage, test frequencies, and syllabus mapping.</p>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        className="h-12 rounded-2xl border-[var(--border)] font-bold px-6"
                        onClick={() => handleAction('Global Config', 'Academic Standards')}
                    >
                        <Settings2 className="w-4 h-4 mr-2" />
                        Standards
                    </Button>
                    <Button
                        className="h-12 rounded-2xl px-6 bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 font-bold text-white transition-all transform hover:scale-105"
                        onClick={() => handleAction('New Template', 'Subject Framework')}
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Add Framework
                    </Button>
                </div>
            </div>

            {/* Strategy Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {ASSESSMENT_TYPES.map((type) => (
                    <Card key={type.id} className="border-none bg-[var(--card-background)] rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-none group cursor-pointer hover:bg-indigo-600 transition-all duration-300">
                        <CardHeader className="p-8">
                            <div className={`w-12 h-12 rounded-2xl ${type.bg} flex items-center justify-center mb-4 group-hover:bg-white/20 transition-colors`}>
                                <type.icon className={`w-6 h-6 ${type.color} group-hover:text-white`} />
                            </div>
                            <CardTitle className="text-lg font-black group-hover:text-white">{type.label}</CardTitle>
                            <CardDescription className="font-bold group-hover:text-white/60">Configure frequency & rules</CardDescription>
                        </CardHeader>
                    </Card>
                ))}
            </div>

            {/* Framework Table */}
            <Card className="border-none bg-[var(--card-background)] rounded-[2.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-none overflow-hidden">
                <CardHeader className="p-8 border-b border-[var(--border)] flex flex-row items-center justify-between">
                    <div className="relative w-80">
                        <Input
                            placeholder="Filter by subject or class..."
                            className="h-12 rounded-2xl pl-12 bg-[var(--background-secondary)] border-none font-bold text-sm shadow-inner"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--foreground-muted)]" />
                    </div>
                </CardHeader>
                <div className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-[var(--background-secondary)]/50 hover:bg-[var(--background-secondary)]/50 border-b border-[var(--border)]">
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--foreground-muted)]">Subject Coverage</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--foreground-muted)]">Core assessment</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--foreground-muted)]">Weightage</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--foreground-muted)]">Frequency</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--foreground-muted)] text-right">Action</th>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredCurriculum.map((item) => (
                                <TableRow key={item.id} className="group hover:bg-[var(--background-secondary)]/30 transition-colors border-b border-[var(--border)]">
                                    <TableCell className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-[var(--background-secondary)] flex items-center justify-center text-[var(--foreground-muted)]">
                                                <BookOpen className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-[var(--foreground)]">{item.subject}</p>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)]">{item.class}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-8 py-6">
                                        <Badge className={`rounded-xl px-3 py-1 font-bold border-none uppercase text-[9px] tracking-widest ${item.type === 'surprise' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600' :
                                            item.type === 'class' ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600' :
                                                'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600'
                                            }`}>
                                            {item.type} test
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="px-8 py-6 text-sm font-black text-[var(--foreground)]">{item.weightage}</TableCell>
                                    <TableCell className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <div className="flex -space-x-2">
                                                {[1, 2, 3].map(i => (
                                                    <div key={i} className="w-6 h-6 rounded-full border-2 border-[var(--card-background)] bg-[var(--background-tertiary)]" />
                                                ))}
                                            </div>
                                            <span className="text-xs font-bold text-[var(--foreground-muted)]">+{item.tests} Events</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-8 py-6 text-right">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="rounded-xl h-10 w-10 text-[var(--foreground-muted)] hover:text-indigo-600 hover:bg-[var(--card-background)]"
                                            onClick={() => handleAction('Review Framework', item.subject)}
                                        >
                                            <MoreVertical className="w-5 h-5" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </Card>

            {/* Bottom Insight Card */}
            <div className="p-8 rounded-[2.5rem] bg-slate-900 dark:bg-slate-900 border border-slate-800 text-white flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden group shadow-2xl">
                <div className="relative z-10 space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center border border-indigo-400/20">
                            <Sparkles className="w-6 h-6 text-indigo-400" />
                        </div>
                        <h4 className="text-xl font-bold">Intelligent Benchmarking</h4>
                    </div>
                    <p className="text-slate-400 text-sm max-w-xl font-medium leading-relaxed">
                        The current curriculum distributes 70% of weightage to Term Exams. Educational standards recommend increasing weightage for continuous assessments (Class Tests) to 40%.
                    </p>
                </div>
                <div className="flex items-center gap-4 relative z-10 w-full lg:w-auto">
                    <Button
                        variant="outline"
                        className="flex-1 lg:flex-none h-14 rounded-2xl border-slate-700 text-white hover:bg-slate-800 font-bold px-8"
                        onClick={() => handleAction('Download Report', 'Curriculum Analytics')}
                    >
                        Export Analysis
                    </Button>
                    <Button
                        className="flex-1 lg:flex-none h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 shadow-xl shadow-indigo-600/20"
                        onClick={() => handleAction('Optimizing', 'Weightage distribution')}
                    >
                        Autoscale Weightage
                    </Button>
                </div>
                {/* Decorative blob */}
                <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-indigo-800/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000" />
            </div>
        </div>
    )
}
