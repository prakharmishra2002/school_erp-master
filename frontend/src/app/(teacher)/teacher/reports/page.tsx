'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    BarChart3,
    Download,
    TrendingUp,
    TrendingDown,
    Users,
    GraduationCap,
    ChevronDown,
    FileText,
    PieChart,
    Calendar,
} from 'lucide-react'

// Simple Bar Chart Component
function SimpleBarChart({ data }: { data: { label: string; value: number; color: string }[] }) {
    const maxValue = Math.max(...data.map(d => d.value))

    return (
        <div className="space-y-3">
            {data.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                    <div className="w-20 text-sm text-[var(--foreground-muted)]">{item.label}</div>
                    <div className="flex-1 h-8 bg-[var(--background-secondary)] rounded-lg overflow-hidden">
                        <div
                            className={`h-full ${item.color} rounded-lg flex items-center justify-end px-2 transition-all duration-500`}
                            style={{ width: `${(item.value / maxValue) * 100}%` }}
                        >
                            <span className="text-xs font-semibold text-white">{item.value}%</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

// Performance Ring Component
function PerformanceRing({ value, label, color }: { value: number; label: string; color: string }) {
    const circumference = 2 * Math.PI * 45
    const strokeDashoffset = circumference - (value / 100) * circumference

    return (
        <div className="flex flex-col items-center">
            <svg className="w-28 h-28 -rotate-90">
                <circle
                    cx="56"
                    cy="56"
                    r="45"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-[var(--background-tertiary)]"
                />
                <circle
                    cx="56"
                    cy="56"
                    r="45"
                    fill="none"
                    stroke={color}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-700"
                />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
                <span className="font-display text-2xl font-bold text-[var(--foreground)]">{value}%</span>
            </div>
            <p className="text-sm text-[var(--foreground-muted)] mt-2">{label}</p>
        </div>
    )
}

export default function ReportsPage() {
    const [selectedClass, setSelectedClass] = useState('all')
    const [selectedPeriod, setSelectedPeriod] = useState('current-term')

    const classes = ['Class 10-A', 'Class 10-B', 'Class 9-A', 'Class 9-B']

    const classPerformance = [
        { label: 'Class 10-A', value: 87, color: 'bg-emerald-500' },
        { label: 'Class 10-B', value: 82, color: 'bg-blue-500' },
        { label: 'Class 9-A', value: 78, color: 'bg-amber-500' },
        { label: 'Class 9-B', value: 84, color: 'bg-violet-500' },
    ]

    const gradeDistribution = [
        { grade: 'A+', count: 23, percentage: 12 },
        { grade: 'A', count: 35, percentage: 19 },
        { grade: 'B+', count: 42, percentage: 23 },
        { grade: 'B', count: 38, percentage: 20 },
        { grade: 'C', count: 28, percentage: 15 },
        { grade: 'D', count: 15, percentage: 8 },
        { grade: 'F', count: 5, percentage: 3 },
    ]

    return (
        <div className="space-y-6 animate-slide-up">
            {/* Header */}
            <header>
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-2 h-2 rounded-full bg-cyan-500" />
                    <span className="text-xs font-medium tracking-widest uppercase text-[var(--foreground-muted)]">
                        Analytics
                    </span>
                </div>
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                    <div>
                        <h1 className="font-display text-3xl font-semibold tracking-tight text-[var(--foreground)]">
                            Reports & Analytics
                        </h1>
                        <p className="mt-1 text-[var(--foreground-secondary)]">
                            Performance insights for your classes
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <select
                                value={selectedClass}
                                onChange={(e) => setSelectedClass(e.target.value)}
                                className="appearance-none px-4 py-2.5 pr-10 bg-[var(--background-secondary)] rounded-xl text-sm font-medium text-[var(--foreground)] border border-transparent hover:border-[var(--border)] focus:outline-none focus:border-emerald-500 cursor-pointer"
                            >
                                <option value="all">All Classes</option>
                                {classes.map(cls => (
                                    <option key={cls} value={cls}>{cls}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--foreground-muted)] pointer-events-none" />
                        </div>
                        <div className="relative">
                            <select
                                value={selectedPeriod}
                                onChange={(e) => setSelectedPeriod(e.target.value)}
                                className="appearance-none px-4 py-2.5 pr-10 bg-[var(--background-secondary)] rounded-xl text-sm font-medium text-[var(--foreground)] border border-transparent hover:border-[var(--border)] focus:outline-none focus:border-emerald-500 cursor-pointer"
                            >
                                <option value="current-term">Current Term</option>
                                <option value="last-term">Last Term</option>
                                <option value="full-year">Full Year</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--foreground-muted)] pointer-events-none" />
                        </div>
                        <Button variant="secondary" size="sm" className="gap-2">
                            <Download className="w-4 h-4" />
                            Export
                        </Button>
                    </div>
                </div>
            </header>

            {/* Overview Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-emerald-200/50 dark:border-emerald-800/50 bg-gradient-to-br from-emerald-500/5 to-teal-500/5">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                            <Users className="w-5 h-5 text-emerald-600" />
                            <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400 gap-1">
                                <TrendingUp className="w-3 h-3" /> +5%
                            </Badge>
                        </div>
                        <p className="font-display text-2xl font-semibold text-[var(--foreground)]">186</p>
                        <p className="text-sm text-[var(--foreground-muted)]">Total Students</p>
                    </CardContent>
                </Card>
                <Card className="border-blue-200/50 dark:border-blue-800/50 bg-gradient-to-br from-blue-500/5 to-indigo-500/5">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                            <BarChart3 className="w-5 h-5 text-blue-600" />
                            <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400 gap-1">
                                <TrendingUp className="w-3 h-3" /> +3%
                            </Badge>
                        </div>
                        <p className="font-display text-2xl font-semibold text-[var(--foreground)]">82.8%</p>
                        <p className="text-sm text-[var(--foreground-muted)]">Avg Score</p>
                    </CardContent>
                </Card>
                <Card className="border-amber-200/50 dark:border-amber-800/50 bg-gradient-to-br from-amber-500/5 to-orange-500/5">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                            <GraduationCap className="w-5 h-5 text-amber-600" />
                            <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400 gap-1">
                                <TrendingDown className="w-3 h-3" /> -2%
                            </Badge>
                        </div>
                        <p className="font-display text-2xl font-semibold text-[var(--foreground)]">91.3%</p>
                        <p className="text-sm text-[var(--foreground-muted)]">Attendance</p>
                    </CardContent>
                </Card>
                <Card className="border-violet-200/50 dark:border-violet-800/50 bg-gradient-to-br from-violet-500/5 to-purple-500/5">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                            <FileText className="w-5 h-5 text-violet-600" />
                        </div>
                        <p className="font-display text-2xl font-semibold text-[var(--foreground)]">97.3%</p>
                        <p className="text-sm text-[var(--foreground-muted)]">Pass Rate</p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Class Performance */}
                <Card>
                    <CardHeader>
                        <CardTitle className="font-display text-lg flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-emerald-500" />
                            Class Performance
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <SimpleBarChart data={classPerformance} />
                    </CardContent>
                </Card>

                {/* Grade Distribution */}
                <Card>
                    <CardHeader>
                        <CardTitle className="font-display text-lg flex items-center gap-2">
                            <PieChart className="w-5 h-5 text-violet-500" />
                            Grade Distribution
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-3">
                            {gradeDistribution.map(item => (
                                <div
                                    key={item.grade}
                                    className={`flex-1 min-w-[70px] p-3 rounded-xl text-center ${item.grade.startsWith('A') ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800' :
                                            item.grade === 'B+' || item.grade === 'B' ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800' :
                                                item.grade === 'C' ? 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800' :
                                                    'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                                        }`}
                                >
                                    <p className="font-bold text-lg text-[var(--foreground)]">{item.grade}</p>
                                    <p className="text-xs text-[var(--foreground-muted)]">{item.count} ({item.percentage}%)</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Downloadable Reports */}
            <Card>
                <CardHeader>
                    <CardTitle className="font-display text-lg flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-500" />
                        Downloadable Reports
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[
                            { title: 'Class Performance Report', desc: 'Detailed analysis by class', icon: BarChart3, color: 'emerald' },
                            { title: 'Student Progress Cards', desc: 'Individual student reports', icon: Users, color: 'blue' },
                            { title: 'Attendance Summary', desc: 'Monthly attendance data', icon: Calendar, color: 'amber' },
                            { title: 'Exam Analysis', desc: 'Question-wise performance', icon: GraduationCap, color: 'violet' },
                            { title: 'Parent Report Cards', desc: 'Printable report cards', icon: FileText, color: 'rose' },
                            { title: 'Comparison Report', desc: 'Term-over-term analysis', icon: TrendingUp, color: 'cyan' },
                        ].map((report, i) => (
                            <div
                                key={i}
                                className="group flex items-center gap-4 p-4 rounded-xl border border-[var(--border)] hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer"
                            >
                                <div className={`w-11 h-11 rounded-xl bg-${report.color}-100 dark:bg-${report.color}-900/30 flex items-center justify-center`}>
                                    <report.icon className={`w-5 h-5 text-${report.color}-600`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-[var(--foreground)]">{report.title}</p>
                                    <p className="text-sm text-[var(--foreground-muted)]">{report.desc}</p>
                                </div>
                                <Download className="w-5 h-5 text-[var(--foreground-muted)] opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
