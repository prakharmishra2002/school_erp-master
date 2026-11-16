'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
    Search,
    Filter,
    ChevronRight,
    Plus,
    Download,
    Mail,
    Phone,
    Users,
    ShieldCheck,
    MoreVertical,
    UserCheck,
    Clock,
    UserX
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog"
import { toast } from 'sonner'

interface Guardian {
    id: number
    name: string
    relation: string
    students: string[]
    phone: string
    email: string
    status: 'Active' | 'Pending'
}

const initialGuardians: Guardian[] = [
    { id: 1, name: 'Rajesh Sharma', relation: 'Father', students: ['Aarav Sharma (X-A)'], phone: '9876543210', email: 'rajesh@gmail.com', status: 'Active' },
    { id: 2, name: 'Sneha Patel', relation: 'Mother', students: ['Priya Patel (X-A)', 'Ronak Patel (V-B)'], phone: '9876543211', email: 'sneha@gmail.com', status: 'Active' },
    { id: 3, name: 'Vikram Singh', relation: 'Father', students: ['Ananya Singh (IX-C)'], phone: '9876543212', email: 'vikram@gmail.com', status: 'Pending' },
]

export default function GuardiansHubPage() {
    const [guardians, setGuardians] = useState<Guardian[]>(initialGuardians)
    const [selectedStudents, setSelectedStudents] = useState<string[]>([])
    const [newGuardian, setNewGuardian] = useState({ name: '', phone: '', email: '', relation: 'Father' })
    const [isAdding, setIsAdding] = useState(false)

    const handleAddGuardian = () => {
        if (!newGuardian.name || !newGuardian.phone) {
            toast.error('Details Missing', { description: 'Guardian name and contact are required.' })
            return
        }

        const guardian: Guardian = {
            id: guardians.length + 1,
            ...newGuardian,
            students: selectedStudents,
            status: 'Pending'
        }

        setGuardians([guardian, ...guardians])
        setIsAdding(false)
        setNewGuardian({ name: '', phone: '', email: '', relation: 'Father' })
        setSelectedStudents([])
        toast.success('Guardian Profile Created', {
            description: `${newGuardian.name} has been registered and linked to ${selectedStudents.length} students.`
        })
    }

    const removeStudentLink = (student: string) => {
        setSelectedStudents(selectedStudents.filter(s => s !== student))
    }

    const addStudentLink = () => {
        // Simulated student search selection
        const mockStudent = `Sample Student ${Math.floor(Math.random() * 100)} (V-A)`
        if (!selectedStudents.includes(mockStudent)) {
            setSelectedStudents([...selectedStudents, mockStudent])
        }
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Link href="/admin/dashboard" className="text-sm font-medium text-[var(--foreground-secondary)] hover:text-indigo-600 transition-colors">Admin Dashboard</Link>
                        <ChevronRight className="w-4 h-4 text-[var(--foreground-muted)]" />
                        <span className="text-sm font-bold text-indigo-600 uppercase tracking-widest">Relations</span>
                    </div>
                    <h1 className="text-3xl font-black tracking-tight text-[var(--foreground)]">Guardians Hub</h1>
                    <p className="text-[var(--foreground-secondary)] mt-1 font-medium">Manage parent profiles, contact synchronization, and portal access.</p>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-12 border-[var(--border)] rounded-2xl px-6 font-bold text-[var(--foreground-secondary)] bg-[var(--card-background)] shadow-sm hover:bg-[var(--background-secondary)] transition-all">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                    </Button>

                    <Dialog open={isAdding} onOpenChange={setIsAdding}>
                        <DialogTrigger asChild>
                            <Button className="h-12 bg-indigo-600 hover:bg-indigo-700 rounded-2xl px-8 font-bold text-white shadow-xl shadow-indigo-600/20 transform hover:scale-105 transition-all">
                                <Plus className="w-5 h-5 mr-2" />
                                Add Guardian
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px] bg-[var(--card-background)] rounded-[2rem] border-[var(--border)] p-0 overflow-hidden shadow-2xl">
                            <div className="bg-indigo-600 p-8 text-white relative overflow-hidden">
                                <DialogTitle className="text-2xl font-black mb-1">New Guardian Profile</DialogTitle>
                                <DialogDescription className="text-indigo-100 font-medium">Establish a legal relation and portal access for families.</DialogDescription>
                                <Users className="absolute top-0 right-0 p-8 w-32 h-32 text-white/10 rotate-12" />
                            </div>

                            <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)] ml-1">Full Name</label>
                                        <Input
                                            placeholder="e.g. John Doe"
                                            value={newGuardian.name}
                                            onChange={(e) => setNewGuardian({ ...newGuardian, name: e.target.value })}
                                            className="h-12 rounded-2xl bg-[var(--background-secondary)] border-[var(--border)] font-bold"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)] ml-1">Relation</label>
                                        <select
                                            value={newGuardian.relation}
                                            onChange={(e) => setNewGuardian({ ...newGuardian, relation: e.target.value })}
                                            className="w-full h-12 rounded-2xl bg-[var(--background-secondary)] border-b-2 border-[var(--border)] px-4 font-bold text-sm outline-none focus:border-indigo-500 transition-colors text-[var(--foreground)]"
                                        >
                                            <option>Father</option>
                                            <option>Mother</option>
                                            <option>Legal Guardian</option>
                                            <option>Other</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)] ml-1">Phone Number</label>
                                        <Input
                                            placeholder="+91 00000 00000"
                                            value={newGuardian.phone}
                                            onChange={(e) => setNewGuardian({ ...newGuardian, phone: e.target.value })}
                                            className="h-12 rounded-2xl bg-[var(--background-secondary)] border-[var(--border)] font-bold"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)] ml-1">Email Address</label>
                                        <Input
                                            placeholder="parent@example.com"
                                            value={newGuardian.email}
                                            onChange={(e) => setNewGuardian({ ...newGuardian, email: e.target.value })}
                                            className="h-12 rounded-2xl bg-[var(--background-secondary)] border-[var(--border)] font-bold"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                                            Linked Students (Siblings)
                                        </h3>
                                        <Button variant="ghost" size="sm" onClick={addStudentLink} className="h-8 rounded-lg font-bold text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30">
                                            <Plus className="w-3.5 h-3.5 mr-1" /> Link Student
                                        </Button>
                                    </div>

                                    {selectedStudents.length === 0 ? (
                                        <div className="p-8 rounded-2xl border-2 border-dashed border-[var(--border)] text-center">
                                            <p className="text-xs font-bold text-[var(--foreground-muted)]">No students linked. Use the button above to add siblings.</p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-wrap gap-2">
                                            {selectedStudents.map((s, i) => (
                                                <Badge key={i} className="rounded-xl bg-indigo-50 text-indigo-600 border-indigo-100 py-1.5 pl-3 pr-2 font-bold group">
                                                    {s}
                                                    <button onClick={() => removeStudentLink(s)} className="ml-2 p-0.5 rounded-full hover:bg-indigo-200 transition-colors">
                                                        <UserX className="w-3 h-3" />
                                                    </button>
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="p-8 bg-[var(--background-secondary)] border-t border-[var(--border)]">
                                <Button
                                    onClick={handleAddGuardian}
                                    className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-600/20 text-white"
                                >
                                    Establish Guardian Relation
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Registered Parents', value: '1,240', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-900/30' },
                    { label: 'Active Portal Users', value: '1,085', icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/30' },
                    { label: 'Pending Invitations', value: '42', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/30' },
                ].map((stat, i) => (
                    <Card key={i} className="border-none bg-[var(--card-background)] rounded-[2rem] shadow-xl shadow-slate-200/40 dark:shadow-none p-6">
                        <div className="flex items-center gap-4">
                            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center", stat.bg, stat.color)}>
                                <stat.icon className="w-7 h-7" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)] mb-1">{stat.label}</p>
                                <h3 className="text-2xl font-black text-[var(--foreground)] tracking-tight">{stat.value}</h3>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Main Content Area */}
            <Card className="border-none bg-[var(--card-background)] rounded-[2.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-none overflow-hidden">
                <div className="p-8 border-b border-[var(--border)] bg-[var(--background-secondary)]/30">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--foreground-muted)]" />
                            <Input placeholder="Search by name, phone or email..." className="h-12 pl-12 rounded-2xl border-[var(--border)] bg-[var(--card-background)] focus:ring-2 focus:ring-indigo-500 transition-all font-medium" />
                        </div>
                        <div className="flex items-center gap-3">
                            <Button variant="outline" className="rounded-2xl border-[var(--border)] font-bold text-[var(--foreground-secondary)] h-12">
                                <Filter className="w-4 h-4 mr-2" />
                                Filters
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="p-0 overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-[var(--background-secondary)]/50">
                                <th className="text-left py-5 px-8 text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)]">Guardian Name</th>
                                <th className="text-left py-5 px-8 text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)]">Linked Students</th>
                                <th className="text-left py-5 px-8 text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)]">Contact</th>
                                <th className="text-left py-5 px-8 text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)]">Portal Status</th>
                                <th className="text-left py-5 px-8 text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border)]">
                            {guardians.map((parent, i) => (
                                <tr key={i} className="group hover:bg-[var(--background-secondary)]/50 transition-colors">
                                    <td className="py-5 px-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-[var(--background-secondary)] flex items-center justify-center font-bold text-[var(--foreground-muted)] border border-[var(--border)]">
                                                {parent.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-[var(--foreground)]">{parent.name}</p>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500">{parent.relation}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-5 px-8">
                                        <div className="flex flex-wrap gap-1.5">
                                            {parent.students.map((s, j) => (
                                                <Badge key={j} variant="outline" className="rounded-lg border-indigo-100 dark:border-indigo-800 bg-indigo-50/30 dark:bg-indigo-900/30 text-indigo-600 font-bold text-[10px]">
                                                    {s}
                                                </Badge>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="py-5 px-8">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-sm text-[var(--foreground-secondary)] font-medium">
                                                <Phone className="w-3.5 h-3.5 text-[var(--foreground-muted)]" />
                                                {parent.phone}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-[var(--foreground-secondary)] font-medium">
                                                <Mail className="w-3.5 h-3.5 text-[var(--foreground-muted)]" />
                                                {parent.email}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-5 px-8">
                                        <Badge className={cn(
                                            "rounded-xl border-none px-3 py-1 font-bold text-[10px] uppercase tracking-widest",
                                            parent.status === 'Active' ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600" : "bg-amber-50 dark:bg-amber-900/30 text-amber-600"
                                        )}>
                                            {parent.status === 'Active' ? (
                                                <UserCheck className="w-3 h-3 mr-1.5 inline" />
                                            ) : (
                                                <Clock className="w-3 h-3 mr-1.5 inline" />
                                            )}
                                            {parent.status}
                                        </Badge>
                                    </td>
                                    <td className="py-5 px-8 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-10 w-10 p-0 rounded-xl hover:bg-[var(--card-background)] hover:shadow-md transition-all">
                                                    <MoreVertical className="w-5 h-5 text-[var(--foreground-muted)]" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl border-[var(--border)] shadow-2xl bg-[var(--card-background)]">
                                                <DropdownMenuItem className="rounded-xl p-3 font-bold text-[var(--foreground-secondary)] hover:bg-[var(--background-secondary)] cursor-pointer">
                                                    Edit Profile
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="rounded-xl p-3 font-bold text-[var(--foreground-secondary)] hover:bg-[var(--background-secondary)] cursor-pointer">
                                                    Reset Portal Password
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="rounded-xl p-3 font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 cursor-pointer">
                                                    Deactivate Access
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-8 border-t border-[var(--border)] bg-[var(--background-secondary)]/30 flex items-center justify-between">
                    <p className="text-sm text-[var(--foreground-secondary)] font-medium">Showing 3 of 1,240 households</p>
                    <div className="flex gap-2">
                        <Button variant="outline" className="rounded-xl font-bold border-[var(--border)]">Previous</Button>
                        <Button variant="outline" className="rounded-xl font-bold border-[var(--border)]">Next</Button>
                    </div>
                </div>
            </Card>
        </div>
    )
}
