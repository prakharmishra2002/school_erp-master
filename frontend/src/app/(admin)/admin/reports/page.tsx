'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    LineChart,
    Line,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar
} from 'recharts'
import {
    Download,
    FileText,
    PieChart as PieChartIcon,
    TrendingUp,
    ArrowUpRight,
    Calendar,
    Users,
    BookOpen,
    ChevronRight,
    Search,
    Filter,
    Printer,
    FileSpreadsheet,
    Zap,
    ShieldCheck,
    AlertCircle,
    BarChart3
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Mock Data for Charts
const enrollmentData = [
    { name: '2021', students: 420 },
    { name: '2022', students: 510 },
    { name: '2023', students: 680 },
    { name: '2024', students: 790 },
    { name: '2025', students: 840 },
    { name: '2026', students: 920 },
]

const revenueData = [
    { month: 'Jul', target: 4000, collected: 3200 },
    { month: 'Aug', target: 3000, collected: 3000 },
    { month: 'Sep', target: 2000, collected: 4200 },
    { month: 'Oct', target: 2780, collected: 1390 },
    { month: 'Nov', target: 1890, collected: 2100 },
    { month: 'Dec', target: 2390, collected: 2500 },
]

const departmentPerformance = [
    { name: 'Science', score: 88, color: '#6366f1' },
    { name: 'Commerce', score: 72, color: '#f59e0b' },
    { name: 'Arts', score: 94, color: '#10b981' },
    { name: 'IT/Comp', score: 65, color: '#3b82f6' },
]

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#3b82f6']

export default function ReportsAnalyticsPage() {
    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Link href="/admin/dashboard" className="text-sm font-medium text-[var(--foreground-secondary)] hover:text-indigo-600 transition-colors">Admin Dashboard</Link>
                        <ChevronRight className="w-4 h-4 text-[var(--foreground-muted)]" />
                        <span className="text-sm font-bold text-indigo-600 uppercase tracking-widest">Analytics Bureau</span>
                    </div>
                    <h1 className="text-3xl font-black tracking-tight text-[var(--foreground)]">Executive Insight Hub</h1>
                    <p className="text-[var(--foreground-secondary)] mt-1 font-medium">Strategic institutional reports, academic growth trends, and financial health auditing.</p>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-12 border-[var(--border)] rounded-2xl px-6 font-bold text-[var(--foreground-secondary)] bg-[var(--card-background)] shadow-sm hover:bg-[var(--background-secondary)] transition-all">
                        <Printer className="w-4 h-4 mr-2" />
                        Print Summary
                    </Button>
                    <Button className="h-12 bg-indigo-600 hover:bg-indigo-700 rounded-2xl px-8 font-bold text-white shadow-xl shadow-indigo-600/20 transform hover:scale-105 transition-all">
                        <Download className="w-5 h-5 mr-2" />
                        Export Center
                    </Button>
                </div>
            </div>

            {/* Top Level Strategic Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Overall Academic Score', value: '84.2%', change: '+3.1%', icon: BookOpen, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                    { label: 'Student Retention', value: '98.5%', change: '+0.4%', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Resource Utilization', value: '72%', change: '-2.0%', icon: PieChartIcon, color: 'text-amber-600', bg: 'bg-amber-50' },
                    { label: 'Compliance Health', value: '100%', change: 'Validated', icon: ShieldCheck, color: 'text-blue-600', bg: 'bg-blue-50' },
                ].map((stat, i) => (
                    <Card key={i} className="border-none bg-[var(--card-background)] rounded-[2rem] shadow-xl shadow-slate-200/40 dark:shadow-none p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", stat.bg, stat.color)}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <Badge className="rounded-lg bg-[var(--background-secondary)] text-[var(--foreground-muted)] border-none font-bold text-[9px] px-2 py-1">
                                {stat.change}
                            </Badge>
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--foreground-muted)] mb-1">{stat.label}</p>
                        <p className="text-2xl font-black text-[var(--foreground)] tracking-tight leading-none">{stat.value}</p>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Growth Trends - Primary Chart */}
                <Card className="lg:col-span-2 border-none bg-[var(--card-background)] rounded-[2.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-none p-10">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <CardTitle className="text-2xl font-black text-[var(--foreground)]">Enrollment Growth Vector</CardTitle>
                            <CardDescription className="font-bold text-[var(--foreground-muted)] uppercase text-[10px] tracking-widest mt-1">Multi-year student acquisition trend</CardDescription>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="rounded-xl border-[var(--border)] font-bold text-[10px] uppercase h-9">Yearly</Button>
                            <Button variant="outline" size="sm" className="rounded-xl border-[var(--border)] font-bold text-[10px] uppercase h-9 bg-[var(--background-secondary)]">Quarterly</Button>
                        </div>
                    </div>
                    <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={enrollmentData}>
                                <defs>
                                    <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                                />
                                <Area type="monotone" dataKey="students" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorStudents)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Right Column: Performance Alerts & Reports */}
                <div className="space-y-8">
                    {/* Performance Hot-Zone */}
                    <Card className="border-none bg-slate-900 shadow-2xl shadow-indigo-900/40 rounded-[2.5rem] p-8 text-white">
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <TrendingUp className="w-6 h-6 text-indigo-400" />
                                <h4 className="text-xl font-black">Performance Alerts</h4>
                            </div>
                            <div className="space-y-4">
                                {[
                                    { msg: 'Class 8-C Attendance Drop', severity: 'high', code: 'ATT-09' },
                                    { msg: 'Maths Dept. Syllabus Delay', severity: 'medium', code: 'SYL-44' },
                                    { msg: 'Library Resource Shortage', severity: 'low', code: 'RES-12' },
                                ].map((alert, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 group hover:bg-white/10 transition-all cursor-pointer">
                                        <div>
                                            <p className="text-xs font-bold text-white mb-1">{alert.msg}</p>
                                            <p className="text-[9px] font-black uppercase text-indigo-400 tracking-widest">{alert.code}</p>
                                        </div>
                                        <ArrowUpRight className="w-4 h-4 text-white/30 group-hover:text-white transition-all" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>

                    {/* Quick Data Exports */}
                    <Card className="border-none bg-[var(--card-background)] rounded-[2.5rem] shadow-xl shadow-slate-200/40 dark:shadow-none p-8">
                        <h4 className="text-lg font-black text-[var(--foreground)] mb-6 flex items-center gap-2">
                            <FileSpreadsheet className="w-5 h-5 text-emerald-500" />
                            Report Generator
                        </h4>
                        <div className="space-y-3">
                            {[
                                { name: 'Full Staff Payroll (Jan)', format: 'PDF', icon: FileText },
                                { name: 'Student Merit List 2026', format: 'XLSX', icon: FileSpreadsheet },
                                { name: 'Institutional Audit Pack', format: 'ZIP', icon: Zap },
                            ].map((report, i) => (
                                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-[var(--background-secondary)] hover:bg-[var(--card-background)] border border-transparent hover:border-[var(--border)] hover:shadow-lg transition-all cursor-pointer group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-[var(--card-background)] flex items-center justify-center text-[var(--foreground-muted)] group-hover:text-indigo-600 shadow-sm">
                                            <report.icon className="w-4 h-4" />
                                        </div>
                                        <p className="text-xs font-bold text-[var(--foreground-secondary)]">{report.name}</p>
                                    </div>
                                    <div className="text-[9px] font-black uppercase text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded-md">
                                        {report.format}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>

            {/* Bottom Section: Revenue vs Targets */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="border-none bg-[var(--card-background)] rounded-[2.5rem] shadow-xl shadow-slate-200/40 dark:shadow-none p-10">
                    <CardTitle className="text-xl font-black text-[var(--foreground)] mb-8">Revenue Collection Health</CardTitle>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: 'var(--foreground-muted)' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: 'var(--foreground-muted)' }} />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 'bold', backgroundColor: 'var(--card-background)' }}
                                />
                                <Bar dataKey="collected" fill="#6366f1" radius={[10, 10, 0, 0]} barSize={32} />
                                <Bar dataKey="target" fill="var(--background-secondary)" radius={[10, 10, 0, 0]} barSize={32} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card className="border-none bg-[var(--card-background)] rounded-[2.5rem] shadow-xl shadow-slate-200/40 dark:shadow-none p-10">
                    <CardTitle className="text-xl font-black text-[var(--foreground)] mb-8">Departmental Performance Index</CardTitle>
                    <div className="space-y-8 pt-4">
                        {departmentPerformance.map((dept, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <h5 className="text-sm font-black text-[var(--foreground-secondary)] uppercase tracking-tight">{dept.name}</h5>
                                    <span className="text-sm font-black text-[var(--foreground)]">{dept.score}%</span>
                                </div>
                                <div className="h-3 w-full bg-[var(--background-secondary)] rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all duration-1000"
                                        style={{ width: `${dept.score}%`, backgroundColor: dept.color }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* AI Strategic Recommendation Footer */}
            <div className="p-10 rounded-[2.5rem] bg-indigo-600 shadow-2xl shadow-indigo-600/30 text-white relative overflow-hidden group">
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="space-y-4 max-w-2xl">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center border border-white/20 backdrop-blur-md">
                                <Zap className="w-6 h-6 text-indigo-200" />
                            </div>
                            <h4 className="text-2xl font-black">AI Strategic Recommendation</h4>
                        </div>
                        <p className="text-indigo-100/70 text-base font-medium leading-relaxed">
                            Based on current growth vectors, the school IT infrastructure will reach 90% capacity by Q3. We recommend initiating the server expansion program or migrating the student media vault to the cloud to prevent performance degradation during peak exam seasons.
                        </p>
                    </div>
                    <Button className="h-16 px-12 rounded-[2rem] bg-white text-indigo-600 hover:bg-indigo-50 font-black uppercase tracking-widest text-xs shadow-2xl active:scale-95 transition-all w-full md:w-auto">
                        Acknowledge & Plan
                    </Button>
                </div>
                <div className="absolute top-0 right-0 p-10 transform translate-x-20 -translate-y-20 opacity-5">
                    <BarChart3 className="w-80 h-80" />
                </div>
            </div>
        </div>
    )
}
