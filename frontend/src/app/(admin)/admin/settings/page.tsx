'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import {
    Settings2,
    Building2,
    Globe,
    Bell,
    Shield,
    CreditCard,
    Smartphone,
    Mail,
    ChevronRight,
    Save,
    Image,
    Languages
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { IndianRupee, Database, Terminal, Cpu, Info } from 'lucide-react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

type Section = 'Profile' | 'Portal' | 'Notifications' | 'Security' | 'Financials' | 'Academic' | 'Branding' | 'Backup' | 'Integrations'

export default function GlobalSettingsPage() {
    const [isSaving, setIsSaving] = useState(false)
    const [activeSection, setActiveSection] = useState<Section>('Profile')

    const handleSave = () => {
        setIsSaving(true)
        setTimeout(() => {
            toast.success('Configuration updated successfully', {
                description: 'Changes have been propagated to all system instances.',
            })
            setIsSaving(false)
        }, 1500)
    }

    const sections: { name: string, id: Section, icon: any }[] = [
        { name: 'School Profile', id: 'Profile', icon: Building2 },
        { name: 'Portal Config', id: 'Portal', icon: Globe },
        { name: 'Notifications', id: 'Notifications', icon: Bell },
        { name: 'Security & Auth', id: 'Security', icon: Shield },
        { name: 'Financials', id: 'Financials', icon: CreditCard },
        { name: 'Academic Year', id: 'Academic', icon: Languages },
        { name: 'Branding', id: 'Branding', icon: Image },
        { name: 'System Backup', id: 'Backup', icon: Database },
        { name: 'API & Integrations', id: 'Integrations', icon: Cpu },
    ]

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Link href="/admin/dashboard" className="text-sm font-medium text-[var(--foreground-secondary)] hover:text-indigo-600 transition-colors">Admin Dashboard</Link>
                        <ChevronRight className="w-4 h-4 text-[var(--foreground-muted)]" />
                        <span className="text-sm font-bold text-indigo-600 uppercase tracking-widest">Configuration</span>
                    </div>
                    <h1 className="text-3xl font-black tracking-tight text-[var(--foreground)]">Global Settings</h1>
                    <p className="text-[var(--foreground-secondary)] mt-1 font-medium">Configure institutional identity, portal features, and system-wide defaults.</p>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="h-12 bg-indigo-600 hover:bg-indigo-700 rounded-2xl px-8 font-bold text-white shadow-xl shadow-indigo-600/20 transform hover:scale-105 transition-all"
                    >
                        <Save className="w-5 h-5 mr-2" />
                        {isSaving ? 'Saving Changes...' : 'Save Configuration'}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Navigation Sidebar */}
                <div className="lg:col-span-1 space-y-2">
                    {sections.map((item, i) => (
                        <div key={i}
                            onClick={() => setActiveSection(item.id)}
                            className={cn(
                                "flex items-center gap-4 px-6 py-4 rounded-2xl cursor-pointer transition-all font-bold text-[13px]",
                                activeSection === item.id ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-800/30" : "text-[var(--foreground-secondary)] hover:bg-[var(--card-background)] hover:text-indigo-600"
                            )}>
                            <item.icon className="w-5 h-5" />
                            {item.name}
                        </div>
                    ))}
                </div>

                {/* Content Area */}
                <div className="lg:col-span-3 space-y-6">
                    {activeSection === 'Profile' && (
                        <Card className="border-none bg-[var(--card-background)] rounded-[2.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-none overflow-hidden">
                            <CardHeader className="p-8 border-b border-[var(--border)]">
                                <CardTitle className="text-xl font-black text-[var(--foreground)]">Institutional Identity</CardTitle>
                                <CardDescription className="text-[var(--foreground-secondary)] font-medium pb-2">Primary details used for headers, receipts, and reports.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-8 space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)] ml-1">Institutional Name</label>
                                        <Input defaultValue="Modern Excellence Academy" className="h-12 rounded-2xl bg-[var(--background-secondary)] border-[var(--border)] font-bold" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)] ml-1">Institution Code</label>
                                        <Input defaultValue="MEA-2024" className="h-12 rounded-2xl bg-[var(--background-secondary)] border-[var(--border)] font-bold" />
                                    </div>
                                    <div className="space-y-2 col-span-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)] ml-1">Official Address</label>
                                        <Input defaultValue="123 Education Hub, MG Road, Pune, Maharashtra - 411001" className="h-12 rounded-2xl bg-[var(--background-secondary)] border-[var(--border)] font-bold" />
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-[var(--border)] space-y-6">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 ml-1">Logo & Branding</h4>
                                    <div className="flex items-center gap-8">
                                        <div className="w-24 h-24 rounded-3xl bg-[var(--background-secondary)] border-2 border-dashed border-[var(--border)] flex flex-col items-center justify-center gap-2 group cursor-pointer hover:border-indigo-400 transition-colors">
                                            <Image className="w-6 h-6 text-[var(--foreground-muted)] group-hover:text-indigo-500 transition-colors" />
                                            <span className="text-[8px] font-black text-[var(--foreground-muted)] group-hover:text-indigo-500 transition-colors">UPLOAD LOGO</span>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-xs text-[var(--foreground-secondary)] font-medium">Recommended: 512x512px SVG or Transparent PNG.</p>
                                            <div className="flex gap-2">
                                                <Button variant="outline" className="rounded-xl h-9 text-xs font-bold border-[var(--border)]">Remove</Button>
                                                <Button variant="outline" className="rounded-xl h-9 text-xs font-bold border-[var(--border)] text-indigo-600 border-indigo-100 dark:border-indigo-800">Change</Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {activeSection === 'Portal' && (
                        <Card className="border-none bg-[var(--card-background)] rounded-[2.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-none overflow-hidden">
                            <CardHeader className="p-8 border-b border-[var(--border)]">
                                <CardTitle className="text-xl font-black text-[var(--foreground)]">Portal Access Configuration</CardTitle>
                                <CardDescription className="text-[var(--foreground-secondary)] font-medium pb-2">Manage how parents and students interact with the digital desk.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-8 space-y-6">
                                {[
                                    { title: 'Student Dashboard', desc: 'Allow students to view their own attendance and results.', checked: true },
                                    { title: 'Parent Portal Receipts', desc: 'Enable instant download of fee receipts via parent login.', checked: true },
                                    { title: 'Digital Diary', desc: 'Students can submit assignments and view daily worksheets.', checked: false },
                                    { title: 'Alumni Network', desc: 'Allow graduated students to retain portal access.', checked: false },
                                ].map((s, i) => (
                                    <div key={i} className="flex items-center justify-between p-6 bg-[var(--background-secondary)]/50 rounded-3xl border border-[var(--border)]/50">
                                        <div className="space-y-1">
                                            <p className="text-sm font-black text-[var(--foreground-secondary)]">{s.title}</p>
                                            <p className="text-xs text-[var(--foreground-muted)] font-medium">{s.desc}</p>
                                        </div>
                                        <Switch defaultChecked={s.checked} className="data-[state=checked]:bg-indigo-600" />
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}

                    {activeSection === 'Notifications' && (
                        <Card className="border-none bg-[var(--card-background)] rounded-[2.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-none overflow-hidden">
                            <CardHeader className="p-8 border-b border-[var(--border)]">
                                <CardTitle className="text-xl font-black text-[var(--foreground)]">Notification Engines</CardTitle>
                                <CardDescription className="text-[var(--foreground-secondary)] font-medium pb-2">Configure SMS, Email, and Push alert behavior.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-8 space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)] ml-1">Default SMS Gateway</label>
                                        <Input defaultValue="Twilio-API HighPriority" className="h-12 rounded-2xl bg-[var(--background-secondary)] border-[var(--border)] font-bold" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)] ml-1">Support Email</label>
                                        <Input defaultValue="support@modernacademy.edu" className="h-12 rounded-2xl bg-[var(--background-secondary)] border-[var(--border)] font-bold" />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    {[
                                        { title: 'Attendance Alerts', desc: 'Send SMS automatically when student is marked absent.', checked: true },
                                        { title: 'Fee Due Reminders', desc: '7-day advance notice for monthly fees via WhatsApp.', checked: true },
                                        { title: 'Exam Results', desc: 'Broadcast result links via Push notification.', checked: false },
                                    ].map((s, i) => (
                                        <div key={i} className="flex items-center justify-between p-6 bg-[var(--background-secondary)]/50 rounded-3xl border border-[var(--border)]/50">
                                            <div className="space-y-1">
                                                <p className="text-sm font-black text-[var(--foreground-secondary)]">{s.title}</p>
                                                <p className="text-xs text-[var(--foreground-muted)] font-medium">{s.desc}</p>
                                            </div>
                                            <Switch defaultChecked={s.checked} className="data-[state=checked]:bg-indigo-600" />
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {activeSection === 'Security' && (
                        <Card className="border-none bg-[var(--card-background)] rounded-[2.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-none overflow-hidden">
                            <CardHeader className="p-8 border-b border-[var(--border)]">
                                <CardTitle className="text-xl font-black text-[var(--foreground)]">Security & Authentication</CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 space-y-6">
                                {[
                                    { title: 'Two-Factor Auth (2FA)', desc: 'Required for all faculty and administrative accounts.', checked: false },
                                    { title: 'Auto-Lock Session', desc: 'Logout users after 30 minutes of inactivity.', checked: true },
                                    { title: 'Audit Trail', desc: 'Record detailed logs for all sensitive data mutations.', checked: true },
                                    { title: 'Strict IP Access', desc: 'Restrict backend access to authorized campus IPs.', checked: false },
                                ].map((s, i) => (
                                    <div key={i} className="flex items-center justify-between p-6 bg-[var(--background-secondary)]/50 rounded-3xl border border-[var(--border)]/50">
                                        <div className="space-y-1">
                                            <p className="text-sm font-black text-[var(--foreground-secondary)]">{s.title}</p>
                                            <p className="text-xs text-[var(--foreground-muted)] font-medium">{s.desc}</p>
                                        </div>
                                        <Switch defaultChecked={s.checked} className="data-[state=checked]:bg-indigo-600" />
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}

                    {activeSection === 'Financials' && (
                        <div className="space-y-6">
                            <Card className="border-none bg-[var(--card-background)] rounded-[2.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-none overflow-hidden">
                                <CardHeader className="p-8 border-b border-[var(--border)]">
                                    <CardTitle className="text-xl font-black text-[var(--foreground)]">Financial Benchmarks</CardTitle>
                                </CardHeader>
                                <CardContent className="p-8 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)] ml-1">Late Payment Penalty</label>
                                            <div className="flex gap-2">
                                                <Input defaultValue="50" className="h-12 rounded-2xl bg-[var(--background-secondary)] border-[var(--border)] font-bold flex-1" />
                                                <div className="h-12 px-4 rounded-2xl bg-[var(--background-secondary)] border border-[var(--border)] flex items-center font-bold text-xs">₹/Day</div>
                                            </div>
                                            <p className="text-[10px] text-[var(--foreground-muted)] font-bold italic ml-1">Applies after the 10th of every month.</p>
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)] ml-1">Max Penalty Cap</label>
                                            <div className="flex gap-2">
                                                <Input defaultValue="1500" className="h-12 rounded-2xl bg-[var(--background-secondary)] border-[var(--border)] font-bold flex-1" />
                                                <div className="h-12 px-4 rounded-2xl bg-[var(--background-secondary)] border border-[var(--border)] flex items-center font-bold text-xs">₹ Total</div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-none bg-[var(--card-background)] rounded-[2.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-none overflow-hidden">
                                <CardHeader className="p-8 border-b border-[var(--border)]">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-xl font-black text-[var(--foreground)]">Incidental Charges Master</CardTitle>
                                        <Button size="sm" className="rounded-xl bg-slate-900 text-white font-bold h-9">Add Head</Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="space-y-0">
                                        {[
                                            { name: 'Library Membership', amount: 800, freq: 'Annual' },
                                            { name: 'Identity Card', amount: 200, freq: 'One-Time' },
                                            { name: 'TC Issuance', amount: 500, freq: 'Per Request' },
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-center justify-between p-6 border-b border-[var(--border)] last:border-none hover:bg-[var(--background-secondary)]/30 transition-colors">
                                                <div>
                                                    <p className="font-bold text-[var(--foreground)]">{item.name}</p>
                                                    <p className="text-[10px] font-black text-[var(--foreground-muted)] uppercase tracking-tight">{item.freq}</p>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <p className="font-black text-indigo-600">₹{item.amount}</p>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-[var(--foreground-muted)]">
                                                        <Settings2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {activeSection === 'Academic' && (
                        <Card className="border-none bg-[var(--card-background)] rounded-[2.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-none overflow-hidden">
                            <CardHeader className="p-8 border-b border-[var(--border)]">
                                <CardTitle className="text-xl font-black text-[var(--foreground)]">Academic Calendar Configuration</CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)] ml-1">Current Session</label>
                                        <Input defaultValue="2024-2025" className="h-12 rounded-2xl bg-[var(--background-secondary)] border-[var(--border)] font-bold" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)] ml-1">Working Days/Week</label>
                                        <Select defaultValue="6">
                                            <SelectTrigger className="h-12 rounded-2xl bg-[var(--background-secondary)] border-[var(--border)] font-bold">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-2xl">
                                                {[5, 6].map(d => <SelectItem key={d} value={d.toString()} className="font-bold">{d} Days</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-black text-[var(--foreground-secondary)]">Session Locking</p>
                                    <p className="text-xs text-[var(--foreground-muted)] font-medium">Prevent data modification for previous academic sessions.</p>
                                    <div className="mt-4 flex items-center justify-between p-6 bg-rose-50 dark:bg-rose-900/10 rounded-3xl border border-rose-100 dark:border-rose-900/50">
                                        <div className="flex items-center gap-4 text-rose-600">
                                            <Shield className="w-6 h-6" />
                                            <span className="font-bold text-sm">Session 2023-24 is currently locked.</span>
                                        </div>
                                        <Button variant="outline" className="rounded-xl h-9 border-rose-200 dark:border-rose-800 text-rose-600 font-bold hover:bg-rose-600 hover:text-white transition-all">Unlock</Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {activeSection === 'Branding' && (
                        <Card className="border-none bg-[var(--card-background)] rounded-[2.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-none overflow-hidden">
                            <CardHeader className="p-8 border-b border-[var(--border)]">
                                <CardTitle className="text-xl font-black text-[var(--foreground)]">Branding & Aesthetics</CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)] ml-1">Global Primary Color</label>
                                        <div className="flex gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-indigo-600 shadow-lg" />
                                            <Input defaultValue="#4F46E5" className="h-12 rounded-2xl bg-[var(--background-secondary)] border-[var(--border)] font-bold flex-1" />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)] ml-1">Receipt Accent Color</label>
                                        <div className="flex gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-slate-900 shadow-lg" />
                                            <Input defaultValue="#0F172A" className="h-12 rounded-2xl bg-[var(--background-secondary)] border-[var(--border)] font-bold flex-1" />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <p className="text-sm font-black text-[var(--foreground-secondary)]">Report Header Layout</p>
                                    <div className="grid grid-cols-3 gap-4">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className={cn(
                                                "aspect-[4/3] rounded-2xl border-2 flex items-center justify-center cursor-pointer transition-all",
                                                i === 1 ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/30" : "border-[var(--border)] bg-[var(--background-secondary)] hover:border-indigo-300"
                                            )}>
                                                <Badge className="font-black text-[8px] uppercase">Layout 0{i}</Badge>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {activeSection === 'Backup' && (
                        <Card className="border-none bg-[var(--card-background)] rounded-[2.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-none overflow-hidden">
                            <CardHeader className="p-8 border-b border-[var(--border)]">
                                <CardTitle className="text-xl font-black text-[var(--foreground)]">System Continuity & Backup</CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 space-y-8">
                                <div className="flex items-center justify-between p-6 bg-indigo-50 dark:bg-indigo-900/30 rounded-[2rem] border border-indigo-100 dark:border-indigo-800">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center text-indigo-600 shadow-sm">
                                            <Database className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="font-black text-indigo-900 dark:text-indigo-100 leading-tight">Last full snapshot</p>
                                            <p className="text-xs font-bold text-indigo-700/70 dark:text-indigo-400">02 Feb 2026, 04:30 AM (Auto)</p>
                                        </div>
                                    </div>
                                    <Button className="rounded-2xl bg-indigo-600 text-white font-black px-6">Download SQL</Button>
                                </div>

                                <div className="space-y-4">
                                    {[
                                        { title: 'Cloud Backup', desc: 'Sync snapshots with institution Google Drive/S3.', checked: true },
                                        { title: 'Media Encryption', desc: 'Encrypt student photos and sensitive documents at rest.', checked: true },
                                        { title: 'Version Recovery', desc: 'Maintain 30-day history for all configuration changes.', checked: false },
                                    ].map((s, i) => (
                                        <div key={i} className="flex items-center justify-between p-6 bg-[var(--background-secondary)]/50 rounded-3xl border border-[var(--border)]/50">
                                            <div className="space-y-1">
                                                <p className="text-sm font-black text-[var(--foreground-secondary)]">{s.title}</p>
                                                <p className="text-xs text-[var(--foreground-muted)] font-medium">{s.desc}</p>
                                            </div>
                                            <Switch defaultChecked={s.checked} className="data-[state=checked]:bg-indigo-600" />
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {activeSection === 'Integrations' && (
                        <Card className="border-none bg-[var(--card-background)] rounded-[2.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-none overflow-hidden">
                            <CardHeader className="p-8 border-b border-[var(--border)]">
                                <CardTitle className="text-xl font-black text-[var(--foreground)]">API & External Nodes</CardTitle>
                                <CardDescription className="text-[var(--foreground-secondary)] font-medium pb-2">Connect your ERP with external services and hardware.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-8 space-y-6">
                                {[
                                    { name: 'Razorpay Gateway', status: 'Connected', icon: CreditCard },
                                    { name: 'Twilio SMS Node', status: 'Active', icon: Mail },
                                    { name: 'Biometric Attendance', status: 'Disconnected', icon: Terminal },
                                    { name: 'Google Cloud Drive', status: 'Connected', icon: Globe },
                                ].map((node, i) => (
                                    <div key={i} className="flex items-center justify-between p-6 bg-[var(--background-secondary)]/50 rounded-3xl border border-[var(--border)]/50">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-[var(--card-background)] flex items-center justify-center text-[var(--foreground-muted)] shadow-sm">
                                                <node.icon className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="font-black text-[var(--foreground-secondary)] leading-none mb-1">{node.name}</p>
                                                <Badge className={cn(
                                                    "text-[8px] font-black uppercase tracking-widest border-none px-2 rounded-lg",
                                                    node.status === 'Connected' || node.status === 'Active' ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                                                )}>{node.status}</Badge>
                                            </div>
                                        </div>
                                        <Button variant="outline" className="rounded-xl border-[var(--border)] font-bold h-10 px-4">Config</Button>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    )
}
