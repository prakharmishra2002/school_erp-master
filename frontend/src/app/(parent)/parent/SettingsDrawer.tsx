'use client'

import React from 'react'
import {
    X,
    User,
    Bell,
    Shield,
    Moon,
    Languages,
    HelpCircle,
    ChevronRight,
    LogOut,
    ExternalLink,
    Palette,
    Sun,
    Globe,
    CreditCard
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { logout } from './actions/authActions'
import {
    updateProfile,
    changePassword,
    updateNotificationPreferences,
    updatePrivacySettings
} from './actions/settingsActions'
import { Input } from '@/components/ui/input'
// Using local label styles instead of missing Label component
import { ArrowLeft, Check, Loader2, Lock } from 'lucide-react'

interface SettingsDrawerProps {
    isOpen: boolean
    onClose: () => void
    darkMode: boolean
    onToggleDarkMode: () => void
}

export default function SettingsDrawer({
    isOpen,
    onClose,
    darkMode,
    onToggleDarkMode
}: SettingsDrawerProps) {
    const [view, setView] = React.useState<'main' | 'profile' | 'security' | 'notifications' | 'billing' | 'language'>('main')
    const [isSaving, setIsSaving] = React.useState(false)

    // Reset view when drawer closes
    React.useEffect(() => {
        if (!isOpen) {
            setTimeout(() => setView('main'), 300)
        }
    }, [isOpen])

    const handleBack = () => setView('main')
    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[60] animate-in fade-in duration-300"
                    onClick={onClose}
                />
            )}

            {/* Drawer */}
            <div className={cn(
                "fixed top-0 right-0 z-[70] h-screen w-full max-w-sm bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl transition-transform duration-500 ease-out flex flex-col",
                isOpen ? "translate-x-0" : "translate-x-full"
            )}>
                {/* Header */}
                <div className="h-20 flex items-center gap-4 px-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
                    {view !== 'main' && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleBack}
                            className="rounded-xl shrink-0 h-10 w-10 hover:bg-slate-200 dark:hover:bg-slate-800"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    )}
                    <div className="flex-1 min-w-0">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-none capitalize">
                            {view === 'main' ? 'Settings' : view}
                        </h2>
                        {view === 'main' && <p className="text-xs text-slate-500 font-medium mt-1.5 truncate">Manage your account & portal preferences</p>}
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} className="rounded-xl shrink-0 hover:bg-slate-200 dark:hover:bg-slate-800">
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {view === 'main' && (
                        <>
                            {/* User Summary */}
                            <div className="p-6">
                                <div className="flex items-center gap-4 p-4 rounded-3xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
                                    <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-blue-600/20">
                                        MK
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-slate-900 dark:text-white truncate">Mohit Kumar</h3>
                                        <p className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest mt-0.5">Primary Guardian</p>
                                        <p className="text-[10px] text-slate-500 font-medium truncate mt-0.5">mohit.k@example.com</p>
                                    </div>
                                </div>
                            </div>

                            {/* Navigation Groups */}
                            <div className="px-3 pb-8 space-y-2">
                                <div className="px-4 py-2">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Account Configuration</h4>
                                </div>

                                <SettingsItem icon={User} label="Profile Information" description="Name, phone & email details" onClick={() => setView('profile')} />
                                <SettingsItem icon={Bell} label="Notification Settings" description="Email, SMS & App alerts" badge="3 new" onClick={() => setView('notifications')} />
                                <SettingsItem icon={CreditCard} label="Billing & Payments" description="Payment methods & history" onClick={() => setView('billing')} />

                                <div className="px-4 py-6">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">System Preferences</h4>
                                </div>

                                <SettingsItem
                                    icon={Palette}
                                    label="Appearance"
                                    description={darkMode ? "Dark Mode Active" : "Light Mode Active"}
                                    action={
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                onToggleDarkMode()
                                            }}
                                            className={cn(
                                                "relative w-12 h-6 rounded-full transition-colors flex items-center px-1",
                                                darkMode ? "bg-blue-600" : "bg-slate-300"
                                            )}
                                        >
                                            <div className={cn(
                                                "w-4 h-4 rounded-full bg-white shadow-sm transition-transform flex items-center justify-center",
                                                darkMode ? "translate-x-6" : "translate-x-0"
                                            )}>
                                                {darkMode ? <Moon className="w-2.5 h-2.5 text-blue-600" /> : <Sun className="w-2.5 h-2.5 text-amber-500" />}
                                            </div>
                                        </button>
                                    }
                                />
                                <SettingsItem icon={Globe} label="Language" description="English (India)" onClick={() => setView('language')} />
                                <SettingsItem icon={Shield} label="Security & Privacy" description="Password & active sessions" onClick={() => setView('security')} />

                                <div className="px-4 py-6">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Support</h4>
                                </div>

                                <SettingsItem icon={HelpCircle} label="Help Center" description="FAQs, guides & support chat" onClick={() => alert('Help center is under maintenance.')} />
                                <SettingsItem icon={ExternalLink} label="Terms of Service" description="Legal & privacy policy" onClick={() => alert('Terms of service will be available in the next update.')} />
                            </div>
                        </>
                    )}

                    {view === 'profile' && (
                        <div className="p-6 space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <p className="text-xs font-black uppercase tracking-widest text-slate-400 px-1">Full Name</p>
                                    <Input defaultValue="Mohit Kumar" className="rounded-2xl h-12 bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800" />
                                </div>
                                <div className="space-y-2">
                                    <p className="text-xs font-black uppercase tracking-widest text-slate-400 px-1">Email Address</p>
                                    <Input defaultValue="mohit.k@example.com" className="rounded-2xl h-12 bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800" />
                                </div>
                                <div className="space-y-2">
                                    <p className="text-xs font-black uppercase tracking-widest text-slate-400 px-1">Phone Number</p>
                                    <Input defaultValue="+91 98765 43210" className="rounded-2xl h-12 bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800" />
                                </div>
                            </div>
                            <Button
                                className="w-full h-12 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-600/20"
                                onClick={async () => {
                                    setIsSaving(true)
                                    await updateProfile(new FormData())
                                    setIsSaving(false)
                                    setView('main')
                                    alert('Profile updated successfully')
                                }}
                                disabled={isSaving}
                            >
                                {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Check className="w-4 h-4 mr-2" />}
                                Save Changes
                            </Button>
                        </div>
                    )}

                    {view === 'security' && (
                        <div className="p-6 space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <div className="space-y-4">
                                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 px-1">Change Password</h3>
                                <div className="space-y-2">
                                    <p className="text-xs font-bold text-slate-600 dark:text-slate-400 px-1">Current Password</p>
                                    <Input type="password" placeholder="••••••••" className="rounded-2xl h-12 bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800" />
                                </div>
                                <div className="space-y-2">
                                    <p className="text-xs font-bold text-slate-600 dark:text-slate-400 px-1">New Password</p>
                                    <Input type="password" placeholder="••••••••" className="rounded-2xl h-12 bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800" />
                                </div>
                            </div>
                            <Button
                                className="w-full h-12 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-600/20"
                                onClick={async () => {
                                    setIsSaving(true)
                                    await changePassword(new FormData())
                                    setIsSaving(false)
                                    setView('main')
                                    alert('Password changed successfully')
                                }}
                                disabled={isSaving}
                            >
                                {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Lock className="w-4 h-4 mr-2" />}
                                Update Security
                            </Button>

                            <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 px-1 mb-4">Privacy</h3>
                                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">Profile Visibility</p>
                                        <p className="text-[10px] text-slate-500">Allow teachers to view bio</p>
                                    </div>
                                    <button className="w-10 h-5 bg-blue-600 rounded-full flex items-center px-1"><div className="w-3 h-3 bg-white rounded-full ml-auto" /></button>
                                </div>
                            </div>
                        </div>
                    )}

                    {view === 'notifications' && (
                        <div className="p-6 space-y-4 animate-in slide-in-from-right-4 duration-300">
                            {[
                                { id: 'email', label: 'Email Alerts', desc: 'Fee reminders & announcements' },
                                { id: 'sms', label: 'SMS Notifications', desc: 'Urgent alerts & emergency info' },
                                { id: 'push', label: 'Push Notifications', desc: 'Real-time school updates' }
                            ].map((pref) => (
                                <div key={pref.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/50">
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">{pref.label}</p>
                                        <p className="text-[10px] text-slate-500">{pref.desc}</p>
                                    </div>
                                    <button
                                        onClick={() => alert(`${pref.label} updated`)}
                                        className="w-12 h-6 bg-blue-600 rounded-full flex items-center px-1 shadow-inner shadow-black/10"
                                    >
                                        <div className="w-4 h-4 bg-white rounded-full ml-auto shadow-sm" />
                                    </button>
                                </div>
                            ))}
                            <div className="pt-4">
                                <p className="text-[10px] text-slate-400 text-center font-medium italic">
                                    Changes are saved automatically
                                </p>
                            </div>
                        </div>
                    )}

                    {view === 'billing' && (
                        <div className="p-6 space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <div className="space-y-4">
                                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 px-1">Saved Methods</h3>
                                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center py-8 gap-3">
                                    <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                        <CreditCard className="w-6 h-6" />
                                    </div>
                                    <p className="text-xs font-bold text-slate-500">No payment methods saved</p>
                                    <Button variant="outline" size="sm" className="rounded-xl border-slate-200 dark:border-slate-700 text-xs font-bold hover:bg-white dark:hover:bg-slate-800 transition-colors">
                                        Add New Method
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 px-1">Recent Transactions</h3>
                                <div className="space-y-2">
                                    {[
                                        { id: '1', date: 'Jan 15, 2024', amount: '₹12,450', status: 'Paid', type: 'Tuition Fees' },
                                        { id: '2', date: 'Dec 12, 2023', amount: '₹2,500', status: 'Paid', type: 'Transport' }
                                    ].map((tx) => (
                                        <div key={tx.id} className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800">
                                            <div>
                                                <p className="text-sm font-bold text-slate-900 dark:text-white">{tx.type}</p>
                                                <p className="text-[10px] text-slate-500">{tx.date}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-black text-slate-900 dark:text-white">{tx.amount}</p>
                                                <span className="text-[8px] font-black uppercase text-emerald-500">{tx.status}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {view === 'language' && (
                        <div className="p-6 space-y-4 animate-in slide-in-from-right-4 duration-300">
                            {[
                                { id: 'en', label: 'English', desc: 'Global standard', selected: true },
                                { id: 'hi', label: 'Hindi (हिन्दी)', desc: 'Regional language', selected: false },
                                { id: 'fr', label: 'French (Français)', desc: 'European standard', selected: false }
                            ].map((lang) => (
                                <button
                                    key={lang.id}
                                    onClick={() => {
                                        alert(`Language set to ${lang.label}`)
                                        setView('main')
                                    }}
                                    className={cn(
                                        "w-full flex items-center justify-between p-4 rounded-2xl border transition-all",
                                        lang.selected
                                            ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                                            : "bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 hover:border-blue-200"
                                    )}
                                >
                                    <div className="text-left">
                                        <p className={cn("text-sm font-bold", lang.selected ? "text-blue-600 dark:text-blue-400" : "text-slate-900 dark:text-white")}>
                                            {lang.label}
                                        </p>
                                        <p className="text-[10px] text-slate-500">{lang.desc}</p>
                                    </div>
                                    {lang.selected && <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
                    <Button
                        onClick={() => logout()}
                        className="w-full h-12 rounded-2xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 dark:bg-red-900/10 dark:hover:bg-red-900/20 dark:border-red-900/30 flex items-center justify-center gap-2 font-bold transition-all group"
                    >
                        <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Sign Out
                    </Button>
                    <p className="text-[10px] text-center text-slate-400 font-black uppercase tracking-[0.25em] mt-4">
                        EduVerse v1.0.4-alpha
                    </p>
                </div>
            </div>
        </>
    )
}

function SettingsItem({
    icon: Icon,
    label,
    description,
    badge,
    action,
    onClick
}: {
    icon: any,
    label: string,
    description?: string,
    badge?: string,
    action?: React.ReactNode,
    onClick?: () => void
}) {
    return (
        <button
            onClick={onClick}
            className="w-full flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group text-left"
        >
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 group-hover:text-blue-600 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 transition-all">
                <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{label}</p>
                    {badge && (
                        <span className="px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-600 text-[8px] font-black uppercase tracking-tighter">
                            {badge}
                        </span>
                    )}
                </div>
                {description && <p className="text-[10px] text-slate-500 font-medium truncate mt-0.5">{description}</p>}
            </div>
            <div className="shrink-0">
                {action || <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors" />}
            </div>
        </button>
    )
}
