'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
    Plus,
    Search,
    Filter,
    MoreVertical,
    Eye,
    Edit2,
    Trash2,
    Download,
    UserPlus,
    ChevronRight,
    Users,
    FileText,
    Mail,
    Phone,
    IdCard,
    CheckCircle2,
    XCircle,
    Clock,
    UserCheck,
    GraduationCap,
    ChevronDown
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from 'sonner'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'
import { StatusChangeDialog } from '@/components/ui/status-change-dialog'
import { getStudents, updateStudentStatus, Student as StudentType } from '@/app/(admin)/actions'

interface Student extends StudentType { }

const mockStudents: Student[] = [
    { id: 1, admissionNo: '20260001', rollNo: '1', firstName: 'Aarav', lastName: 'Sharma', className: 'Class 10', section: 'A', status: 'active', phone: '+91 98765 43210', email: 'aarav.s@gmail.com' },
    { id: 2, admissionNo: '20260002', rollNo: '2', firstName: 'Priya', lastName: 'Patel', className: 'Class 10', section: 'A', status: 'active', phone: '+91 98765 43211', email: 'priya.p@gmail.com' },
    { id: 3, admissionNo: '20260003', rollNo: '1', firstName: 'Ishaan', lastName: 'Gupta', className: 'Class 9', section: 'B', status: 'active', phone: '+91 98765 43212', email: 'ishaan.g@gmail.com' },
    { id: 4, admissionNo: '20260004', rollNo: '5', firstName: 'Ananya', lastName: 'Singh', className: 'Class 10', section: 'C', status: 'suspended', phone: '+91 98765 43213', email: 'ananya.s@gmail.com' },
    { id: 5, admissionNo: '20250892', rollNo: '12', firstName: 'Kabir', lastName: 'Varma', className: 'Class 8', section: 'A', status: 'left', phone: '+91 98765 43214', email: 'kabir.v@gmail.com' },
]

export default function StudentDirectoryPage() {
    const [students, setStudents] = useState<Student[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false)
    const [selectedStudentForStatus, setSelectedStudentForStatus] = useState<Student | null>(null)

    useEffect(() => {
        const fetchStudents = async () => {
            setIsLoading(true)
            const response = await getStudents(searchQuery)
            if (response.success) {
                setStudents(response.data.items)
            }
            setIsLoading(false)
        }

        const timer = setTimeout(fetchStudents, 300) // Debounce search
        return () => clearTimeout(timer)
    }, [searchQuery])

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'active': return 'bg-emerald-50 text-emerald-600 border-emerald-100'
            case 'suspended': return 'bg-amber-50 text-amber-600 border-amber-100'
            case 'left': return 'bg-red-50 text-red-600 border-red-100'
            default: return 'bg-slate-50 text-slate-600 border-slate-100'
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'active': return <CheckCircle2 className="w-3 h-3" />
            case 'suspended': return <Clock className="w-3 h-3" />
            case 'left': return <XCircle className="w-3 h-3" />
            default: return <UserCheck className="w-3 h-3" />
        }
    }

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <Breadcrumbs items={[{ label: 'Student Hub' }]} />
                    <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">Student Directory</h1>
                    <p className="text-[var(--foreground-secondary)] mt-1">Manage global student records, attendance overview, and admissions.</p>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        className="rounded-2xl border-[var(--border)] h-12 px-5 font-bold shadow-sm"
                        onClick={() => toast.info('Preparing data for export...', { description: 'Your CSV file will be ready in a few seconds.' })}
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Export Data
                    </Button>

                    <Link href="/admin/students/new">
                        <Button className="gap-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 px-6 h-12 font-bold transform hover:scale-105 transition-all text-white">
                            <UserPlus className="w-5 h-5 mr-1" />
                            New Admission
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Advanced Search & Filtering Area */}
            <Card className="border-none bg-[var(--card-background)] rounded-[2rem] shadow-xl shadow-slate-200/40 dark:shadow-none p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--foreground-muted)] group-focus-within:text-indigo-500 transition-colors" />
                        <Input
                            placeholder="Find student by name, admission ID, or roll number..."
                            className="h-14 pl-12 rounded-2xl border-[var(--border)] bg-[var(--background-secondary)] shadow-inner text-base font-semibold focus:bg-[var(--card-background)] focus:ring-indigo-500/20 transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" className="h-14 px-6 rounded-2xl border-[var(--border)] font-bold bg-[var(--card-background)] hover:bg-[var(--background-secondary)] group">
                            <GraduationCap className="w-5 h-5 mr-3 text-indigo-500 group-hover:scale-110 transition-transform" />
                            All Classes
                            <ChevronDown className="w-4 h-4 ml-3 text-[var(--foreground-muted)]" />
                        </Button>
                        <Button variant="outline" className="h-14 px-6 rounded-2xl border-[var(--border)] font-bold bg-[var(--card-background)] hover:bg-[var(--background-secondary)] group">
                            <Users className="w-5 h-5 mr-3 text-emerald-500 group-hover:scale-110 transition-transform" />
                            Status: Active
                            <ChevronDown className="w-4 h-4 ml-3 text-[var(--foreground-muted)]" />
                        </Button>
                        <Button variant="outline" size="icon" className="h-14 w-14 rounded-2xl border-[var(--border)] bg-[var(--card-background)] hover:bg-[var(--background-secondary)]">
                            <Filter className="w-5 h-5 text-[var(--foreground-secondary)]" />
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Quick Stats Toolbar */}
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[var(--foreground)]">1,280</span>
                        <span className="text-xs font-black uppercase tracking-widest text-[var(--foreground-muted)]">Enrolled Students</span>
                    </div>
                    <div className="w-px h-4 bg-[var(--border)]" />
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-emerald-600">1,245</span>
                        <span className="text-xs font-black uppercase tracking-widest text-[var(--foreground-muted)]">Present Today</span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-[var(--foreground-muted)]">Rows per page:</span>
                    <select className="text-xs font-bold text-[var(--foreground)] bg-transparent outline-none cursor-pointer">
                        <option>10</option>
                        <option>25</option>
                        <option>50</option>
                    </select>
                </div>
            </div>

            {/* Premium Student Table */}
            <Card className="border-none bg-[var(--card-background)] rounded-[2.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-none overflow-hidden">
                <div className="overflow-x-auto overflow-y-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[var(--background-secondary)]/50 border-b border-[var(--border)]">
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--foreground-secondary)]">
                                    <div className="flex items-center gap-3">
                                        <input type="checkbox" className="w-4 h-4 rounded border-[var(--border)] accent-indigo-600" />
                                        Student Profile
                                    </div>
                                </th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--foreground-secondary)]">Class & Section</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--foreground-secondary)]">Contact Details</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--foreground-secondary)]">Enrollment Admission</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--foreground-secondary)] text-right">Settings</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-12 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                                            <p className="text-sm font-bold text-[var(--foreground-secondary)]">Searching records...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : students.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-12 text-center text-[var(--foreground-secondary)] font-bold">
                                        No students found matching your search.
                                    </td>
                                </tr>
                            ) : students.map((student) => (
                                <tr key={student.id} className="group hover:bg-indigo-50/30 dark:hover:bg-indigo-900/20 border-b border-[var(--border)] transition-all duration-300">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <input type="checkbox" className="w-4 h-4 rounded border-[var(--border)] accent-indigo-600" />
                                            <div className="relative">
                                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center text-[var(--foreground-secondary)] font-bold text-sm shadow-sm border border-[var(--card-background)] overflow-hidden group-hover:scale-105 transition-transform">
                                                    {student.firstName[0]}{student.lastName[0]}
                                                </div>
                                                <div className={cn(
                                                    "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[var(--card-background)] flex items-center justify-center text-white",
                                                    student.status === 'active' ? 'bg-emerald-500' : 'bg-red-500'
                                                )}>
                                                    {student.status === 'active' ? <CheckCircle2 className="w-2 h-2" /> : <XCircle className="w-2 h-2" />}
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-base font-bold text-[var(--foreground)] group-hover:text-indigo-600 transition-colors leading-tight">{student.firstName} {student.lastName}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)]">Roll #{student.rollNo}</span>
                                                    <Badge className={cn("rounded-md text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 border-none", getStatusStyle(student.status))}>
                                                        <div className="flex items-center gap-1">
                                                            {getStatusIcon(student.status)}
                                                            {student.status}
                                                        </div>
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="space-y-1">
                                            <p className="text-sm font-bold text-[var(--foreground-secondary)]">{student.className}</p>
                                            <div className="flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                <span className="text-xs font-semibold text-[var(--foreground-secondary)]">Section {student.section}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="space-y-1.5">
                                            <div className="flex items-center gap-2 text-xs font-medium text-[var(--foreground-secondary)] hover:text-indigo-600 cursor-pointer">
                                                <Mail className="w-3.5 h-3.5" />
                                                {student.email}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs font-medium text-[var(--foreground-secondary)] hover:text-emerald-600 cursor-pointer">
                                                <Phone className="w-3.5 h-3.5" />
                                                {student.phone}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="space-y-1">
                                            <p className="text-sm font-black text-[var(--foreground)] tracking-tighter">ID: {student.admissionNo}</p>
                                            <p className="text-[10px] font-bold text-[var(--foreground-muted)] uppercase tracking-widest">Adm: June 12, 2025</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="rounded-xl h-10 w-10 text-[var(--foreground-muted)] hover:text-indigo-600 hover:bg-[var(--card-background)] transition-all shadow-none">
                                                    <MoreVertical className="w-5 h-5" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-52 rounded-2xl border-[var(--border)] bg-[var(--card-background)]/95 backdrop-blur-xl shadow-2xl p-2 animate-in slide-in-from-top-1">
                                                <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)] px-3 py-2">Quick Actions</DropdownMenuLabel>
                                                <Link href={`/admin/students/${student.id}`}>
                                                    <DropdownMenuItem className="rounded-xl px-3 py-2.5 font-bold text-sm cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 transition-colors">
                                                        <Eye className="w-4 h-4 mr-3" /> View Profile
                                                    </DropdownMenuItem>
                                                </Link>
                                                <DropdownMenuItem className="rounded-xl px-3 py-2.5 font-bold text-sm cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 transition-colors">
                                                    <Edit2 className="w-4 h-4 mr-3" /> Edit Records
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => toast.success('ID Card generated', { description: 'The print preview will open shortly.' })}
                                                    className="rounded-xl px-3 py-2.5 font-bold text-sm cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:text-emerald-600 transition-colors"
                                                >
                                                    <IdCard className="w-4 h-4 mr-3" /> Issue ID Card
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator className="bg-[var(--border)] my-1" />
                                                <DropdownMenuItem
                                                    onClick={() => {
                                                        setSelectedStudentForStatus(student)
                                                        setIsStatusDialogOpen(true)
                                                    }}
                                                    className="rounded-xl px-3 py-2.5 font-bold text-sm cursor-pointer text-red-500 hover:bg-red-50 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4 mr-3" /> Restrict Student
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination & Footer Info */}
                <div className="px-8 py-6 bg-[var(--background-secondary)]/50 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs font-semibold text-[var(--foreground-secondary)]">
                        Showing <span className="text-[var(--foreground)] font-bold">1 - 5</span> of <span className="text-[var(--foreground)] font-bold">1,280</span> students
                    </p>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="rounded-xl h-9 px-4 font-bold border-[var(--border)] disabled:opacity-50" disabled>Previous</Button>
                        <div className="flex items-center gap-1">
                            <Button size="sm" className="rounded-xl h-9 w-9 font-bold bg-indigo-600 shadow-md shadow-indigo-600/20">1</Button>
                            <Button size="sm" variant="ghost" className="rounded-xl h-9 w-9 font-bold text-[var(--foreground-secondary)] hover:text-indigo-600 hover:bg-[var(--card-background)]">2</Button>
                            <Button size="sm" variant="ghost" className="rounded-xl h-9 w-9 font-bold text-[var(--foreground-secondary)] hover:text-indigo-600 hover:bg-[var(--card-background)] px-0">...</Button>
                            <Button size="sm" variant="ghost" className="rounded-xl h-9 w-9 font-bold text-[var(--foreground-secondary)] hover:text-indigo-600 hover:bg-[var(--card-background)]">128</Button>
                        </div>
                        <Button variant="outline" size="sm" className="rounded-xl h-9 px-4 font-bold border-[var(--border)] text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:border-indigo-200">Next</Button>
                    </div>
                </div>
            </Card>

            {/* Empty State / Bottom Helper */}
            <div className="p-8 rounded-[2.5rem] bg-indigo-950 text-white flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden group shadow-2xl">
                <div className="relative z-10 space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center border border-indigo-400/20">
                            <UserPlus className="w-6 h-6 text-indigo-400" />
                        </div>
                        <h4 className="text-xl font-bold">New Batch Admission?</h4>
                    </div>
                    <p className="text-indigo-200/60 text-sm max-w-xl font-medium leading-relaxed">
                        Use our bulk enrollment tool to onboard hundreds of students at once via Excel. Our validator will ensure data integrity before importing.
                    </p>
                </div>
                <div className="flex items-center gap-4 relative z-10 w-full lg:w-auto">
                    <Button variant="outline" className="flex-1 lg:flex-none h-14 rounded-2xl border-indigo-500/30 text-white hover:bg-indigo-900 font-bold px-8">
                        Get CSV Template
                    </Button>
                    <Button className="flex-1 lg:flex-none h-14 rounded-2xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold px-8 shadow-xl shadow-indigo-500/20">
                        Start Bulk Import
                    </Button>
                </div>
                {/* Decorative blob */}
                <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-indigo-800/20 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000" />
            </div>

            <StatusChangeDialog
                isOpen={isStatusDialogOpen}
                onOpenChange={setIsStatusDialogOpen}
                title="Student Exit Clearance"
                entityName={selectedStudentForStatus ? `${selectedStudentForStatus.firstName} ${selectedStudentForStatus.lastName} (${selectedStudentForStatus.admissionNo})` : ''}
                onConfirm={async (data) => {
                    if (selectedStudentForStatus) {
                        const loadingToast = toast.loading('Updating student status...')
                        const response = await updateStudentStatus(selectedStudentForStatus.id, data.status as any)
                        toast.dismiss(loadingToast)

                        if (response.success) {
                            toast.success('Status Updated', { description: response.message })
                            // Refresh local state
                            setStudents(prev => prev.map(s => s.id === selectedStudentForStatus.id ? { ...s, status: data.status as any } : s))
                        } else {
                            toast.error('Update Failed', { description: response.message })
                        }
                    }
                }}
            />
        </div>
    )
}
