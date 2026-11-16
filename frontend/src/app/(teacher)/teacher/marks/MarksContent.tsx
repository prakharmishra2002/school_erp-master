'use client'

import { useState, useTransition } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    FileText,
    ChevronDown,
    Save,
    AlertCircle,
    CheckCircle2,
    Search,
    GraduationCap,
    TrendingUp,
    Edit3,
    Lock,
    Loader2,
} from 'lucide-react'
import { StudentMark, Exam } from '../actions/types'
import { getMarksList, saveMarks } from '../actions/marksActions'

// Marks Input Row
function MarksRow({
    student,
    onMarksChange,
    isLocked,
}: {
    student: StudentMark
    onMarksChange: (id: string, marks: number | null) => void
    isLocked: boolean
}) {
    const percentage = student.marks !== null ? (student.marks / student.maxMarks) * 100 : null
    const grade = percentage !== null
        ? percentage >= 90 ? 'A+'
            : percentage >= 80 ? 'A'
                : percentage >= 70 ? 'B+'
                    : percentage >= 60 ? 'B'
                        : percentage >= 50 ? 'C'
                            : percentage >= 40 ? 'D'
                                : 'F'
        : null

    const gradeColor = grade
        ? grade.startsWith('A') ? 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/50'
            : grade.startsWith('B') ? 'text-blue-600 bg-blue-100 dark:bg-blue-900/50'
                : grade === 'C' ? 'text-amber-600 bg-amber-100 dark:bg-amber-900/50'
                    : 'text-red-600 bg-red-100 dark:bg-red-900/50'
        : ''

    return (
        <div className={`flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl border transition-all duration-200 ${student.marks !== null
            ? 'bg-[var(--background-secondary)] border-[var(--border)]'
            : 'bg-[var(--card-background)] border-[var(--border)] hover:border-amber-300'
            }`}>
            <div className="flex items-center gap-4 flex-1 min-w-0">
                {/* Roll Number */}
                <div className="w-10 h-10 shrink-0 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center font-mono font-bold text-sm text-white shadow-md">
                    {student.rollNo}
                </div>

                {/* Name */}
                <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-[var(--foreground)] truncate">{student.name}</h4>
                    <p className="text-xs text-[var(--foreground-muted)]">Roll #{student.rollNo}</p>
                </div>

                {/* Percentage & Grade (Mobile) */}
                <div className="sm:hidden flex flex-col items-end shrink-0">
                    {percentage !== null && (
                        <p className={`text-xs font-bold ${percentage >= 80 ? 'text-emerald-600' : percentage >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
                            {percentage.toFixed(0)}%
                        </p>
                    )}
                    {grade && (
                        <Badge className={`mt-1 h-5 text-[10px] px-1.5 ${gradeColor}`}>
                            {grade}
                        </Badge>
                    )}
                </div>
            </div>

            {/* Marks Input & Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 sm:pt-0 border-t sm:border-0 border-[var(--border)]">
                {/* Percentage (Desktop) */}
                <div className="hidden sm:block w-16 text-center">
                    {percentage !== null && (
                        <p className={`font-semibold text-sm ${percentage >= 80 ? 'text-emerald-600' : percentage >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
                            {percentage.toFixed(0)}%
                        </p>
                    )}
                </div>

                {/* Grade (Desktop) */}
                <div className="hidden sm:block w-14 text-center">
                    {grade && (
                        <Badge className={`w-full justify-center ${gradeColor}`}>
                            {grade}
                        </Badge>
                    )}
                </div>

                {/* Input */}
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <input
                            type="number"
                            min="0"
                            max={student.maxMarks}
                            value={student.marks ?? ''}
                            onChange={(e) => {
                                const val = e.target.value === '' ? null : Math.min(parseInt(e.target.value), student.maxMarks)
                                onMarksChange(student.id, val)
                            }}
                            disabled={isLocked}
                            placeholder="--"
                            className={`w-20 h-10 sm:h-12 text-center text-lg font-semibold rounded-xl border-2 outline-none transition-all ${isLocked
                                ? 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-[var(--foreground-muted)]'
                                : student.marks !== null
                                    ? 'bg-[var(--card-background)] border-emerald-300 focus:border-emerald-500'
                                    : 'bg-[var(--card-background)] border-[var(--border)] focus:border-amber-500'
                                }`}
                        />
                    </div>
                    <span className="text-[var(--foreground-muted)] text-sm font-medium">/ {student.maxMarks}</span>
                </div>
            </div>
        </div>
    )
}

export default function MarksContent({
    initialStudents,
    initialClass,
    initialExam,
    classes,
    exams
}: {
    initialStudents: StudentMark[],
    initialClass: string,
    initialExam: string,
    classes: string[],
    exams: Exam[]
}) {
    const [selectedClass, setSelectedClass] = useState(initialClass)
    const [selectedExam, setSelectedExam] = useState(initialExam)
    const [searchQuery, setSearchQuery] = useState('')
    const [isLocked, setIsLocked] = useState(false)
    const [students, setStudents] = useState<StudentMark[]>(initialStudents)
    const [isSaving, startSavingTransition] = useTransition()
    const [isFetching, startFetchingTransition] = useTransition()

    const handleMarksChange = (id: string, marks: number | null) => {
        setStudents(prev => prev.map(s => s.id === id ? { ...s, marks } : s))
    }

    const handleClassChange = (newClass: string) => {
        setSelectedClass(newClass)
        startFetchingTransition(async () => {
            const newList = await getMarksList(newClass, selectedExam)
            setStudents(newList)
        })
    }

    const handleExamChange = (newExam: string) => {
        setSelectedExam(newExam)
        startFetchingTransition(async () => {
            const newList = await getMarksList(selectedClass, newExam)
            setStudents(newList)
        })
    }

    const handleSave = () => {
        startSavingTransition(async () => {
            await saveMarks(selectedClass, selectedExam, students)
            alert('Marks submitted successfully!')
        })
    }

    const stats = {
        total: students.length,
        entered: students.filter(s => s.marks !== null).length,
        pending: students.filter(s => s.marks === null).length,
        passed: students.filter(s => s.marks !== null && (s.marks / s.maxMarks) * 100 >= 40).length,
        avgMarks: students.filter(s => s.marks !== null).length > 0
            ? students.filter(s => s.marks !== null).reduce((acc, s) => acc + (s.marks || 0), 0) / students.filter(s => s.marks !== null).length
            : 0,
        highest: Math.max(...students.filter(s => s.marks !== null).map(s => s.marks || 0), 0),
    }

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.rollNo.toString().includes(searchQuery)
    )

    const isComplete = stats.pending === 0

    return (
        <div className="space-y-6 animate-slide-up">
            {/* Header */}
            <header>
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                    <span className="text-xs font-medium tracking-widest uppercase text-[var(--foreground-muted)]">
                        Examinations
                    </span>
                </div>
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                    <div>
                        <h1 className="font-display text-3xl font-semibold tracking-tight text-[var(--foreground)]">
                            Marks Entry
                        </h1>
                        <p className="mt-1 text-[var(--foreground-secondary)]">
                            Enter and manage examination marks for your classes
                        </p>
                    </div>
                </div>
            </header>

            {/* Selectors */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                            {/* Class Selector */}
                            <div>
                                <label className="block text-xs font-medium text-[var(--foreground-muted)] mb-1.5">Select Class</label>
                                <div className="relative">
                                    <select
                                        value={selectedClass}
                                        onChange={(e) => handleClassChange(e.target.value)}
                                        className="appearance-none w-full px-4 py-3 pr-10 bg-[var(--background-secondary)] rounded-xl text-sm font-medium text-[var(--foreground)] border border-transparent hover:border-[var(--border)] focus:outline-none focus:border-amber-500 cursor-pointer"
                                    >
                                        {classes.map(cls => (
                                            <option key={cls} value={cls}>{cls}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--foreground-muted)] pointer-events-none" />
                                </div>
                            </div>

                            {/* Exam Selector */}
                            <div>
                                <label className="block text-xs font-medium text-[var(--foreground-muted)] mb-1.5">Select Examination</label>
                                <div className="relative">
                                    <select
                                        value={selectedExam}
                                        onChange={(e) => handleExamChange(e.target.value)}
                                        className="appearance-none w-full px-4 py-3 pr-10 bg-[var(--background-secondary)] rounded-xl text-sm font-medium text-[var(--foreground)] border border-transparent hover:border-[var(--border)] focus:outline-none focus:border-amber-500 cursor-pointer"
                                    >
                                        {exams.map(exam => (
                                            <option key={exam.id} value={exam.id}>
                                                {exam.name} ({exam.maxMarks})
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--foreground-muted)] pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                            {/* Search */}
                            <div>
                                <label className="block text-xs font-medium text-[var(--foreground-muted)] mb-1.5">Search Student</label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--foreground-muted)]" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Name or roll..."
                                        className="w-full pl-10 pr-4 py-3 bg-[var(--background-secondary)] rounded-xl text-sm font-medium text-[var(--foreground)] border border-transparent hover:border-[var(--border)] focus:outline-none focus:border-amber-500"
                                    />
                                </div>
                            </div>

                            {/* Subject & Lock */}
                            <div className="flex items-end gap-2">
                                <div className="relative flex-1">
                                    <select
                                        className="appearance-none w-full px-4 py-2.5 pr-10 bg-[var(--background-secondary)] rounded-xl text-sm font-medium text-[var(--foreground)] border border-transparent hover:border-[var(--border)] focus:outline-none focus:border-amber-500 cursor-pointer h-11"
                                    >
                                        <option value="mathematics">📐 Math</option>
                                        <option value="physics">⚛️ Physics</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--foreground-muted)] pointer-events-none" />
                                </div>
                                <Button
                                    variant={isLocked ? 'secondary' : 'ghost'}
                                    size="sm"
                                    className="gap-2 h-11 px-4"
                                    onClick={() => setIsLocked(!isLocked)}
                                >
                                    {isLocked ? <Lock className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                                    <span className="hidden sm:inline">{isLocked ? 'Locked' : 'Editing'}</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                <Card className="bg-[var(--background-secondary)]">
                    <CardContent className="p-3 text-center">
                        <p className="font-display text-2xl font-bold text-[var(--foreground)]">{stats.total}</p>
                        <p className="text-xs text-[var(--foreground-muted)]">Total</p>
                    </CardContent>
                </Card>
                <Card className="bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800">
                    <CardContent className="p-3 text-center">
                        <p className="font-display text-2xl font-bold text-emerald-600">{stats.entered}</p>
                        <p className="text-xs text-emerald-600/70">Entered</p>
                    </CardContent>
                </Card>
                <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
                    <CardContent className="p-3 text-center">
                        <p className="font-display text-2xl font-bold text-amber-600">{stats.pending}</p>
                        <p className="text-xs text-amber-600/70">Pending</p>
                    </CardContent>
                </Card>
                <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                    <CardContent className="p-3 text-center">
                        <p className="font-display text-2xl font-bold text-blue-600">{stats.avgMarks.toFixed(1)}</p>
                        <p className="text-xs text-blue-600/70">Average</p>
                    </CardContent>
                </Card>
                <Card className="bg-violet-50 dark:bg-violet-900/20 border-violet-200 dark:border-violet-800">
                    <CardContent className="p-3 text-center">
                        <p className="font-display text-2xl font-bold text-violet-600">{stats.highest}</p>
                        <p className="text-xs text-violet-600/70">Highest</p>
                    </CardContent>
                </Card>
                <Card className={`${stats.entered > 0 ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' : 'bg-slate-100 dark:bg-slate-800'}`}>
                    <CardContent className="p-3 text-center">
                        <p className={`font-display text-2xl font-bold ${stats.entered > 0 ? 'text-emerald-600' : 'text-slate-500'}`}>
                            {stats.entered > 0 ? `${((stats.passed / stats.entered) * 100).toFixed(0)}%` : '--'}
                        </p>
                        <p className="text-xs text-[var(--foreground-muted)]">Pass Rate</p>
                    </CardContent>
                </Card>
            </div>

            {/* Student Marks List */}
            <Card className="relative">
                {isFetching && (
                    <div className="absolute inset-0 bg-white/50 dark:bg-black/50 backdrop-blur-[2px] z-10 flex items-center justify-center rounded-2xl">
                        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
                    </div>
                )}
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div>
                        <CardTitle className="font-display text-lg">{selectedClass} — {exams.find(e => e.id === selectedExam)?.name}</CardTitle>
                        <p className="text-sm text-[var(--foreground-muted)] mt-0.5">
                            Mathematics • Maximum Marks: {exams.find(e => e.id === selectedExam)?.maxMarks}
                        </p>
                    </div>
                    {!isComplete && (
                        <Badge variant="warning" className="gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {stats.pending} pending
                        </Badge>
                    )}
                    {isComplete && (
                        <Badge className="gap-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400">
                            <CheckCircle2 className="w-3 h-3" />
                            Complete
                        </Badge>
                    )}
                </CardHeader>
                <CardContent className="space-y-2">
                    {filteredStudents.length > 0 ? (
                        filteredStudents.map(student => (
                            <MarksRow
                                key={student.id}
                                student={student}
                                onMarksChange={handleMarksChange}
                                isLocked={isLocked}
                            />
                        ))
                    ) : (
                        <div className="py-12 text-center bg-[var(--background-secondary)] rounded-xl border border-dashed border-[var(--border)]">
                            <p className="text-[var(--foreground-muted)]">No students found matching your search.</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Save Button */}
            <div className="sticky bottom-4 flex justify-end gap-3">
                <Button variant="secondary" size="lg" className="gap-2 shadow-xl">
                    Save as Draft
                </Button>
                <Button
                    size="lg"
                    className={`gap-2 shadow-2xl min-w-[180px] ${isComplete ? 'bg-amber-500 hover:bg-amber-600' : 'bg-slate-400'}`}
                    disabled={!isComplete || isSaving}
                    onClick={handleSave}
                >
                    {isSaving ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <Save className="w-5 h-5" />
                    )}
                    {isSaving ? 'Submitting...' : 'Submit Marks'}
                </Button>
            </div>
        </div>
    )
}
