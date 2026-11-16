'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Calendar,
    Clock,
    MapPin,
    FileText,
    Download,
    Eye,
    GraduationCap,
    BookOpen,
    AlertCircle,
    CheckCircle2,
} from 'lucide-react'

interface Exam {
    id: string
    name: string
    subject: string
    class: string
    date: string
    time: string
    duration: string
    room: string
    maxMarks: number
    status: 'upcoming' | 'ongoing' | 'completed' | 'marks-pending'
    marksEntered?: boolean
}

function ExamCard({ exam }: { exam: Exam }) {
    const statusStyles = {
        upcoming: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400',
        ongoing: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400',
        completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400',
        'marks-pending': 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400',
    }

    const statusLabels = {
        upcoming: 'Upcoming',
        ongoing: 'Ongoing',
        completed: 'Completed',
        'marks-pending': 'Marks Pending',
    }

    return (
        <Card className="group hover:shadow-lg hover:border-emerald-300 transition-all duration-300">
            <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-display text-lg font-semibold text-[var(--foreground)]">
                                {exam.name}
                            </h3>
                            <Badge className={statusStyles[exam.status]}>
                                {statusLabels[exam.status]}
                            </Badge>
                        </div>
                        <p className="text-sm text-[var(--foreground-muted)]">
                            {exam.subject} • {exam.class}
                        </p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 flex items-center justify-center">
                        <GraduationCap className="w-6 h-6 text-violet-600" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm text-[var(--foreground-secondary)]">
                        <Calendar className="w-4 h-4 text-[var(--foreground-muted)]" />
                        {new Date(exam.date).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[var(--foreground-secondary)]">
                        <Clock className="w-4 h-4 text-[var(--foreground-muted)]" />
                        {exam.time} ({exam.duration})
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[var(--foreground-secondary)]">
                        <MapPin className="w-4 h-4 text-[var(--foreground-muted)]" />
                        {exam.room}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[var(--foreground-secondary)]">
                        <FileText className="w-4 h-4 text-[var(--foreground-muted)]" />
                        Max: {exam.maxMarks} marks
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {exam.status === 'marks-pending' ? (
                        <Button size="sm" className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white gap-2" asChild>
                            <a href={`/teacher/marks?exam=${exam.id}`}>
                                <FileText className="w-4 h-4" />
                                Enter Marks
                            </a>
                        </Button>
                    ) : exam.status === 'completed' ? (
                        <Button variant="secondary" size="sm" className="flex-1 gap-2">
                            <Eye className="w-4 h-4" />
                            View Results
                        </Button>
                    ) : (
                        <Button variant="secondary" size="sm" className="flex-1 gap-2">
                            <Download className="w-4 h-4" />
                            Download Syllabus
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

export default function ExaminationsPage() {
    const exams: Exam[] = [
        {
            id: 'exam-1',
            name: 'Unit Test 2',
            subject: 'Mathematics',
            class: 'Class 10-A',
            date: '2026-01-15',
            time: '9:00 AM',
            duration: '1.5 hrs',
            room: 'Hall A',
            maxMarks: 100,
            status: 'marks-pending',
            marksEntered: false,
        },
        {
            id: 'exam-2',
            name: 'Unit Test 2',
            subject: 'Mathematics',
            class: 'Class 10-B',
            date: '2026-01-15',
            time: '9:00 AM',
            duration: '1.5 hrs',
            room: 'Hall B',
            maxMarks: 100,
            status: 'marks-pending',
            marksEntered: false,
        },
        {
            id: 'exam-3',
            name: 'Mid Term Exam',
            subject: 'Mathematics',
            class: 'Class 9-A',
            date: '2026-02-10',
            time: '10:00 AM',
            duration: '2 hrs',
            room: 'Hall A',
            maxMarks: 100,
            status: 'upcoming',
        },
        {
            id: 'exam-4',
            name: 'Mid Term Exam',
            subject: 'Mathematics',
            class: 'Class 9-B',
            date: '2026-02-10',
            time: '10:00 AM',
            duration: '2 hrs',
            room: 'Hall B',
            maxMarks: 100,
            status: 'upcoming',
        },
        {
            id: 'exam-5',
            name: 'Unit Test 1',
            subject: 'Mathematics',
            class: 'Class 10-A',
            date: '2025-11-20',
            time: '9:00 AM',
            duration: '1 hr',
            room: 'Room 301',
            maxMarks: 50,
            status: 'completed',
            marksEntered: true,
        },
        {
            id: 'exam-6',
            name: 'Unit Test 1',
            subject: 'Mathematics',
            class: 'Class 10-B',
            date: '2025-11-20',
            time: '9:00 AM',
            duration: '1 hr',
            room: 'Room 302',
            maxMarks: 50,
            status: 'completed',
            marksEntered: true,
        },
    ]

    const pendingMarks = exams.filter(e => e.status === 'marks-pending').length
    const upcomingExams = exams.filter(e => e.status === 'upcoming').length

    return (
        <div className="space-y-6 animate-slide-up">
            {/* Header */}
            <header>
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-2 h-2 rounded-full bg-violet-500" />
                    <span className="text-xs font-medium tracking-widest uppercase text-[var(--foreground-muted)]">
                        Examinations
                    </span>
                </div>
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                    <div>
                        <h1 className="font-display text-3xl font-semibold tracking-tight text-[var(--foreground)]">
                            Exam Schedule
                        </h1>
                        <p className="mt-1 text-[var(--foreground-secondary)]">
                            View upcoming exams and manage marks entry
                        </p>
                    </div>
                </div>
            </header>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-red-200/50 dark:border-red-800/50 bg-gradient-to-br from-red-500/5 to-rose-500/5">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500/20 to-rose-500/20 flex items-center justify-center">
                            <AlertCircle className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                            <p className="font-display text-2xl font-semibold text-red-600">{pendingMarks}</p>
                            <p className="text-sm text-[var(--foreground-muted)]">Marks Pending</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-blue-200/50 dark:border-blue-800/50 bg-gradient-to-br from-blue-500/5 to-indigo-500/5">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="font-display text-2xl font-semibold text-blue-600">{upcomingExams}</p>
                            <p className="text-sm text-[var(--foreground-muted)]">Upcoming Exams</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-emerald-200/50 dark:border-emerald-800/50 bg-gradient-to-br from-emerald-500/5 to-teal-500/5">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center">
                            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div>
                            <p className="font-display text-2xl font-semibold text-emerald-600">
                                {exams.filter(e => e.status === 'completed').length}
                            </p>
                            <p className="text-sm text-[var(--foreground-muted)]">Completed</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-violet-200/50 dark:border-violet-800/50 bg-gradient-to-br from-violet-500/5 to-purple-500/5">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center">
                            <BookOpen className="w-6 h-6 text-violet-600" />
                        </div>
                        <div>
                            <p className="font-display text-2xl font-semibold text-violet-600">4</p>
                            <p className="text-sm text-[var(--foreground-muted)]">Classes Assigned</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Exams requiring attention */}
            {pendingMarks > 0 && (
                <div>
                    <h2 className="font-display text-lg font-semibold text-[var(--foreground)] mb-4 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-red-500" />
                        Requiring Attention
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {exams.filter(e => e.status === 'marks-pending').map(exam => (
                            <ExamCard key={exam.id} exam={exam} />
                        ))}
                    </div>
                </div>
            )}

            {/* Upcoming Exams */}
            {upcomingExams > 0 && (
                <div>
                    <h2 className="font-display text-lg font-semibold text-[var(--foreground)] mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-blue-500" />
                        Upcoming Exams
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {exams.filter(e => e.status === 'upcoming').map(exam => (
                            <ExamCard key={exam.id} exam={exam} />
                        ))}
                    </div>
                </div>
            )}

            {/* Completed Exams */}
            <div>
                <h2 className="font-display text-lg font-semibold text-[var(--foreground)] mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    Completed Exams
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {exams.filter(e => e.status === 'completed').map(exam => (
                        <ExamCard key={exam.id} exam={exam} />
                    ))}
                </div>
            </div>
        </div>
    )
}
