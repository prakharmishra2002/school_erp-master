'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Bell,
    Mail,
    Smartphone,
    Monitor,
    Calendar,
    GraduationCap,
    Megaphone,
    FileText,
    Clock,
    Check,
    ChevronLeft,
    Settings,
} from 'lucide-react'
import Link from 'next/link'

interface NotificationSetting {
    id: string
    title: string
    description: string
    icon: React.ElementType
    email: boolean
    push: boolean
    inApp: boolean
}

function ToggleSwitch({ enabled, onChange }: { enabled: boolean; onChange: () => void }) {
    return (
        <button
            onClick={onChange}
            className={`relative w-11 h-6 rounded-full transition-colors ${enabled ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
        >
            <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${enabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
            />
        </button>
    )
}

export default function NotificationSettingsPage() {
    const [settings, setSettings] = useState<NotificationSetting[]>([
        {
            id: 'announcements',
            title: 'School Announcements',
            description: 'Important notices and updates from administration',
            icon: Megaphone,
            email: true,
            push: true,
            inApp: true,
        },
        {
            id: 'attendance',
            title: 'Attendance Reminders',
            description: 'Reminders to mark attendance for your classes',
            icon: Calendar,
            email: false,
            push: true,
            inApp: true,
        },
        {
            id: 'exams',
            title: 'Exam Updates',
            description: 'Exam schedules, marks entry deadlines',
            icon: GraduationCap,
            email: true,
            push: true,
            inApp: true,
        },
        {
            id: 'schedule',
            title: 'Schedule Changes',
            description: 'Timetable modifications and substitutions',
            icon: Clock,
            email: false,
            push: true,
            inApp: true,
        },
        {
            id: 'leave',
            title: 'Leave Updates',
            description: 'Leave request approvals and rejections',
            icon: FileText,
            email: true,
            push: true,
            inApp: true,
        },
        {
            id: 'salary',
            title: 'Salary Notifications',
            description: 'Payslip availability and salary credits',
            icon: FileText,
            email: true,
            push: false,
            inApp: true,
        },
    ])

    const toggleSetting = (id: string, type: 'email' | 'push' | 'inApp') => {
        setSettings(prev =>
            prev.map(setting =>
                setting.id === id ? { ...setting, [type]: !setting[type] } : setting
            )
        )
    }

    return (
        <div className="space-y-6 animate-slide-up">
            {/* Header */}
            <header>
                <div className="flex items-center gap-3 mb-4">
                    <Link
                        href="/teacher/announcements"
                        className="p-2 rounded-xl text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--background-secondary)] transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span className="text-xs font-medium tracking-widest uppercase text-[var(--foreground-muted)]">
                                Settings
                            </span>
                        </div>
                        <h1 className="font-display text-3xl font-semibold tracking-tight text-[var(--foreground)]">
                            Notification Preferences
                        </h1>
                    </div>
                </div>
                <p className="text-[var(--foreground-secondary)] ml-12">
                    Choose how you want to receive notifications
                </p>
            </header>

            {/* Notification Channels Legend */}
            <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-emerald-200 dark:border-emerald-800">
                <CardContent className="p-5">
                    <div className="flex flex-wrap items-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center">
                                <Mail className="w-4 h-4 text-blue-500" />
                            </div>
                            <span className="text-sm font-medium text-[var(--foreground)]">Email</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center">
                                <Smartphone className="w-4 h-4 text-violet-500" />
                            </div>
                            <span className="text-sm font-medium text-[var(--foreground)]">Push Notification</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center">
                                <Monitor className="w-4 h-4 text-emerald-500" />
                            </div>
                            <span className="text-sm font-medium text-[var(--foreground)]">In-App</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Settings List */}
            <div className="space-y-4">
                {settings.map(setting => {
                    const Icon = setting.icon
                    return (
                        <Card key={setting.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-5">
                                <div className="flex items-start gap-4">
                                    <div className="w-11 h-11 rounded-xl bg-[var(--background-secondary)] flex items-center justify-center shrink-0">
                                        <Icon className="w-5 h-5 text-[var(--foreground-muted)]" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-[var(--foreground)] mb-0.5">
                                            {setting.title}
                                        </h3>
                                        <p className="text-sm text-[var(--foreground-muted)]">
                                            {setting.description}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-6 shrink-0">
                                        <div className="flex flex-col items-center gap-1">
                                            <Mail className={`w-4 h-4 ${setting.email ? 'text-blue-500' : 'text-slate-300 dark:text-slate-600'}`} />
                                            <ToggleSwitch
                                                enabled={setting.email}
                                                onChange={() => toggleSetting(setting.id, 'email')}
                                            />
                                        </div>
                                        <div className="flex flex-col items-center gap-1">
                                            <Smartphone className={`w-4 h-4 ${setting.push ? 'text-violet-500' : 'text-slate-300 dark:text-slate-600'}`} />
                                            <ToggleSwitch
                                                enabled={setting.push}
                                                onChange={() => toggleSetting(setting.id, 'push')}
                                            />
                                        </div>
                                        <div className="flex flex-col items-center gap-1">
                                            <Monitor className={`w-4 h-4 ${setting.inApp ? 'text-emerald-500' : 'text-slate-300 dark:text-slate-600'}`} />
                                            <ToggleSwitch
                                                enabled={setting.inApp}
                                                onChange={() => toggleSetting(setting.id, 'inApp')}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-4">
                <Button className="bg-emerald-500 hover:bg-emerald-600 text-white gap-2">
                    <Check className="w-4 h-4" />
                    Save Preferences
                </Button>
                <Button variant="ghost" className="text-[var(--foreground-muted)]">
                    Reset to Default
                </Button>
            </div>
        </div>
    )
}
