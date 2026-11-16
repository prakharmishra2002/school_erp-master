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
    Mail,
    Phone,
    Building2,
    ChevronRight,
    Users,
    UserPlus,
    UserCircle,
    CheckCircle2,
    Clock,
    XCircle,
    UserCheck,
    History as HistoryIcon,
    FileText,
    Briefcase,
    Zap
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { toast } from 'sonner'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'
import { StatusChangeDialog } from '@/components/ui/status-change-dialog'
import { getTeachers, Teacher } from '@/app/(admin)/actions'

interface Staff extends Teacher {
    department: string
    designation: string
    type: 'teaching' | 'admin' | 'support'
    joiningDate: string
    subject: string
    className: string
}

const mockStaff: Staff[] = [
    { id: 1, employeeId: 'TCH260001', firstName: 'Suresh', lastName: 'Kumar', department: 'Science', designation: 'Senior Teacher', status: 'active', phone: '+91 98765 00001', email: 'suresh.k@school.edu', type: 'teaching', joiningDate: '2022-06-15', subject: 'Science', className: '10-A' },
    { id: 2, employeeId: 'TCH260002', firstName: 'Meenkashi', lastName: 'Iyer', department: 'Mathematics', designation: 'HOD - Maths', status: 'active', phone: '+91 98765 00002', email: 'meenkashi.i@school.edu', type: 'teaching', joiningDate: '2021-04-10', subject: 'Maths', className: '12-B' },
    { id: 3, employeeId: 'ADM260001', firstName: 'Rajesh', lastName: 'Khanna', department: 'Accounts', designation: 'Bursar', status: 'active', phone: '+91 98765 00003', email: 'rajesh.acc@school.edu', type: 'admin', joiningDate: '2023-01-20', subject: '', className: '' },
    { id: 4, employeeId: 'TCH260003', firstName: 'Anita', lastName: 'Desai', department: 'English', designation: 'Primary Teacher', status: 'on-leave', phone: '+91 98765 00004', email: 'anita.d@school.edu', type: 'teaching', joiningDate: '2024-06-01', subject: 'English', className: '5-C' },
    { id: 5, employeeId: 'ADM260002', firstName: 'Vikram', lastName: 'Singh', department: 'Security', designation: 'Chief Warden', status: 'active', phone: '+91 98765 00005', email: 'vikram.s@school.edu', type: 'admin', joiningDate: '2020-11-15', subject: '', className: '' },
]

export default function StaffDirectoryPage() {
    const [staffList, setStaffList] = useState<Staff[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [activeType, setActiveType] = useState('all')
    const [isOnboarding, setIsOnboarding] = useState(false)
    const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false)
    const [selectedStaffForStatus, setSelectedStaffForStatus] = useState<Staff | null>(null)
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        category: 'teaching',
        department: 'Science',
        designation: '',
        joiningDate: ''
    })

    useEffect(() => {
        const fetchStaff = async () => {
            setIsLoading(true)
            const response = await getTeachers()
            if (response.success) {
                // Adapt Teacher from actions to Staff interface
                const adaptedStaff: Staff[] = response.data.items.map(t => ({
                    ...t,
                    department: t.subject || 'General',
                    designation: 'Faculty',
                    type: 'teaching',
                    joiningDate: new Date().toISOString(),
                    status: t.status
                }))
                setStaffList(adaptedStaff)
            }
            setIsLoading(false)
        }
        fetchStaff()
    }, [])

    const handleOnboard = () => {
        if (!formData.firstName || !formData.lastName || !formData.email) {
            toast.error('Identity Missing', { description: 'Please provide full name and contact details.' })
            return
        }

        const newStaff: Staff = {
            id: staffList.length + 1,
            employeeId: `EMP${260000 + staffList.length + 1}`,
            ...formData,
            type: formData.category as any,
            status: 'active',
            subject: formData.category === 'teaching' ? formData.department : '',
            className: ''
        }

        setStaffList([newStaff, ...staffList])
        setIsOnboarding(false)
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            category: 'teaching',
            department: 'Science',
            designation: '',
            joiningDate: ''
        })
        toast.success('Onboarding Initiated', {
            description: `${newStaff.firstName} ${newStaff.lastName} has been added to the ${newStaff.department} department.`
        })
    }

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'active': return 'bg-emerald-50 text-emerald-600 border-emerald-100'
            case 'on-leave': return 'bg-amber-50 text-amber-600 border-amber-100'
            case 'resigned': return 'bg-red-50 text-red-600 border-red-100'
            default: return 'bg-slate-50 text-slate-600 border-slate-100'
        }
    }

    const filteredStaff = staffList.filter(s => activeType === 'all' || s.type === activeType)

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <Breadcrumbs items={[{ label: 'Staff Directory' }]} />
                    <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">Personnel Management</h1>
                    <p className="text-[var(--foreground-secondary)] mt-1">Manage institutional roles, teaching faculty, and administrative staff.</p>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" className="rounded-2xl border-[var(--border)] h-12 px-5 font-bold shadow-sm">
                        <HistoryIcon className="w-4 h-4 mr-2" />
                        Attendance Logs
                    </Button>

                    <Link href="/admin/teachers/new">
                        <Button className="gap-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 px-6 h-12 font-bold transform hover:scale-105 transition-all text-white">
                            <UserPlus className="w-5 h-5" />
                            Onboard Staff
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Classification Tabs & Search */}
            <Tabs defaultValue="all" onValueChange={setActiveType} className="space-y-6">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                    <TabsList className="bg-[var(--background-secondary)] p-1.5 rounded-2xl h-auto border border-[var(--border)] shadow-sm">
                        <TabsTrigger value="all" className="rounded-xl px-6 py-2.5 font-bold data-[state=active]:bg-[var(--card-background)] data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm transition-all">
                            All Personnel
                        </TabsTrigger>
                        <TabsTrigger value="teaching" className="rounded-xl px-6 py-2.5 font-bold data-[state=active]:bg-[var(--card-background)] data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm transition-all">
                            Teaching Faculty
                        </TabsTrigger>
                        <TabsTrigger value="admin" className="rounded-xl px-6 py-2.5 font-bold data-[state=active]:bg-[var(--card-background)] data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm transition-all">
                            Administration
                        </TabsTrigger>
                    </TabsList>

                    <div className="relative group w-full lg:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--foreground-muted)] group-focus-within:text-indigo-500 transition-colors" />
                        <Input
                            placeholder="Find staff by name or Employee ID..."
                            className="h-12 pl-12 rounded-2xl border-[var(--border)] bg-[var(--card-background)] shadow-sm font-medium focus:ring-indigo-500/10"
                        />
                    </div>
                </div>

                <TabsContent value={activeType} className="space-y-8 animate-in fade-in duration-500">
                    {/* Summary Quick Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { label: 'Total Headcount', value: '84', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-900/30' },
                            { label: 'Present Today', value: '78', icon: UserCheck, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/30' },
                            { label: 'On Approved Leave', value: '04', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/30' },
                            { label: 'Vacant Roles', value: '02', icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/30' },
                        ].map((stat, i) => (
                            <div key={i} className="p-6 rounded-3xl bg-[var(--card-background)] border border-[var(--border)] shadow-sm flex items-center gap-5">
                                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", stat.bg, stat.color)}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)] leading-none mb-1">{stat.label}</p>
                                    <p className="text-xl font-bold text-[var(--foreground)] leading-none">{stat.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Premium Staff Table */}
                    <Card className="border-none bg-[var(--card-background)] rounded-[2.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-none overflow-hidden">
                        <div className="p-0 overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-[var(--background-secondary)]/50 border-b border-[var(--border)] text-[var(--foreground-secondary)]">
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em]">Employee Profile</th>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em]">Department & Role</th>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em]">Communication</th>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em]">Joining Date</th>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan={5} className="px-8 py-12 text-center">
                                                <div className="flex flex-col items-center gap-3">
                                                    <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                                                    <p className="text-sm font-bold text-[var(--foreground-secondary)]">Retrieving personnel records...</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : filteredStaff.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-8 py-12 text-center text-[var(--foreground-secondary)] font-bold">
                                                No staff members found.
                                            </td>
                                        </tr>
                                    ) : filteredStaff.map((staff) => (
                                        <tr key={staff.id} className="group hover:bg-[var(--background-secondary)]/50 border-b border-[var(--border)] transition-all duration-300">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="relative">
                                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-indigo-500/10 group-hover:scale-105 transition-transform">
                                                            {staff.firstName[0]}{staff.lastName[0]}
                                                        </div>
                                                        <div className={cn(
                                                            "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[var(--card-background)]",
                                                            staff.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500'
                                                        )} />
                                                    </div>
                                                    <div>
                                                        <p className="text-base font-bold text-[var(--foreground)] group-hover:text-indigo-600 transition-colors leading-tight">{staff.firstName} {staff.lastName}</p>
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)] mt-1">ID: {staff.employeeId}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="outline" className="rounded-lg bg-[var(--card-background)] border-[var(--border)] text-[var(--foreground-secondary)] font-bold px-2 py-0.5">
                                                            {staff.department}
                                                        </Badge>
                                                        <Badge className={cn("rounded-lg text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 border-none shadow-none", getStatusStyle(staff.status))}>
                                                            {staff.status === 'on-leave' ? 'On Leave' : 'Active'}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-xs font-bold text-[var(--foreground-secondary)] ml-1">{staff.designation}</p>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2 text-xs font-semibold text-[var(--foreground-secondary)] hover:text-indigo-600 cursor-pointer">
                                                        <Mail className="w-3.5 h-3.5 text-[var(--foreground-muted)]" />
                                                        {staff.email}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs font-semibold text-[var(--foreground-secondary)] hover:text-emerald-600 cursor-pointer">
                                                        <Phone className="w-3.5 h-3.5 text-[var(--foreground-muted)]" />
                                                        {staff.phone}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="space-y-1">
                                                    <p className="text-sm font-bold text-[var(--foreground-secondary)]">{new Date(staff.joiningDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)]">Exp: 3.5 Years</p>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="rounded-xl h-10 w-10 text-[var(--foreground-muted)] hover:text-indigo-600 hover:bg-[var(--card-background)] transition-all">
                                                            <MoreVertical className="w-5 h-5" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-52 rounded-2xl border-[var(--border)] bg-[var(--card-background)] shadow-2xl p-2">
                                                        <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)] px-3 py-2">Staff Operations</DropdownMenuLabel>
                                                        <Link href={`/admin/teachers/${staff.id}`}>
                                                            <DropdownMenuItem className="rounded-xl px-3 py-2.5 font-bold text-sm cursor-pointer hover:bg-[var(--background-secondary)]">
                                                                <UserCircle className="w-4 h-4 mr-3 text-indigo-500" /> View Profile
                                                            </DropdownMenuItem>
                                                        </Link>
                                                        <DropdownMenuItem
                                                            onClick={() => toast.info('Opening Schedule...', { description: 'Class assignment module will load shortly.' })}
                                                            className="rounded-xl px-3 py-2.5 font-bold text-sm cursor-pointer hover:bg-[var(--background-secondary)]"
                                                        >
                                                            <Briefcase className="w-4 h-4 mr-3 text-emerald-500" /> Assign Classes
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => toast.success('Salary Slip Generated', { description: 'Downloading PDF summary...' })}
                                                            className="rounded-xl px-3 py-2.5 font-bold text-sm cursor-pointer hover:bg-[var(--background-secondary)]"
                                                        >
                                                            <FileText className="w-4 h-4 mr-3 text-blue-500" /> Salary Slips
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator className="bg-[var(--border)] my-1" />
                                                        <DropdownMenuItem
                                                            onClick={() => {
                                                                setSelectedStaffForStatus(staff)
                                                                setIsStatusDialogOpen(true)
                                                            }}
                                                            className="rounded-xl px-3 py-2.5 font-bold text-sm cursor-pointer text-red-500 hover:bg-red-50"
                                                        >
                                                            <XCircle className="w-4 h-4 mr-3" /> Terminate Access
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="px-8 py-6 bg-[var(--background-secondary)]/50 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4">
                            <p className="text-xs font-semibold text-[var(--foreground-secondary)]">
                                Powered by School ERP Human Resource Engine
                            </p>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" className="rounded-xl h-9 px-4 font-bold border-[var(--border)]">Prev</Button>
                                <Button size="sm" className="rounded-xl h-9 w-9 font-bold bg-indigo-600 text-white">1</Button>
                                <Button variant="outline" size="sm" className="rounded-xl h-9 px-4 font-bold border-[var(--border)]">Next</Button>
                            </div>
                        </div>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Bottom Insight Card */}
            <div className="p-8 rounded-[2.5rem] bg-indigo-600 text-white flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden group shadow-2xl shadow-indigo-600/20">
                <div className="relative z-10 space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center border border-white/20 backdrop-blur-md">
                            <Zap className="w-6 h-6 text-white" />
                        </div>
                        <h4 className="text-xl font-bold">HR Automation Active</h4>
                    </div>
                    <p className="text-white/70 text-sm max-w-xl font-medium leading-relaxed">
                        Automatic salary generation for next month is scheduled for the 25th. Ensure all attendance marks and leave approvals are completed by then.
                    </p>
                </div>
                <div className="flex items-center gap-4 relative z-10 w-full lg:w-auto">
                    <Link href="/admin/hr/payroll">
                        <Button variant="outline" className="flex-1 lg:flex-none h-14 rounded-2xl border-white/30 text-white hover:bg-white/10 font-bold px-8">
                            View Payroll Setup
                        </Button>
                    </Link>
                    <Button className="flex-1 lg:flex-none h-14 rounded-2xl bg-white text-indigo-600 hover:bg-indigo-50 font-bold px-8 shadow-xl">
                        Approve Pending Leaves
                    </Button>
                </div>
                {/* Decorative blob */}
                <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000" />
            </div>

            <StatusChangeDialog
                isOpen={isStatusDialogOpen}
                onOpenChange={setIsStatusDialogOpen}
                title="Staff Exit Processing"
                entityName={selectedStaffForStatus ? `${selectedStaffForStatus.firstName} ${selectedStaffForStatus.lastName} (${selectedStaffForStatus.employeeId})` : ''}
                onConfirm={(data) => {
                    console.log('Staff status updated:', data)
                }}
            />
        </div>
    )
}
