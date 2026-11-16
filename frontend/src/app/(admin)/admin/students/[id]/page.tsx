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
    MapPin,
    Calendar,
    GraduationCap,
    FileText,
    History,
    Upload,
    CreditCard,
    ShieldAlert,
    CheckCircle2,
    Clock,
    Download,
    Edit3,
    MoreHorizontal,
    Camera,
    Printer,
    Users,
    AlertCircle,
    ArrowUpRight
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock student data
const studentData = {
    id: '20260001',
    firstName: 'Aarav',
    lastName: 'Sharma',
    gender: 'Male',
    dob: '2010-05-15',
    bloodGroup: 'O+ve',
    admissionDate: '2025-06-12',
    currentClass: 'Class 10',
    section: 'A',
    rollNo: '24',
    status: 'active',
    phone: '+91 98765 43210',
    email: 'aarav.sharma@student.school.edu',
    address: '124, Green Avenue, Sector 15, Near Central Mall, Mumbai - 400001',
    aadhaar: 'XXXX-XXXX-8892',
    attendance: 94.5,
    lastFeePaid: 'Jan 15, 2026',
    feeDue: 0,
    academicRank: '5th / 120',
    guardians: [
        { relation: 'Father', name: 'Rajesh Sharma', phone: '+91 98765 43210', occupation: 'Senior Engineer', isPrimary: true },
        { relation: 'Mother', name: 'Sunita Sharma', phone: '+91 98765 43211', occupation: 'Teacher', isPrimary: false }
    ],
    documents: [
        { type: 'Birth Certificate', name: 'BC_20260001.pdf', size: '1.2MB', date: 'June 12, 2025' },
        { type: 'Previous Marksheet', name: 'Grade9_Report.pdf', size: '2.4MB', date: 'June 12, 2025' },
        { type: 'Aadhaar Copy', name: 'Aadhaar_Aarav.png', size: '800KB', date: 'June 14, 2025' }
    ]
}

export default function StudentProfilePage({ params }: { params: { id: string } }) {
    const [activeTab, setActiveTab] = useState('overview')

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Breadcrumbs & Actions Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <Link href="/admin/students" className="text-sm font-medium text-[var(--foreground-secondary)] hover:text-indigo-600 transition-colors">Students</Link>
                    <ChevronRight className="w-4 h-4 text-[var(--foreground-muted)]" />
                    <span className="text-sm font-bold text-indigo-600 uppercase tracking-widest leading-none">{studentData.id}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="rounded-xl h-10 border-[var(--border)] bg-[var(--card-background)] font-bold px-4 hover:bg-[var(--background-secondary)] text-[var(--foreground-muted)]">
                        <Printer className="w-4 h-4 mr-2" />
                        Print ID Card
                    </Button>
                    <Button variant="outline" size="sm" className="rounded-xl h-10 border-[var(--border)] bg-[var(--card-background)] font-bold px-4 hover:bg-[var(--background-secondary)] text-[var(--foreground-muted)]">
                        <Download className="w-4 h-4 mr-2" />
                        Export Dossier
                    </Button>
                    <Button className="rounded-xl h-10 bg-indigo-600 hover:bg-indigo-700 font-bold px-6 shadow-lg shadow-indigo-600/20 text-white">
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit Profile
                    </Button>
                </div>
            </div>

            {/* Profile Hero Header */}
            <Card className="border-none bg-[var(--card-background)] rounded-[2.5rem] shadow-xl shadow-slate-200/40 dark:shadow-none relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-full border border-emerald-100/50 dark:border-emerald-800/50">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest leading-none">Active Student</span>
                        </div>
                        <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 text-[var(--foreground-muted)] hover:bg-[var(--background-secondary)]">
                            <MoreHorizontal className="w-5 h-5" />
                        </Button>
                    </div>
                </div>

                <CardContent className="p-10">
                    <div className="flex flex-col lg:flex-row gap-10">
                        {/* Avatar & Basic Info */}
                        <div className="flex flex-col items-center lg:items-start shrink-0">
                            <div className="relative group/avatar">
                                <div className="w-40 h-40 rounded-[2.5rem] bg-gradient-to-br from-indigo-500 via-purple-600 to-violet-700 p-1 shadow-2xl shadow-indigo-500/30">
                                    <div className="w-full h-full rounded-[2.3rem] bg-[var(--card-background)] flex items-center justify-center overflow-hidden relative">
                                        <User className="w-20 h-20 text-[var(--background-secondary)]" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center">
                                            <Camera className="w-8 h-8 text-white" />
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-[var(--card-background)] shadow-lg rounded-2xl flex items-center justify-center border-2 border-[var(--background-secondary)]">
                                    <Badge variant="outline" className="p-0 border-none">
                                        <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                                    </Badge>
                                </div>
                            </div>
                            <div className="text-center lg:text-left mt-6">
                                <h2 className="text-3xl font-black text-[var(--foreground)] tracking-tight leading-none mb-2">{studentData.firstName} {studentData.lastName}</h2>
                                <p className="text-sm font-bold text-[var(--foreground-muted)] uppercase tracking-[0.2em] mb-4">Adm: {studentData.id}</p>
                                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                                    <Badge className="rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 border-indigo-100 dark:border-indigo-800/50 hover:bg-indigo-100 transition-colors font-bold px-3 py-1">
                                        {studentData.currentClass} - {studentData.section}
                                    </Badge>
                                    <Badge className="rounded-lg bg-[var(--background-secondary)] text-[var(--foreground-muted)] border-[var(--border)] font-bold px-3 py-1">
                                        Roll No: {studentData.rollNo}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="flex-1 space-y-8">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { label: 'Attendance', value: `${studentData.attendance}%`, icon: Calendar, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
                                    { label: 'Fee Status', value: studentData.feeDue === 0 ? 'Clear' : `₹${studentData.feeDue}`, icon: CreditCard, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
                                    { label: 'Last Exam', value: '420 / 500', icon: GraduationCap, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
                                    { label: 'Rank', value: studentData.academicRank, icon: ArrowUpRight, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
                                ].map((stat, i) => (
                                    <div key={i} className="p-5 rounded-3xl bg-[var(--background-secondary)]/50 border border-[var(--border)] group/stat hover:bg-[var(--card-background)] hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none transition-all cursor-default">
                                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover/stat:rotate-6", stat.bg, stat.color)}>
                                            <stat.icon className="w-5 h-5" />
                                        </div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)] leading-none mb-1">{stat.label}</p>
                                        <p className="text-lg font-bold text-[var(--foreground)] leading-tight">{stat.value}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Contact Shortcuts */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center gap-4 p-4 rounded-2xl bg-[var(--background-secondary)] border border-[var(--border)] hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors group cursor-pointer">
                                    <div className="w-10 h-10 rounded-xl bg-[var(--card-background)] flex items-center justify-center text-[var(--foreground-muted)] group-hover:text-indigo-600 transition-colors shadow-sm">
                                        <Phone className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)] leading-none mb-1">Primary Phone</p>
                                        <p className="text-sm font-bold text-[var(--foreground)] tracking-tight">{studentData.phone}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-4 rounded-2xl bg-[var(--background-secondary)] border border-[var(--border)] hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors group cursor-pointer">
                                    <div className="w-10 h-10 rounded-xl bg-[var(--card-background)] flex items-center justify-center text-[var(--foreground-muted)] group-hover:text-indigo-600 transition-colors shadow-sm">
                                        <Mail className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)] leading-none mb-1">Official Email</p>
                                        <p className="text-sm font-bold text-[var(--foreground)] tracking-tight">{studentData.email}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Detailed Tabs Control */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="bg-[var(--background-secondary)]/50 p-1.5 rounded-2xl h-auto self-start border border-[var(--border)] shadow-sm backdrop-blur-md">
                    <TabsTrigger value="overview" className="rounded-xl px-6 py-2.5 font-bold data-[state=active]:bg-[var(--card-background)] data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm transition-all text-[var(--foreground-muted)]">
                        <User className="w-4 h-4 mr-2" /> Overview
                    </TabsTrigger>
                    <TabsTrigger value="family" className="rounded-xl px-6 py-2.5 font-bold data-[state=active]:bg-[var(--card-background)] data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm transition-all text-[var(--foreground-muted)]">
                        <Users className="w-4 h-4 mr-2" /> Family & Guardians
                    </TabsTrigger>
                    <TabsTrigger value="academic" className="rounded-xl px-6 py-2.5 font-bold data-[state=active]:bg-[var(--card-background)] data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm transition-all text-[var(--foreground-muted)]">
                        <GraduationCap className="w-4 h-4 mr-2" /> Performance
                    </TabsTrigger>
                    <TabsTrigger value="documents" className="rounded-xl px-6 py-2.5 font-bold data-[state=active]:bg-[var(--card-background)] data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm transition-all text-[var(--foreground-muted)]">
                        <FileText className="w-4 h-4 mr-2" /> Documents
                    </TabsTrigger>
                    <TabsTrigger value="history" className="rounded-xl px-6 py-2.5 font-bold data-[state=active]:bg-[var(--card-background)] data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm transition-all text-[var(--foreground-muted)]">
                        <History className="w-4 h-4 mr-2" /> audit logs
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-400">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Identity & Background */}
                        <Card className="border-none bg-[var(--card-background)] rounded-[2rem] shadow-xl shadow-slate-200/30 dark:shadow-none overflow-hidden">
                            <CardHeader className="p-8 pb-4">
                                <CardTitle className="text-xl font-bold flex items-center gap-3 text-[var(--foreground)]">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 flex items-center justify-center">
                                        <AlertCircle className="w-5 h-5" />
                                    </div>
                                    Identity Profile
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 pt-4 space-y-6">
                                <div className="grid grid-cols-2 gap-8">
                                    {[
                                        { label: 'Gender', value: studentData.gender },
                                        { label: 'Date of Birth', value: studentData.dob },
                                        { label: 'Blood Group', value: studentData.bloodGroup },
                                        { label: 'Nationality', value: 'Indian' },
                                        { label: 'Aadhaar ID', value: studentData.aadhaar },
                                        { label: 'Religion', value: 'Hinduism' },
                                        { label: 'Category', value: 'General' },
                                        { label: 'Mother Tongue', value: 'Hindi' },
                                    ].map((field, i) => (
                                        <div key={i} className="space-y-1">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)]">{field.label}</p>
                                            <p className="text-sm font-bold text-[var(--foreground)]">{field.value}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-6 bg-[var(--background-secondary)]/50 rounded-2xl border border-[var(--border)] flex gap-4">
                                    <MapPin className="w-5 h-5 text-indigo-500 shrink-0 mt-1" />
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)]">Current Residential Address</p>
                                        <p className="text-sm font-bold text-[var(--foreground-secondary)] leading-relaxed">{studentData.address}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recent Activity Mini-Feed */}
                        <Card className="border-none bg-[var(--card-background)] rounded-[2rem] shadow-xl shadow-slate-200/30 dark:shadow-none overflow-hidden">
                            <CardHeader className="p-8 pb-4">
                                <CardTitle className="text-xl font-bold flex items-center gap-3 text-[var(--foreground)]">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 flex items-center justify-center">
                                        <History className="w-5 h-5" />
                                    </div>
                                    Student Journey Log
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 pt-4 space-y-6">
                                {[
                                    { title: 'Fee Payment Received', desc: '₹12,400 for Q3 Session', date: 'Jan 15, 2026', icon: CreditCard, color: 'text-emerald-500' },
                                    { title: 'Academic Promotion', desc: 'Promoted to Class 10th-A', date: 'April 02, 2025', icon: GraduationCap, color: 'text-indigo-500' },
                                    { title: 'Registration Complete', desc: 'Initial enrollment recorded', date: 'April 01, 2025', icon: User, color: 'text-[var(--foreground-muted)]' },
                                ].map((log, i) => (
                                    <div key={i} className="flex gap-4 group/log">
                                        <div className="flex flex-col items-center shrink-0">
                                            <div className={cn("w-10 h-10 rounded-xl bg-[var(--background-secondary)] border border-[var(--border)] flex items-center justify-center shadow-sm group-hover/log:scale-110 transition-transform", log.color)}>
                                                <log.icon className="w-4 h-4" />
                                            </div>
                                            {i !== 2 && <div className="w-0.5 flex-1 bg-[var(--border)] my-2" />}
                                        </div>
                                        <div className="pb-8 last:pb-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <p className="text-sm font-bold text-[var(--foreground)]">{log.title}</p>
                                                <span className="text-[10px] font-bold text-[var(--foreground-muted)] uppercase">{log.date}</span>
                                            </div>
                                            <p className="text-xs font-semibold text-[var(--foreground-secondary)] leading-relaxed">{log.desc}</p>
                                        </div>
                                    </div>
                                ))}
                                <Button variant="ghost" className="w-full text-indigo-600 font-bold hover:bg-[var(--background-secondary)] h-12 rounded-xl mt-4">
                                    View Detailed Logs
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="family" className="animate-in fade-in slide-in-from-bottom-2 duration-400">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {studentData.guardians.map((guardian, i) => (
                            <Card key={i} className={cn("border-none rounded-[2.5rem] shadow-xl overflow-hidden", guardian.isPrimary ? "bg-[var(--card-background)] shadow-indigo-500/10 border-t-4 border-indigo-500" : "bg-[var(--background-secondary)]/50 shadow-slate-200/30")}>
                                <CardHeader className="p-8 pb-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm", guardian.isPrimary ? "bg-indigo-600 text-white" : "bg-[var(--card-background)] text-[var(--foreground-muted)] border border-[var(--border)] shadow-sm")}>
                                                {guardian.relation[0]}
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--foreground-muted)]">{guardian.relation}</p>
                                                <CardTitle className="text-xl font-bold text-[var(--foreground)]">{guardian.name}</CardTitle>
                                            </div>
                                        </div>
                                        {guardian.isPrimary && (
                                            <Badge className="rounded-full bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 uppercase text-[9px] font-black px-3 border-none">Primary Contact</Badge>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent className="p-8 pt-4 space-y-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4 p-4 bg-[var(--card-background)] rounded-2xl border border-[var(--border)] shadow-sm">
                                            <Phone className="w-5 h-5 text-[var(--foreground-muted)]" />
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)] mb-0.5">Contact Number</p>
                                                <p className="text-sm font-bold text-[var(--foreground)]">{guardian.phone}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 p-4 bg-[var(--card-background)] rounded-2xl border border-[var(--border)] shadow-sm">
                                            <Mail className="w-5 h-5 text-[var(--foreground-muted)]" />
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)] mb-0.5">Email Address</p>
                                                <p className="text-sm font-bold text-[var(--foreground)]">guardian.contact@example.com</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 p-4 bg-[var(--card-background)] rounded-2xl border border-[var(--border)] shadow-sm">
                                            <Clock className="w-5 h-5 text-[var(--foreground-muted)]" />
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)] mb-0.5">Occupation</p>
                                                <p className="text-sm font-bold text-[var(--foreground)]">{guardian.occupation}</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="documents" className="animate-in fade-in slide-in-from-bottom-2 duration-400">
                    <Card className="border-none bg-[var(--card-background)] rounded-[2.5rem] shadow-xl shadow-slate-200/40 dark:shadow-none p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {studentData.documents.map((doc, i) => (
                                <div key={i} className="p-6 rounded-[2rem] bg-[var(--background-secondary)]/50 border-2 border-[var(--border)] hover:border-indigo-300 dark:hover:border-indigo-800 hover:bg-[var(--card-background)] transition-all group cursor-pointer relative overflow-hidden">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-12 h-12 rounded-2xl bg-[var(--card-background)] flex items-center justify-center text-[var(--foreground-muted)] group-hover:text-indigo-600 transition-colors shadow-sm">
                                            <FileText className="w-6 h-6" />
                                        </div>
                                        <Button variant="ghost" size="icon" className="rounded-xl h-10 w-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Download className="w-5 h-5 text-indigo-600" />
                                        </Button>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500">{doc.type}</p>
                                        <p className="text-sm font-bold text-[var(--foreground)] truncate">{doc.name}</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="text-[10px] font-bold text-[var(--foreground-muted)]">{doc.size}</span>
                                            <span className="text-[var(--border)]">•</span>
                                            <span className="text-[10px] font-bold text-[var(--foreground-muted)]">{doc.date}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div className="p-6 rounded-[2rem] border-2 border-dashed border-[var(--border)] flex flex-col items-center justify-center space-y-3 cursor-pointer hover:bg-[var(--background-secondary)]/50 transition-colors group">
                                <div className="w-12 h-12 rounded-2xl bg-[var(--background-secondary)]/50 flex items-center justify-center text-[var(--foreground-muted)] group-hover:text-indigo-600 transition-colors shadow-none group-hover:bg-[var(--card-background)] group-hover:shadow-sm">
                                    <Upload className="w-6 h-6" />
                                </div>
                                <p className="text-sm font-bold text-[var(--foreground-muted)]">Upload Document</p>
                            </div>
                        </div>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Bottom Floating Warning for Admin */}
            <div className="p-6 rounded-[2.5rem] bg-rose-50 dark:bg-rose-900/20 border-2 border-rose-200/50 dark:border-rose-800/50 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl shadow-rose-500/5">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/30">
                        <ShieldAlert className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-rose-900 dark:text-rose-400 leading-none mb-1">Administrative Critical Zone</h4>
                        <p className="text-xs text-rose-700/80 dark:text-rose-500/80 font-medium">Deactivating this student will freeze all portal access and stop fee generation.</p>
                    </div>
                </div>
                <Button variant="destructive" className="rounded-2xl h-12 px-8 font-black text-xs uppercase tracking-widest bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/20">
                    Deactivate Account
                </Button>
            </div>
        </div>
    )
}
