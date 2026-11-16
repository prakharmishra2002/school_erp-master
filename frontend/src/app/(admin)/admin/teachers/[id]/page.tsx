'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    ChevronRight,
    User,
    Phone,
    Mail,
    Building2,
    Calendar,
    BookOpen,
    FileText,
    ClipboardCheck,
    Briefcase,
    ShieldCheck,
    History,
    MoreHorizontal,
    Edit3,
    Printer,
    Download,
    Award,
    Clock,
    Zap,
    Users,
    DollarSign,
    CheckCircle2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock staff data
const staffData = {
    id: 'TCH260001',
    firstName: 'Suresh',
    lastName: 'Kumar',
    department: 'Science Faculty',
    designation: 'Senior Lecturer',
    employmentType: 'Permanent',
    joiningDate: '2022-06-15',
    status: 'active',
    phone: '+91 98765 00001',
    email: 'suresh.k@school.edu',
    address: 'B-402, Royal Residency, Andheri West, Mumbai - 400053',
    aadhaar: 'XXXX-XXXX-1122',
    pan: 'ABCDE1234F',
    salary: 65000,
    qualifications: 'M.Sc. Physics, B.Ed.',
    experience: '8.5 Years',
    assignedClasses: [
        { class: 'Class 10', section: 'A', subject: 'Physics' },
        { class: 'Class 9', section: 'B', subject: 'General Science' },
        { class: 'Class 10', section: 'C', subject: 'Physics Lab' }
    ],
    schedule: [
        { day: 'Mon', periods: ['P1: 10-A', 'P3: 9-B', 'P5: 10-C'] },
        { day: 'Tue', periods: ['P2: 10-A', 'P4: 10-C', 'P6: 9-B'] },
        { day: 'Wed', periods: ['P1: 9-B', 'P3: 10-A', 'P5: 10-C'] },
    ]
}

export default function StaffProfilePage({ params }: { params: { id: string } }) {
    const [activeTab, setActiveTab] = useState('overview')

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-12">
            {/* Navigation & Toolbar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <Link href="/admin/teachers" className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors">Staff Hub</Link>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-bold text-indigo-600">{staffData.id}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="rounded-xl h-10 border-slate-200 font-bold px-4 hover:bg-slate-50">
                        <Printer className="w-4 h-4 mr-2" />
                        Staff ID
                    </Button>
                    <Button variant="outline" className="rounded-xl h-10 border-slate-200 font-bold px-4 hover:bg-slate-50">
                        <Download className="w-4 h-4 mr-2" />
                        Contract
                    </Button>
                    <Button className="rounded-xl h-10 bg-indigo-600 hover:bg-indigo-700 font-bold px-6 shadow-lg shadow-indigo-600/20 text-white">
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit Profile
                    </Button>
                </div>
            </div>

            {/* Employee Hero Card */}
            <Card className="border-none bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/40 overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-8 z-10">
                    <div className="flex items-center gap-3">
                        <Badge className="rounded-full bg-emerald-50 text-emerald-600 border-none font-black text-[9px] uppercase px-4 py-1.5 shadow-none">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 animate-pulse" />
                            Official Active
                        </Badge>
                        <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 text-slate-400 hover:bg-slate-100">
                            <MoreHorizontal className="w-5 h-5" />
                        </Button>
                    </div>
                </div>

                <CardContent className="p-10">
                    <div className="flex flex-col lg:flex-row gap-10">
                        {/* Avatar & Key ID */}
                        <div className="flex flex-col items-center lg:items-start shrink-0">
                            <div className="w-44 h-44 rounded-[2.5rem] bg-slate-50 border-4 border-white shadow-2xl flex items-center justify-center text-slate-200 overflow-hidden relative group/img">
                                <User className="w-24 h-24" />
                                <div className="absolute inset-0 bg-indigo-600/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                                    <Zap className="w-8 h-8 text-white" />
                                </div>
                            </div>
                            <div className="mt-6 text-center lg:text-left">
                                <h1 className="text-3xl font-black text-slate-800 tracking-tight leading-none mb-2">{staffData.firstName} {staffData.lastName}</h1>
                                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center justify-center lg:justify-start gap-2">
                                    <Briefcase className="w-4 h-4" />
                                    {staffData.id}
                                </p>
                            </div>
                        </div>

                        {/* Professional Snapshot */}
                        <div className="flex-1 space-y-8">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { label: 'Department', value: staffData.department, icon: Building2, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                                    { label: 'Experience', value: staffData.experience, icon: Award, color: 'text-amber-600', bg: 'bg-amber-50' },
                                    { label: 'Availability', value: 'Present Today', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                                    { label: 'Workload', value: '24 Per/Week', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
                                ].map((stat, i) => (
                                    <div key={i} className="p-5 rounded-3xl bg-slate-50/50 border border-slate-100/50 hover:bg-white hover:shadow-xl hover:shadow-slate-200/40 transition-all group/stat">
                                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3", stat.bg, stat.color)}>
                                            <stat.icon className="w-5 h-5 group-hover/stat:scale-110 transition-transform" />
                                        </div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{stat.label}</p>
                                        <p className="text-sm font-bold text-slate-700 leading-tight">{stat.value}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Essential Contacts */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                        <Phone className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">Mobile Contact</p>
                                        <p className="text-sm font-bold text-slate-800">{staffData.phone}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                        <Mail className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">Official Email</p>
                                        <p className="text-sm font-bold text-slate-800">{staffData.email}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Detailed Tabs System */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
                <TabsList className="bg-slate-100/50 p-1.5 rounded-2xl h-auto self-start border border-slate-200/50 shadow-sm backdrop-blur-md">
                    <TabsTrigger value="overview" className="rounded-xl px-6 py-2.5 font-bold data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm transition-all">
                        <Users className="w-4 h-4 mr-2" /> Professional Bio
                    </TabsTrigger>
                    <TabsTrigger value="schedule" className="rounded-xl px-6 py-2.5 font-bold data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm transition-all">
                        <Calendar className="w-4 h-4 mr-2" /> Class Schedule
                    </TabsTrigger>
                    <TabsTrigger value="payroll" className="rounded-xl px-6 py-2.5 font-bold data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm transition-all">
                        <DollarSign className="w-4 h-4 mr-2" /> Payroll & HR
                    </TabsTrigger>
                    <TabsTrigger value="documents" className="rounded-xl px-6 py-2.5 font-bold data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm transition-all">
                        <ShieldCheck className="w-4 h-4 mr-2" /> Compliance
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <Card className="border-none bg-white rounded-[2rem] shadow-xl shadow-slate-200/30 overflow-hidden">
                            <CardHeader className="p-8 pb-4">
                                <CardTitle className="text-xl font-bold flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                                        <ClipboardCheck className="w-5 h-5" />
                                    </div>
                                    Employment Identity
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 pt-4 space-y-8">
                                <div className="grid grid-cols-2 gap-y-8 gap-x-4">
                                    {[
                                        { label: 'Full Official Name', value: `${staffData.firstName} ${staffData.lastName}` },
                                        { label: 'Primary Designation', value: staffData.designation },
                                        { label: 'Staff Department', value: staffData.department },
                                        { label: 'Employment Status', value: staffData.employmentType },
                                        { label: 'Date of Joining', value: staffData.joiningDate },
                                        { label: 'Qualifications', value: staffData.qualifications },
                                        { label: 'ID Proof (Aadhaar)', value: staffData.aadhaar },
                                        { label: 'Tax ID (PAN)', value: staffData.pan },
                                    ].map((field, i) => (
                                        <div key={i} className="space-y-1">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{field.label}</p>
                                            <p className="text-sm font-bold text-slate-800">{field.value}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                                    <div className="flex items-start gap-4">
                                        <Building2 className="w-5 h-5 text-indigo-600 mt-1 shrink-0" />
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Local Residential Address</p>
                                            <p className="text-sm font-bold text-slate-700 leading-relaxed">{staffData.address}</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recent Performance Metrics */}
                        <div className="space-y-8">
                            <Card className="border-none bg-white rounded-[2rem] shadow-xl shadow-slate-200/30 overflow-hidden">
                                <CardHeader className="p-8 pb-4">
                                    <CardTitle className="text-xl font-bold flex items-center gap-3">
                                        <History className="w-5 h-5 text-emerald-500" />
                                        Recent HR Feed
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-8 pt-2 space-y-6">
                                    {[
                                        { title: 'Salary Credited', desc: 'Month of Jan 2026', date: 'Yesterday', icon: DollarSign, bg: 'bg-emerald-50', color: 'text-emerald-500' },
                                        { title: 'Leave Approved', desc: 'Medical leave (2 days)', date: '3 days ago', icon: Calendar, bg: 'bg-indigo-50', color: 'text-indigo-500' },
                                        { title: 'Credential Reset', desc: 'System Portal Login', date: 'Jan 10, 2026', icon: Zap, bg: 'bg-amber-50', color: 'text-amber-500' },
                                    ].map((log, i) => (
                                        <div key={i} className="flex gap-4 group/log">
                                            <div className={cn("w-10 h-10 shrink-0 rounded-xl flex items-center justify-center transition-transform group-hover/log:scale-110", log.bg, log.color)}>
                                                <log.icon className="w-5 h-5" />
                                            </div>
                                            <div className="flex-1 pb-6 border-b border-slate-50 last:border-none last:pb-0">
                                                <div className="flex items-center justify-between mb-1">
                                                    <p className="text-sm font-bold text-slate-800">{log.title}</p>
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase">{log.date}</span>
                                                </div>
                                                <p className="text-xs font-semibold text-slate-500">{log.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="schedule" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <Card className="border-none bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/40 p-10">
                        <div className="flex items-center justify-between mb-8">
                            <CardTitle className="text-2xl font-black text-slate-800">Weekly Academic Load</CardTitle>
                            <Button className="rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border-none font-bold">
                                Modify Weekly Routine
                            </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {staffData.schedule.map((day, i) => (
                                <div key={i} className="space-y-4">
                                    <div className="flex items-center justify-between px-2">
                                        <h4 className="text-lg font-black text-slate-800">{day.day}</h4>
                                        <Badge variant="outline" className="rounded-lg border-slate-100 font-bold bg-slate-50 text-slate-500 text-[10px]">
                                            {day.periods.length} Periods
                                        </Badge>
                                    </div>
                                    <div className="space-y-3">
                                        {day.periods.map((period, j) => (
                                            <div key={j} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-200 hover:bg-white transition-all group flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-2 h-2 rounded-full bg-indigo-500" />
                                                    <span className="text-sm font-bold text-slate-700">{period}</span>
                                                </div>
                                                <ChevronRight className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Bottom Caution Zone */}
            <div className="p-8 rounded-[2.5rem] bg-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden group">
                <div className="relative z-10 flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-red-500 text-white flex items-center justify-center shadow-lg shadow-red-500/30 group-hover:rotate-12 transition-transform">
                        <ShieldCheck className="w-7 h-7" />
                    </div>
                    <div>
                        <h4 className="text-lg font-bold">HR Compliance Lock</h4>
                        <p className="text-slate-400 text-sm font-medium">Restricting this employee will block all biometric attendance and portal access instantly.</p>
                    </div>
                </div>
                <Button variant="destructive" className="relative z-10 h-14 px-10 rounded-2xl bg-red-600 hover:bg-red-700 font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-red-600/20">
                    Terminate Employment
                </Button>
                <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-slate-800 rounded-full blur-3xl" />
            </div>
        </div>
    )
}
