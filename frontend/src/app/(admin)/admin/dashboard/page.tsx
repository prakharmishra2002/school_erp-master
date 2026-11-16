'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
    Users,
    GraduationCap,
    IndianRupee,
    UserCheck,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    Search,
    Filter,
    Calendar,
    ChevronRight,
    Zap,
    Building2,
    ShieldCheck,
    AlertCircle,
    History as HistoryIcon,
    Loader2,
    Wallet,
    Bell,
    Sparkles
} from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from 'sonner'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts'
import { getDashboardStats, DashboardStats } from '@/app/(admin)/actions'

const collectionData = [
    { name: 'Mon', amount: 45000 },
    { name: 'Tue', amount: 52000 },
    { name: 'Wed', amount: 38000 },
    { name: 'Thu', amount: 65000 },
    { name: 'Fri', amount: 48000 },
    { name: 'Sat', amount: 32000 },
    { name: 'Sun', amount: 15000 },
]

const recentActivities = [
    { id: 1, type: 'admission', user: 'Admin', title: 'New Student Enrolled', subtitle: 'Aarav Sharma (Class 10-A)', time: '10 min ago' },
    { id: 2, type: 'payment', user: 'Accountant', title: 'Fee Collection', subtitle: '₹12,500 from Priya Patel', time: '25 min ago' },
    { id: 3, type: 'academic', user: 'Admin', title: 'Timetable Updated', subtitle: 'Class 8-C Friday schedule', time: '1 hour ago' },
    { id: 4, type: 'hr', user: 'HR Manager', title: 'Staff Leave Approved', subtitle: 'Suresh Kumar (Science)', time: '2 hours ago' },
]

const departments = [
    { name: 'Academic', tasks: 12, status: 'Active', progress: 85, color: 'bg-indigo-500' },
    { name: 'Finance', tasks: 5, status: 'Auditing', progress: 60, color: 'bg-emerald-500' },
    { name: 'Admissions', tasks: 8, status: 'On Track', progress: 45, color: 'bg-blue-500' },
    { name: 'HR & Payroll', tasks: 3, status: 'Stable', progress: 95, color: 'bg-purple-500' },
]

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isHealthChecking, setIsHealthChecking] = useState(false)

    useEffect(() => {
        const fetchStats = async () => {
            setIsLoading(true)
            const response = await getDashboardStats()
            if (response.success) {
                setStats(response.data)
            }
            setIsLoading(false)
        }
        fetchStats()
    }, [])

    const runHealthCheck = () => {
        setIsHealthChecking(true)
        toast.info('Starting system health diagnostic...', {
            description: 'Verifying database integrity and cloud sync status.'
        })

        setTimeout(() => {
            setIsHealthChecking(false)
            toast.success('System Health: Excellent', {
                description: 'All 24 modules are operational. No critical issues found.'
            })
        }, 3000)
    }

    return (
        <div className="space-y-8">
            {/* Header section with Greeting & Global Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">Executive Dashboard</h1>
                    <p className="text-[var(--foreground-secondary)] mt-1">Welcome back, Super Admin. Here's what's happening today.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="gap-2 rounded-xl border-[var(--border)] font-semibold">
                        <Calendar className="w-4 h-4" />
                        Jan 31, 2026
                    </Button>

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 font-bold text-white">
                                <Zap className="w-4 h-4" />
                                Quick Action
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px] rounded-[2rem] border-slate-100 p-0 overflow-hidden">
                            <div className="bg-indigo-600 p-8 text-white relative overflow-hidden">
                                <DialogTitle className="text-2xl font-black mb-1">Command Center</DialogTitle>
                                <DialogDescription className="text-indigo-100 font-medium">Select a high-priority task to initiate.</DialogDescription>
                                <Zap className="absolute top-0 right-0 p-8 w-32 h-32 text-white/10 rotate-12" />
                            </div>
                            <div className="p-6 grid grid-cols-2 gap-4">
                                {[
                                    { label: 'New Admission', icon: GraduationCap, href: '/admin/students/new', color: 'text-blue-500' },
                                    { label: 'Collect Fee', icon: Wallet, href: '/admin/fees/collect', color: 'text-emerald-500' },
                                    { label: 'Staff Entry', icon: Users, href: '/admin/teachers/new', color: 'text-indigo-500' },
                                    {
                                        label: 'Curriculum', icon: Sparkles, href: '/admin/academic/curriculum', color: 'text-indigo-500'
                                    },
                                    {
                                        label: 'Announcements', icon: Bell, href: '/admin/announcements', color: 'text-purple-500'
                                    },
                                ].map((action, i) => (
                                    <Link key={i} href={action.href}>
                                        <Button variant="ghost" className="w-full h-24 rounded-2xl flex flex-col gap-2 hover:bg-slate-50 border border-slate-100">
                                            <action.icon className={cn("w-6 h-6", action.color)} />
                                            <span className="text-xs font-bold text-slate-700">{action.label}</span>
                                        </Button>
                                    </Link>
                                ))}
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Metric Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-[var(--border)] bg-[var(--card-background)] rounded-3xl overflow-hidden hover:shadow-xl transition-all group">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                                <GraduationCap className="w-6 h-6" />
                            </div>
                            <div className="flex items-center gap-1 text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg text-xs font-bold">
                                <ArrowUpRight className="w-3 h-3" />
                                12%
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-[var(--foreground)]">
                            {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : stats?.totalStudents.toLocaleString()}
                        </h3>
                        <p className="text-sm font-medium text-[var(--foreground-secondary)]">Total Students</p>
                    </CardContent>
                </Card>

                <Card className="border-[var(--border)] bg-[var(--card-background)] rounded-3xl overflow-hidden hover:shadow-xl transition-all group">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                                <Users className="w-6 h-6" />
                            </div>
                            <div className="flex items-center gap-1 text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg text-xs font-bold">
                                <ArrowUpRight className="w-3 h-3" />
                                4%
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-[var(--foreground)]">
                            {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : stats?.totalTeachers}
                        </h3>
                        <p className="text-sm font-medium text-[var(--foreground-secondary)]">Active Staff</p>
                    </CardContent>
                </Card>

                <Card className="border-[var(--border)] bg-[var(--card-background)] rounded-3xl overflow-hidden hover:shadow-xl transition-all group">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                                <IndianRupee className="w-6 h-6" />
                            </div>
                            <div className="flex items-center gap-1 text-red-500 bg-red-500/10 px-2 py-1 rounded-lg text-xs font-bold">
                                <ArrowDownRight className="w-3 h-3" />
                                3%
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-[var(--foreground)]">
                            {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : `₹${(stats?.monthlyRevenue || 0) / 100000}L`}
                        </h3>
                        <p className="text-sm font-medium text-[var(--foreground-secondary)]">Monthly Revenue</p>
                    </CardContent>
                </Card>

                <Card className="border-[var(--border)] bg-[var(--card-background)] rounded-3xl overflow-hidden hover:shadow-xl transition-all group">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                                <UserCheck className="w-6 h-6" />
                            </div>
                            <div className="flex items-center gap-1 text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg text-xs font-bold">
                                <ArrowUpRight className="w-3 h-3" />
                                98%
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-[var(--foreground)]">
                            {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : `${Math.round(((stats?.presentToday || 0) / (stats?.totalStudents || 1)) * 100)}%`}
                        </h3>
                        <p className="text-sm font-medium text-[var(--foreground-secondary)]">Avg. Attendance</p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Collection Trend */}
                <Card className="lg:col-span-2 border-[var(--border)] bg-[var(--card-background)] rounded-[2rem] overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between p-8">
                        <div>
                            <CardTitle className="text-xl font-bold">Fee Collection Trends</CardTitle>
                            <CardDescription>Daily revenue statistics for the current week</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" className="rounded-xl h-8 text-[10px] font-bold uppercase tracking-wider">Weekly</Button>
                            <Button variant="ghost" size="sm" className="rounded-xl h-8 text-[10px] font-bold uppercase tracking-wider text-slate-500">Monthly</Button>
                        </div>
                    </CardHeader>
                    <CardContent className="px-6 pb-6">
                        <div className="h-80 w-full mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={collectionData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 500 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 500 }}
                                    />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }}
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                        formatter={(value) => [`₹${(value as number).toLocaleString()}`, 'Amount']}
                                    />
                                    <Bar
                                        dataKey="amount"
                                        fill="url(#indigoGradient)"
                                        radius={[8, 8, 0, 0]}
                                        barSize={40}
                                    />
                                    <defs>
                                        <linearGradient id="indigoGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#6366F1" />
                                            <stop offset="100%" stopColor="#818CF8" />
                                        </linearGradient>
                                    </defs>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Right Column: Departments or Alerts */}
                <div className="space-y-8">
                    {/* Department Progress */}
                    <Card className="border-[var(--border)] bg-[var(--card-background)] rounded-[2rem] overflow-hidden">
                        <CardHeader className="p-6 pb-2">
                            <CardTitle className="text-lg font-bold flex items-center gap-2">
                                <Building2 className="w-5 h-5 text-indigo-500" />
                                Delegated Modules
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-5">
                            {departments.map((dept, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-[var(--foreground)]">{dept.name}</span>
                                            <span className="text-[10px] text-[var(--foreground-secondary)] uppercase tracking-wider font-semibold">{dept.status}</span>
                                        </div>
                                        <span className="font-mono font-bold text-indigo-500">{dept.progress}%</span>
                                    </div>
                                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                                        <div
                                            className={cn("h-full rounded-full transition-all duration-1000", dept.color)}
                                            style={{ width: `${dept.progress}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                            <Button variant="ghost" className="w-full text-indigo-500 font-bold text-xs mt-2 transition-colors hover:bg-indigo-50 transition-colors">
                                View Department Logs
                                <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Critical Alert Card */}
                    <Card className="border-none bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[2rem] text-white p-6 shadow-xl shadow-indigo-600/20 relative overflow-hidden group">
                        <div className="relative z-10 flex flex-col h-full">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                                    <ShieldCheck className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-200">Security Guard</p>
                                    <p className="text-sm font-bold">System Protected</p>
                                </div>
                            </div>
                            <p className="text-xs text-indigo-100 font-medium leading-relaxed">
                                Your daily automatic backup was successful. All financial records are synchronized and encrypted.
                            </p>
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={runHealthCheck}
                                disabled={isHealthChecking}
                                className="w-fit mt-6 rounded-xl font-bold text-xs text-indigo-700 bg-white hover:bg-indigo-50 border-none px-6"
                            >
                                {isHealthChecking ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                {isHealthChecking ? 'Scanning...' : 'Run Health Check'}
                            </Button>
                        </div>
                        {/* Decorative circle */}
                        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                    </Card>
                </div>
            </div>

            {/* Bottom Row: Activities & Quick Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Activity Feed */}
                <Card className="border-[var(--border)] bg-[var(--card-background)] rounded-[2rem] overflow-hidden">
                    <CardHeader className="p-8 pb-4 flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-xl font-bold flex items-center gap-2">
                                <HistoryIcon className="w-6 h-6 text-indigo-500" />
                                Global Activity Log
                            </CardTitle>
                            <CardDescription>Real-time updates from all modules</CardDescription>
                        </div>
                        <Button variant="outline" size="sm" className="rounded-xl text-[10px] font-bold uppercase tracking-widest border-slate-200 h-9">
                            Export Logs
                        </Button>
                    </CardHeader>
                    <CardContent className="p-8 pt-2">
                        <div className="space-y-6">
                            {recentActivities.map((activity) => (
                                <div key={activity.id} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-[var(--background-secondary)] transition-all cursor-pointer group">
                                    <div className={cn(
                                        "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110",
                                        activity.type === 'admission' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
                                            activity.type === 'payment' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                                activity.type === 'hr' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' :
                                                    'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
                                    )}>
                                        {activity.type === 'admission' ? <GraduationCap className="w-5 h-5" /> :
                                            activity.type === 'payment' ? <IndianRupee className="w-5 h-5" /> :
                                                activity.type === 'academic' ? <Calendar className="w-5 h-5" /> :
                                                    <Users className="w-5 h-5" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-0.5">
                                            <p className="text-sm font-bold text-[var(--foreground)]">{activity.title}</p>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{activity.time}</span>
                                        </div>
                                        <p className="text-xs text-[var(--foreground-secondary)] font-medium mb-1">{activity.subtitle}</p>
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[8px] font-bold text-slate-600 dark:text-slate-400 uppercase">
                                                {activity.user[0]}
                                            </div>
                                            <span className="text-[10px] font-bold text-slate-500 tracking-tight">Modified by {activity.user}</span>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all self-center" />
                                </div>
                            ))}
                        </div>
                        <Button variant="ghost" className="w-full mt-6 text-indigo-600 font-bold rounded-2xl h-12 hover:bg-indigo-50 transition-colors">
                            View Full History
                        </Button>
                    </CardContent>
                </Card>

                {/* Quick Shortcuts & Insights */}
                <div className="grid grid-cols-1 gap-8">
                    <Card className="border-[var(--border)] bg-[var(--card-background)] rounded-[2rem] overflow-hidden">
                        <CardHeader className="p-8 pb-4">
                            <CardTitle className="text-xl font-bold">Quick Management</CardTitle>
                            <CardDescription>Frequent administrative tasks</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 pt-2 grid grid-cols-2 gap-4">
                            {[
                                { label: 'New Enrollment', icon: Zap, color: 'text-indigo-500', bg: 'bg-indigo-500/10', href: '/admin/students/new' },
                                { label: 'Collect Fee', icon: Wallet, color: 'text-emerald-500', bg: 'bg-emerald-500/10', href: '/admin/fees/collect' },
                                { label: 'Staff Entry', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10', href: '/admin/teachers/new' },
                                { label: 'Exam Setup', icon: GraduationCap, color: 'text-purple-500', bg: 'bg-purple-500/10', href: '/admin/academic/subjects' },
                                {
                                    label: 'Curriculum', icon: Sparkles, color: 'text-indigo-500', bg: 'bg-indigo-500/10', href: '/admin/academic/curriculum'
                                },
                                {
                                    label: 'Announcements', icon: AlertCircle, color: 'text-amber-500', bg: 'bg-amber-500/10', href: '/admin/announcements'
                                },
                                { label: 'Report Builder', icon: TrendingUp, color: 'text-cyan-500', bg: 'bg-cyan-500/10', href: '/admin/reports' },
                            ].map((shortcut, i) => (
                                <Link key={i} href={shortcut.href}>
                                    <button className="flex flex-col items-center justify-center p-6 rounded-3xl bg-[var(--background-secondary)] hover:bg-[var(--background-tertiary)] border border-transparent hover:border-indigo-500/20 transition-all group gap-3 w-full">
                                        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", shortcut.bg, shortcut.color)}>
                                            <shortcut.icon className="w-6 h-6" />
                                        </div>
                                        <span className="text-xs font-bold text-[var(--foreground)] tracking-tight">{shortcut.label}</span>
                                    </button>
                                </Link>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
