'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import {
    Shield,
    Users,
    Key,
    Lock,
    ChevronRight,
    Plus,
    Search,
    MoreVertical,
    CheckCircle2,
    Settings2,
    ShieldAlert,
    UserCircle2
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function AccessControlPage() {
    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Link href="/admin/dashboard" className="text-sm font-medium text-[var(--foreground-secondary)] hover:text-indigo-600 transition-colors">Admin Dashboard</Link>
                        <ChevronRight className="w-4 h-4 text-[var(--foreground-muted)]" />
                        <span className="text-sm font-bold text-indigo-600 uppercase tracking-widest">Security</span>
                    </div>
                    <h1 className="text-3xl font-black tracking-tight text-[var(--foreground)]">Access Control</h1>
                    <p className="text-[var(--foreground-secondary)] mt-1 font-medium">Define roles, manage staff permissions, and audit system access.</p>
                </div>

                <div className="flex items-center gap-3">
                    <Button className="h-12 bg-indigo-600 hover:bg-indigo-700 rounded-2xl px-8 font-bold text-white shadow-xl shadow-indigo-600/20 transform hover:scale-105 transition-all">
                        <Plus className="w-5 h-5 mr-2" />
                        Create New Role
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Roles Sidebar */}
                <div className="lg:col-span-1 space-y-4">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--foreground-muted)] ml-4 mb-2">Defined System Roles</h3>
                    {[
                        { name: 'Super Administrator', users: 2, icon: Shield, color: 'text-rose-600', bg: 'bg-rose-50 dark:bg-rose-900/30', active: true },
                        { name: 'Academic Admin', users: 5, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-900/30' },
                        { name: 'Accountant', users: 3, icon: Key, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/30' },
                        { name: 'Teacher (Partial)', users: 145, icon: UserCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/30' },
                    ].map((role, i) => (
                        <Card key={i} className={cn(
                            "border border-transparent rounded-[2rem] p-5 cursor-pointer transition-all duration-300 group hover:shadow-xl hover:shadow-indigo-500/5",
                            role.active ? "bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 border-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.05)]" : "bg-[var(--card-background)] hover:bg-[var(--background-secondary)]"
                        )}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", role.bg, role.color)}>
                                        <role.icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-[var(--foreground)]">{role.name}</p>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)]">{role.users} Active Users</p>
                                    </div>
                                </div>
                                <ChevronRight className={cn("w-5 h-5", role.active ? "text-indigo-500" : "text-[var(--foreground-muted)]")} />
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Permission Matrix */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-none bg-[var(--card-background)] rounded-[2.5rem] shadow-xl shadow-slate-200/40 dark:shadow-none overflow-hidden">
                        <CardHeader className="p-8 border-b border-[var(--border)]">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-xl font-black text-[var(--foreground)]">Permission Matrix</CardTitle>
                                    <CardDescription className="text-[var(--foreground-secondary)] font-medium pb-2">Editing permissions for <b>Super Administrator</b></CardDescription>
                                </div>
                                <Button variant="outline" className="rounded-xl font-bold text-[var(--foreground-secondary)] border-[var(--border)]">
                                    <ShieldAlert className="w-4 h-4 mr-2" />
                                    Security Audit
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 space-y-8">
                            {[
                                {
                                    module: 'Academic Management',
                                    permissions: [
                                        { name: 'Create/Edit Sessions', enabled: true },
                                        { name: 'Manage Departments', enabled: true },
                                        { name: 'Subject Assignment', enabled: true }
                                    ]
                                },
                                {
                                    module: 'Student Records',
                                    permissions: [
                                        { name: 'Execute Admissions', enabled: true },
                                        { name: 'Modify Student Profile', enabled: true },
                                        { name: 'Bulk Data Export', enabled: true }
                                    ]
                                },
                                {
                                    module: 'Financial Control',
                                    permissions: [
                                        { name: 'Record Collections', enabled: true },
                                        { name: 'Process Refunds', enabled: true },
                                        { name: 'Revenue Reports', enabled: true }
                                    ]
                                },
                            ].map((group, i) => (
                                <div key={i} className="space-y-4">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 ml-1 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                                        {group.module}
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {group.permissions.map((p, j) => (
                                            <div key={j} className="flex items-center justify-between p-4 bg-[var(--background-secondary)]/50 rounded-2xl border border-[var(--border)]/50 group hover:bg-[var(--card-background)] hover:shadow-md transition-all">
                                                <span className="text-sm font-bold text-[var(--foreground-secondary)]">{p.name}</span>
                                                <Switch checked={p.enabled} className="data-[state=checked]:bg-indigo-500" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}

                            <div className="pt-6 border-t border-[var(--border)] flex items-center justify-between gap-4">
                                <p className="text-[10px] text-[var(--foreground-muted)] font-bold max-w-sm">Changes here will affect session tokens immediately for all users assigned to this role.</p>
                                <div className="flex gap-3">
                                    <Button variant="ghost" className="rounded-xl font-bold text-[var(--foreground-muted)] px-6 hover:bg-[var(--background-secondary)]">Discard</Button>
                                    <Button className="rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white px-8 shadow-lg shadow-indigo-600/20 active:scale-95 transition-all">Save Matrix</Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
