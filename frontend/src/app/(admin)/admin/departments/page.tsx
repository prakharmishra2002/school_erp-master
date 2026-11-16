'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
    Plus,
    Building2,
    Users,
    UserCheck,
    MoreVertical,
    ChevronRight,
    Settings2,
    ShieldCheck,
    LayoutDashboard,
    Search,
    Filter,
    ArrowUpRight,
    Briefcase,
    Zap,
    Crown,
    CheckCircle2,
    Info,
    Clock
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

interface Department {
    id: number
    name: string
    code: string
    hodName: string
    staffCount: number
    studentFocus?: string
    status: 'active' | 'archived'
    lastUpdate: string
    iconColor: string
}

const mockDepartments: Department[] = [
    { id: 1, name: 'Science Faculty', code: 'SCI-ACAD', hodName: 'Suresh Kumar', staffCount: 18, studentFocus: 'Class 6-12', status: 'active', lastUpdate: '2 hours ago', iconColor: 'bg-indigo-600' },
    { id: 2, name: 'Mathematics Wing', code: 'MATH-ACAD', hodName: 'Meenkashi Iyer', staffCount: 12, studentFocus: 'Class 1-12', status: 'active', lastUpdate: '1 day ago', iconColor: 'bg-purple-600' },
    { id: 3, name: 'Accounts & Finance', code: 'FIN-ADMIN', hodName: 'Rajesh Khanna', staffCount: 5, status: 'active', lastUpdate: '3 days ago', iconColor: 'bg-emerald-600' },
    { id: 4, name: 'Human Resources', code: 'HR-ADMIN', hodName: 'Sunita Mehra', staffCount: 4, status: 'active', lastUpdate: '1 week ago', iconColor: 'bg-rose-500' },
    { id: 5, name: 'Operations & Security', code: 'OPS-ADMIN', hodName: 'Vikram Singh', staffCount: 15, status: 'active', lastUpdate: '2 hours ago', iconColor: 'bg-amber-500' },
    { id: 6, name: 'IT Infrastructure', code: 'IT-ADMIN', hodName: 'Alok Sharma', staffCount: 3, status: 'active', lastUpdate: '4 days ago', iconColor: 'bg-blue-600' },
]

export default function DepartmentManagementPage() {
    const [departments, setDepartments] = useState<Department[]>(mockDepartments)

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-12">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Link href="/admin/dashboard" className="text-sm font-medium text-[var(--foreground-secondary)] hover:text-indigo-600 transition-colors">Admin Dashboard</Link>
                        <ChevronRight className="w-4 h-4 text-[var(--foreground-muted)]" />
                        <span className="text-sm font-bold text-indigo-600 uppercase tracking-widest">Departments</span>
                    </div>
                    <h1 className="text-3xl font-black tracking-tight text-[var(--foreground)]">Organizational Hierarchy</h1>
                    <p className="text-[var(--foreground-secondary)] mt-1 font-medium">Manage institutional wings, departmental heads, and operational delegation.</p>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-12 border-[var(--border)] rounded-2xl px-6 font-bold text-[var(--foreground-secondary)] hover:bg-[var(--background-secondary)] bg-[var(--card-background)] shadow-sm">
                        <Users className="w-4 h-4 mr-2" />
                        Staff Roles
                    </Button>

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="h-12 bg-indigo-600 hover:bg-indigo-700 rounded-2xl px-8 font-bold text-white shadow-xl shadow-indigo-600/20 transform hover:scale-105 transition-all">
                                <Plus className="w-5 h-5 mr-2" />
                                Create Department
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[550px] rounded-[2rem] border-[var(--border)] bg-[var(--card-background)] shadow-2xl overflow-hidden p-0">
                            <div className="bg-indigo-600 p-8 text-white relative overflow-hidden">
                                <div className="relative z-10">
                                    <DialogTitle className="text-2xl font-black mb-1">New Department</DialogTitle>
                                    <DialogDescription className="text-indigo-100 font-medium">Create a new organizational wing for the institution.</DialogDescription>
                                </div>
                                <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 transition-transform duration-1000">
                                    <Building2 className="w-32 h-32 text-white" />
                                </div>
                            </div>

                            <form className="p-8 space-y-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)] ml-1">Department Name</label>
                                        <Input placeholder="e.g. Humanities & Arts" className="h-12 rounded-2xl bg-[var(--background-secondary)] border-[var(--border)] font-bold" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)] ml-1">Dept. Code</label>
                                            <Input placeholder="HUM-ACAD" className="h-12 rounded-2xl bg-[var(--background-secondary)] border-[var(--border)] font-bold" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)] ml-1">Type</label>
                                            <select className="w-full h-12 rounded-2xl bg-[var(--background-secondary)] border-b-2 border-[var(--border)] px-4 font-bold text-sm outline-none focus:border-indigo-500 transition-colors text-[var(--foreground)]">
                                                <option>Academic</option>
                                                <option>Administrative</option>
                                                <option>Support</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)] ml-1">Assign HOD (Optional)</label>
                                        <Input placeholder="Search Staff..." className="h-12 rounded-2xl bg-[var(--background-secondary)] border-[var(--border)] font-bold" />
                                    </div>
                                </div>

                                <div className="pt-4 flex flex-col gap-3">
                                    <Button
                                        type="button"
                                        onClick={() => {
                                            toast.success('Department created!', {
                                                description: 'You can now assign staff and map subjects to this wing.',
                                            })
                                        }}
                                        className="h-14 bg-indigo-600 hover:bg-indigo-700 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-600/20 w-full text-white"
                                    >
                                        Confirm & Create
                                    </Button>
                                    <p className="text-[10px] text-center text-[var(--foreground-muted)] font-bold italic">Note: Department roles and permissions can be customized in Access Control later.</p>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Quick Metrics & Search */}
            <div className="flex flex-col lg:flex-row gap-6">
                <Card className="border-none bg-[var(--card-background)] rounded-[2rem] shadow-xl shadow-slate-200/40 dark:shadow-none p-6 flex-1">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1 group">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--foreground-muted)] group-focus-within:text-indigo-500 transition-colors" />
                            <Input
                                placeholder="Search by department name or HOD..."
                                className="h-14 pl-12 rounded-2xl border-[var(--border)] bg-[var(--background-secondary)] shadow-inner font-semibold focus:bg-[var(--card-background)] focus:ring-indigo-500/10 transition-all border-none"
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <Button variant="outline" className="h-14 px-6 rounded-2xl border-[var(--border)] font-bold bg-[var(--card-background)] hover:bg-[var(--background-secondary)]">
                                <Filter className="w-5 h-5 mr-3 text-[var(--foreground-muted)]" />
                                All Wings
                            </Button>
                            <Button variant="outline" size="icon" className="h-14 w-14 rounded-2xl border-[var(--border)] bg-[var(--card-background)] hover:bg-[var(--background-secondary)]">
                                <Settings2 className="w-5 h-5 text-[var(--foreground-muted)]" />
                            </Button>
                        </div>
                    </div>
                </Card>

                <div className="grid grid-cols-2 gap-4 shrink-0 overflow-x-auto lg:w-96">
                    <div className="p-6 rounded-[2rem] bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800/50 flex flex-col justify-center">
                        <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-1">Total Wings</p>
                        <p className="text-2xl font-black text-indigo-700 dark:text-indigo-300">{departments.length}</p>
                    </div>
                    <div className="p-6 rounded-[2rem] bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800/50 flex flex-col justify-center">
                        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-1">Total HODs</p>
                        <p className="text-2xl font-black text-emerald-700 dark:text-emerald-300">6</p>
                    </div>
                </div>
            </div>

            {/* Departments Grid View */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {departments.map((dept) => (
                    <Card key={dept.id} className="border-none bg-[var(--card-background)] rounded-[2.5rem] shadow-xl shadow-slate-200/40 dark:shadow-none group overflow-hidden hover:translate-y-[-4px] transition-all duration-500">
                        <CardHeader className="p-8 pb-4 relative">
                            <div className="flex items-center justify-between mb-4">
                                <div className={cn("w-14 h-14 rounded-[1.2rem] flex items-center justify-center text-white shadow-lg shadow-indigo-500/10 transform group-hover:rotate-6 transition-transform duration-500", dept.iconColor)}>
                                    <Building2 className="w-7 h-7" />
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 text-[var(--foreground-muted)] hover:bg-[var(--background-secondary)] hover:text-indigo-600 transition-all">
                                            <MoreVertical className="w-5 h-5" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56 rounded-2xl border-[var(--border)] shadow-2xl p-2 animate-in slide-in-from-top-1 bg-[var(--card-background)]">
                                        <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)] px-3 py-2">Department Controls</DropdownMenuLabel>
                                        <DropdownMenuItem className="rounded-xl px-3 py-2.5 font-bold text-sm cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors">
                                            <Zap className="w-4 h-4 mr-3 text-indigo-600" /> Quick Config
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="rounded-xl px-3 py-2.5 font-bold text-sm cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors">
                                            <Crown className="w-4 h-4 mr-3 text-amber-500" /> Assign HOD
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="rounded-xl px-3 py-2.5 font-bold text-sm cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors">
                                            <Users className="w-4 h-4 mr-3 text-emerald-500" /> Staff List
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator className="bg-[var(--border)] my-1" />
                                        <DropdownMenuItem className="rounded-xl px-3 py-2.5 font-bold text-sm cursor-pointer text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30">
                                            <ShieldCheck className="w-4 h-4 mr-3" /> Archive Wing
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-2xl font-black text-[var(--foreground)] tracking-tight group-hover:text-indigo-600 transition-colors">{dept.name}</h3>
                                <p className="text-[10px] font-bold text-[var(--foreground-muted)] uppercase tracking-widest leading-none mb-1">{dept.code}</p>
                            </div>
                        </CardHeader>

                        <CardContent className="p-8 pt-4 space-y-6">
                            {/* HOD Profile Snapshot */}
                            <div className="p-5 rounded-[1.8rem] bg-[var(--background-secondary)] border border-[var(--border)]/50 flex items-center gap-4 group/hod cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:border-indigo-100 dark:hover:border-indigo-800 transition-all">
                                <div className="w-12 h-12 rounded-2xl bg-[var(--card-background)] flex items-center justify-center text-[var(--foreground-muted)] font-bold border border-[var(--border)] relative shadow-sm group-hover/hod:scale-105 transition-transform">
                                    <Crown className="w-6 h-6 text-amber-500/40 group-hover/hod:text-amber-500 transition-colors" />
                                </div>
                                <div>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-[var(--foreground-muted)] mb-0.5 leading-none">Head of Department</p>
                                    <p className="text-sm font-bold text-[var(--foreground)]">{dept.hodName}</p>
                                </div>
                                <div className="ml-auto">
                                    <ArrowUpRight className="w-4 h-4 text-[var(--foreground-muted)] group-hover/hod:text-indigo-600 transition-colors" />
                                </div>
                            </div>

                            {/* Department Stats */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)]">Personnel</p>
                                    <div className="flex items-center gap-2">
                                        <Users className="w-3.5 h-3.5 text-indigo-500" />
                                        <span className="text-sm font-bold text-[var(--foreground-secondary)]">{dept.staffCount} Members</span>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)]">Health Status</p>
                                    <div className="flex items-center gap-2">
                                        <div className="flex gap-0.5">
                                            {[1, 2, 3, 4, 5].map((i) => (
                                                <div key={i} className={cn(
                                                    "w-2 h-1 rounded-full",
                                                    i < 5 ? "bg-emerald-500" : "bg-[var(--border)]"
                                                )} />
                                            ))}
                                        </div>
                                        <span className="text-[10px] font-bold text-emerald-600 uppercase">Optimal</span>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom Labeling */}
                            <div className="pt-4 border-t border-[var(--border)] flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-3 h-3 text-[var(--foreground-muted)]" />
                                    <span className="text-[10px] font-bold text-[var(--foreground-muted)] italic">Modified {dept.lastUpdate}</span>
                                </div>
                                <Badge variant="outline" className="rounded-lg border-[var(--border)] bg-[var(--background-secondary)] text-[9px] font-black uppercase px-2 py-0.5">
                                    {dept.studentFocus || 'Support'}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {/* Create New Placeholder Card */}
                <div className="rounded-[2.5rem] border-2 border-dashed border-[var(--border)] flex flex-col items-center justify-center p-10 space-y-4 hover:border-indigo-400 hover:bg-indigo-50/20 dark:hover:bg-indigo-900/10 transition-all cursor-pointer group">
                    <div className="w-16 h-16 rounded-3xl bg-[var(--background-secondary)] flex items-center justify-center text-[var(--foreground-muted)] group-hover:bg-[var(--card-background)] group-hover:text-indigo-600 group-hover:shadow-xl transition-all duration-500">
                        <Plus className="w-8 h-8 font-black" />
                    </div>
                    <div className="text-center">
                        <p className="text-lg font-black text-[var(--foreground-muted)] group-hover:text-indigo-600 transition-colors">Add New Wing</p>
                        <p className="text-xs font-medium text-[var(--foreground-muted)]">Expand institutional architecture</p>
                    </div>
                </div>
            </div>

            {/* Floating Resource Hub Guide */}
            <div className="p-8 rounded-[2.5rem] bg-slate-900 shadow-2xl shadow-indigo-900/40 relative overflow-hidden group">
                <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
                    <div className="space-y-3">
                        <h4 className="text-2xl font-black text-white flex items-center gap-3">
                            <ShieldCheck className="w-8 h-8 text-emerald-500" />
                            Delegated Governance
                        </h4>
                        <p className="text-slate-400 text-sm max-w-xl font-medium leading-relaxed">
                            Assigning an HOD grants that staff member exclusive rights to manage attendance, student marks, and schedules for their specific department. All reports for this wing will be consolidated under the HOD dashboard.
                        </p>
                    </div>
                    <div className="flex items-center gap-4 w-full lg:w-auto">
                        <Button className="flex-1 lg:flex-none h-14 bg-indigo-600 hover:bg-indigo-700 rounded-2xl px-8 font-bold text-white shadow-xl shadow-indigo-600/30">
                            Configure Permissions
                        </Button>
                        <Button variant="outline" className="flex-1 lg:flex-none h-14 border-white/10 text-white rounded-2xl px-8 font-bold hover:bg-white/10">
                            Learn More
                        </Button>
                    </div>
                </div>
                <div className="absolute top-0 right-0 p-8 transform group-hover:rotate-12 transition-transform opacity-10">
                    <Info className="w-40 h-40 text-white" />
                </div>
            </div>
        </div>
    )
}
