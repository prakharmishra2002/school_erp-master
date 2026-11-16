'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    BookOpen,
    ChevronRight,
    Trophy,
    Target,
    TrendingUp,
    FileText,
    Download,
    Star
} from 'lucide-react'
import { ParentChild } from '../actions/types'
import { ExamResults } from '../actions/academicActions'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'

export default function ResultsContent({
    initialChildren,
    resultsData,
    selectedChildId: propSelectedChildId
}: {
    initialChildren: ParentChild[],
    resultsData: ExamResults[],
    selectedChildId: string
}) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const [localSelectedChildId, setLocalSelectedChildId] = useState(propSelectedChildId)
    const [selectedExamIndex, setSelectedExamIndex] = useState(0)

    const handleChildSelect = (id: string) => {
        setLocalSelectedChildId(id)
        const params = new URLSearchParams(searchParams.toString())
        params.set('childId', id)
        router.push(`${pathname}?${params.toString()}`)
    }

    const selectedChild = initialChildren.find(c => c.id === localSelectedChildId) || initialChildren[0]
    const selectedExam = resultsData[selectedExamIndex]

    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight dark:text-white">Academic Performance</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Detailed breakdown of exam results and progress.
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

            {!selectedExam ? (
                <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                    <FileText className="w-12 h-12 text-slate-300 mb-4" />
                    <p className="text-slate-500 font-medium">No exam results available for this child.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Exam Sidebar */}
                    <div className="space-y-4">
                        <h2 className="text-sm font-black uppercase tracking-widest text-slate-500 px-1">Recent Exams</h2>
                        {resultsData.map((exam, idx) => (
                            <button
                                key={idx}
                                onClick={() => setSelectedExamIndex(idx)}
                                className={cn(
                                    "w-full text-left p-4 rounded-2xl border transition-all group",
                                    selectedExamIndex === idx
                                        ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20"
                                        : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-300"
                                )}
                            >
                                <p className="font-bold text-sm truncate">{exam.examName}</p>
                                <div className="flex items-center justify-between mt-2">
                                    <span className={cn(
                                        "text-[10px] font-black uppercase tracking-tighter",
                                        selectedExamIndex === idx ? "text-blue-100" : "text-slate-400"
                                    )}>
                                        {new Date(exam.date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                                    </span>
                                    <span className={cn(
                                        "text-xs font-black",
                                        selectedExamIndex === idx ? "text-white" : "text-blue-600"
                                    )}>
                                        {exam.totalPercentage}%
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Results Display */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Summary Header */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="border-0 shadow-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-3xl overflow-hidden p-6 relative">
                                <div className="relative z-10">
                                    <p className="text-indigo-100 text-sm font-medium">Exam Summary</p>
                                    <h3 className="text-2xl font-bold mt-1">{selectedExam.examName}</h3>
                                    <div className="mt-6 flex items-end gap-3">
                                        <div className="text-5xl font-black tracking-tighter">{selectedExam.totalPercentage}%</div>
                                        <div className="pb-2">
                                            <Badge className="bg-white/20 text-white border-0 px-2 py-0.5">Overall</Badge>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex items-center gap-2 text-xs font-bold text-indigo-100">
                                        <Target className="w-4 h-4" />
                                        Exceeded target by 3.4%
                                    </div>
                                </div>
                                <Trophy className="absolute -bottom-4 -right-4 w-40 h-40 text-white/10 -rotate-12" />
                            </Card>

                            <div className="grid grid-cols-2 gap-4">
                                <Card className="p-5 border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm bg-white dark:bg-slate-900 flex flex-col justify-between">
                                    <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-600">
                                        <Star className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-black tracking-tight">A1</p>
                                        <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Final Grade</p>
                                    </div>
                                </Card>
                                <Card className="p-5 border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm bg-white dark:bg-slate-900 flex flex-col justify-between">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600">
                                        <TrendingUp className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-black tracking-tight">+3.2%</p>
                                        <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Growth</p>
                                    </div>
                                </Card>
                            </div>
                        </div>

                        {/* Subject Breakdown */}
                        <Card className="border-0 shadow-lg rounded-3xl overflow-hidden bg-white dark:bg-slate-900">
                            <CardHeader className="border-b border-slate-100 dark:border-slate-800 p-6 flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="text-lg">Subject-wise Breakdown</CardTitle>
                                    <CardDescription>Performance across all subjects in this exam</CardDescription>
                                </div>
                                <Button variant="outline" size="sm" className="rounded-xl gap-2 font-bold shadow-sm">
                                    <Download className="w-4 h-4" /> Download PDF
                                </Button>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {selectedExam.subjects.map((sub, i) => (
                                        <div key={i} className="p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 font-bold">
                                                        {sub.subject[0]}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-slate-900 dark:text-white">{sub.subject}</h4>
                                                        <p className="text-xs text-slate-500 font-medium italic">&quot;{sub.remarks}&quot;</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="text-right">
                                                        <p className="text-lg font-black tracking-tight">{sub.marks}/{sub.maxMarks}</p>
                                                        <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Score</p>
                                                    </div>
                                                    <div className="w-12 h-12 rounded-2xl bg-slate-900 dark:bg-slate-800 flex items-center justify-center text-white font-black">
                                                        {sub.grade}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="relative h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                <div
                                                    className={cn(
                                                        "absolute left-0 top-0 h-full rounded-full transition-all duration-1000",
                                                        (sub.marks / sub.maxMarks) > 0.9 ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]" :
                                                            (sub.marks / sub.maxMarks) > 0.8 ? "bg-blue-500" : "bg-amber-500"
                                                    )}
                                                    style={{ width: `${(sub.marks / sub.maxMarks) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    )
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ')
}
