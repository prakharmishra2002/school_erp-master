'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Calendar,
    Clock,
    Plus,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Hourglass,
    FileText,
    Send,
    ChevronRight,
    X,
    Download,
    Printer,
    User,
    MessageSquare,
    Check,
    Search,
} from 'lucide-react'

interface LeaveRequest {
    id: string
    type: 'casual' | 'sick' | 'earned' | 'special'
    fromDate: string
    toDate: string
    days: number
    reason: string
    status: 'pending' | 'approved' | 'rejected'
    appliedOn: string
    approvedBy?: string
    remarks?: string
}

// Leave Detail Modal
function LeaveDetailModal({ leave, onClose }: { leave: LeaveRequest; onClose: () => void }) {
    const typeStyles = {
        casual: { bg: 'bg-blue-100 dark:bg-blue-900/50', text: 'text-blue-700 dark:text-blue-400', gradient: 'from-blue-500 to-indigo-600' },
        sick: { bg: 'bg-red-100 dark:bg-red-900/50', text: 'text-red-700 dark:text-red-400', gradient: 'from-red-500 to-rose-600' },
        earned: { bg: 'bg-emerald-100 dark:bg-emerald-900/50', text: 'text-emerald-700 dark:text-emerald-400', gradient: 'from-emerald-500 to-teal-600' },
        special: { bg: 'bg-violet-100 dark:bg-violet-900/50', text: 'text-violet-700 dark:text-violet-400', gradient: 'from-violet-500 to-purple-600' },
    }

    const statusStyles = {
        pending: { bg: 'bg-amber-100 dark:bg-amber-900/50', text: 'text-amber-700 dark:text-amber-400', icon: Hourglass },
        approved: { bg: 'bg-emerald-100 dark:bg-emerald-900/50', text: 'text-emerald-700 dark:text-emerald-400', icon: CheckCircle2 },
        rejected: { bg: 'bg-red-100 dark:bg-red-900/50', text: 'text-red-700 dark:text-red-400', icon: XCircle },
    }

    const StatusIcon = statusStyles[leave.status].icon

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <Card className="w-full max-w-lg animate-slide-up" onClick={e => e.stopPropagation()}>
                <CardHeader className={`border-b border-[var(--border)] bg-gradient-to-r ${typeStyles[leave.type].gradient} text-white`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="font-display text-xl flex items-center gap-2">
                                <FileText className="w-5 h-5" />
                                Leave Request Details
                            </CardTitle>
                            <p className="text-sm text-white/80 mt-1">
                                Applied on {new Date(leave.appliedOn).toLocaleDateString('en-IN', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>
                        <Button variant="ghost" size="sm" className="text-white hover:bg-white/20" onClick={onClose}>
                            <X className="w-5 h-5" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-5 space-y-4">
                    {/* Status Badge */}
                    <div className="flex items-center justify-between">
                        <Badge className={`${typeStyles[leave.type].bg} ${typeStyles[leave.type].text}`}>
                            {leave.type.charAt(0).toUpperCase() + leave.type.slice(1)} Leave
                        </Badge>
                        <Badge className={`${statusStyles[leave.status].bg} ${statusStyles[leave.status].text} gap-1`}>
                            <StatusIcon className="w-3 h-3" />
                            {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                        </Badge>
                    </div>

                    {/* Duration */}
                    <div className="p-4 rounded-xl bg-[var(--background-secondary)] border border-[var(--border)]">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-emerald-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-[var(--foreground-muted)]">Duration</p>
                                <p className="font-semibold text-[var(--foreground)]">
                                    {new Date(leave.fromDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    {' → '}
                                    {new Date(leave.toDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </p>
                            </div>
                            <Badge variant="outline" className="font-mono text-lg">
                                {leave.days} day{leave.days > 1 ? 's' : ''}
                            </Badge>
                        </div>
                    </div>

                    {/* Reason */}
                    <div>
                        <h4 className="text-sm font-semibold text-[var(--foreground)] mb-2 flex items-center gap-2">
                            <MessageSquare className="w-4 h-4 text-[var(--foreground-muted)]" />
                            Reason for Leave
                        </h4>
                        <p className="p-3 rounded-xl bg-[var(--background-secondary)] text-sm text-[var(--foreground-secondary)]">
                            {leave.reason}
                        </p>
                    </div>

                    {/* Approval Info (if approved/rejected) */}
                    {leave.status !== 'pending' && (
                        <div className="p-4 rounded-xl border border-[var(--border)]">
                            <h4 className="text-sm font-semibold text-[var(--foreground)] mb-2 flex items-center gap-2">
                                <User className="w-4 h-4 text-[var(--foreground-muted)]" />
                                {leave.status === 'approved' ? 'Approved By' : 'Rejected By'}
                            </h4>
                            <p className="text-sm text-[var(--foreground-secondary)]">
                                Principal - Dr. Anil Kumar Sharma
                            </p>
                            {leave.remarks && (
                                <p className="text-xs text-[var(--foreground-muted)] mt-2 italic">
                                    "{leave.remarks}"
                                </p>
                            )}
                        </div>
                    )}

                    {/* Timeline */}
                    <div>
                        <h4 className="text-sm font-semibold text-[var(--foreground)] mb-3">Timeline</h4>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                    <Send className="w-4 h-4 text-blue-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-[var(--foreground)]">Request Submitted</p>
                                    <p className="text-xs text-[var(--foreground-muted)]">
                                        {new Date(leave.appliedOn).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })} at 10:30 AM
                                    </p>
                                </div>
                                <Check className="w-4 h-4 text-emerald-500" />
                            </div>
                            {leave.status !== 'pending' && (
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${leave.status === 'approved' ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                                        <StatusIcon className={`w-4 h-4 ${leave.status === 'approved' ? 'text-emerald-600' : 'text-red-600'}`} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-[var(--foreground)]">
                                            {leave.status === 'approved' ? 'Approved' : 'Rejected'}
                                        </p>
                                        <p className="text-xs text-[var(--foreground-muted)]">
                                            {new Date(leave.fromDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })} at 2:15 PM
                                        </p>
                                    </div>
                                    <Check className="w-4 h-4 text-emerald-500" />
                                </div>
                            )}
                            {leave.status === 'pending' && (
                                <div className="flex items-center gap-3 opacity-50">
                                    <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                                        <Hourglass className="w-4 h-4 text-amber-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-[var(--foreground)]">Awaiting Approval</p>
                                        <p className="text-xs text-[var(--foreground-muted)]">Pending principal review</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2 border-t border-[var(--border)]">
                        <Button variant="secondary" className="flex-1 gap-2">
                            <Download className="w-4 h-4" />
                            Download
                        </Button>
                        <Button variant="secondary" className="flex-1 gap-2">
                            <Printer className="w-4 h-4" />
                            Print
                        </Button>
                        {leave.status === 'pending' && (
                            <Button variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                                Cancel Request
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

// New Leave Request Modal
function NewLeaveModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: () => void }) {
    const [leaveType, setLeaveType] = useState('casual')
    const [fromDate, setFromDate] = useState('')
    const [toDate, setToDate] = useState('')
    const [reason, setReason] = useState('')
    const [submitted, setSubmitted] = useState(false)

    const handleSubmit = () => {
        setSubmitted(true)
        setTimeout(() => {
            onSubmit()
        }, 1500)
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <Card className="w-full max-w-lg animate-slide-up" onClick={e => e.stopPropagation()}>
                <CardHeader className="border-b border-[var(--border)]">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                                <Plus className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <CardTitle className="font-display text-lg">New Leave Request</CardTitle>
                                <p className="text-sm text-[var(--foreground-muted)]">Submit a new leave application</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={onClose}>
                            <X className="w-5 h-5" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-5">
                    {submitted ? (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                                <Check className="w-8 h-8 text-emerald-600" />
                            </div>
                            <h3 className="font-semibold text-[var(--foreground)] mb-1">Request Submitted!</h3>
                            <p className="text-sm text-[var(--foreground-muted)]">
                                Your leave request has been sent for approval.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Leave Type */}
                            <div>
                                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">Leave Type</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {[
                                        { id: 'casual', label: 'Casual', color: 'blue' },
                                        { id: 'sick', label: 'Sick', color: 'red' },
                                        { id: 'earned', label: 'Earned', color: 'emerald' },
                                        { id: 'special', label: 'Special', color: 'violet' },
                                    ].map(type => (
                                        <button
                                            key={type.id}
                                            onClick={() => setLeaveType(type.id)}
                                            className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${leaveType === type.id
                                                ? `border-${type.color}-500 bg-${type.color}-50 dark:bg-${type.color}-900/20 text-${type.color}-700 dark:text-${type.color}-400`
                                                : 'border-[var(--border)] hover:border-[var(--border-hover)]'
                                                }`}
                                        >
                                            {type.label} Leave
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Dates */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">From Date</label>
                                    <input
                                        type="date"
                                        value={fromDate}
                                        onChange={e => setFromDate(e.target.value)}
                                        className="w-full px-4 py-3 bg-[var(--background-secondary)] rounded-xl text-sm text-[var(--foreground)] border border-transparent focus:outline-none focus:border-emerald-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">To Date</label>
                                    <input
                                        type="date"
                                        value={toDate}
                                        onChange={e => setToDate(e.target.value)}
                                        className="w-full px-4 py-3 bg-[var(--background-secondary)] rounded-xl text-sm text-[var(--foreground)] border border-transparent focus:outline-none focus:border-emerald-500"
                                    />
                                </div>
                            </div>

                            {/* Reason */}
                            <div>
                                <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">Reason</label>
                                <textarea
                                    rows={4}
                                    value={reason}
                                    onChange={e => setReason(e.target.value)}
                                    placeholder="Please provide a detailed reason for your leave request..."
                                    className="w-full px-4 py-3 bg-[var(--background-secondary)] rounded-xl text-sm text-[var(--foreground)] border border-transparent focus:outline-none focus:border-emerald-500 resize-none"
                                />
                            </div>

                            {/* Note */}
                            <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                                <p className="text-xs text-amber-700 dark:text-amber-400">
                                    Leave requests should be submitted at least 2 days in advance for planned leaves.
                                    Emergency sick leaves can be regularized later with medical certificate.
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-2">
                                <Button variant="ghost" className="flex-1" onClick={onClose}>
                                    Cancel
                                </Button>
                                <Button
                                    className="flex-1 gap-2 bg-emerald-500 hover:bg-emerald-600 text-white"
                                    onClick={handleSubmit}
                                    disabled={!fromDate || !toDate || !reason}
                                >
                                    <Send className="w-4 h-4" />
                                    Submit Request
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

// Leave Card Component
function LeaveCard({ leave, onClick }: { leave: LeaveRequest; onClick: () => void }) {
    const typeStyles = {
        casual: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400',
        sick: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400',
        earned: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400',
        special: 'bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-400',
    }

    const statusStyles = {
        pending: { bg: 'bg-amber-100 dark:bg-amber-900/50', text: 'text-amber-700 dark:text-amber-400', icon: Hourglass },
        approved: { bg: 'bg-emerald-100 dark:bg-emerald-900/50', text: 'text-emerald-700 dark:text-emerald-400', icon: CheckCircle2 },
        rejected: { bg: 'bg-red-100 dark:bg-red-900/50', text: 'text-red-700 dark:text-red-400', icon: XCircle },
    }

    const StatusIcon = statusStyles[leave.status].icon

    return (
        <Card
            className="group hover:shadow-lg hover:border-emerald-300 transition-all duration-300 cursor-pointer"
            onClick={onClick}
        >
            <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Badge className={typeStyles[leave.type]}>
                                {leave.type.charAt(0).toUpperCase() + leave.type.slice(1)} Leave
                            </Badge>
                            <Badge className={`${statusStyles[leave.status].bg} ${statusStyles[leave.status].text} gap-1`}>
                                <StatusIcon className="w-3 h-3" />
                                {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                            </Badge>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-[var(--foreground-muted)]">
                            Applied: {new Date(leave.appliedOn).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                        </span>
                        <ChevronRight className="w-4 h-4 text-[var(--foreground-muted)] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                </div>

                <div className="flex items-center gap-4 mb-3 text-sm">
                    <div className="flex items-center gap-2 text-[var(--foreground-secondary)]">
                        <Calendar className="w-4 h-4 text-[var(--foreground-muted)]" />
                        {new Date(leave.fromDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                        {' → '}
                        {new Date(leave.toDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                    </div>
                    <Badge variant="outline" className="font-mono">
                        {leave.days} day{leave.days > 1 ? 's' : ''}
                    </Badge>
                </div>

                <p className="text-sm text-[var(--foreground-muted)] line-clamp-2">
                    <span className="font-medium text-[var(--foreground)]">Reason:</span> {leave.reason}
                </p>
            </CardContent>
        </Card>
    )
}

export default function LeavePage() {
    const [showNewLeaveModal, setShowNewLeaveModal] = useState(false)
    const [selectedLeave, setSelectedLeave] = useState<LeaveRequest | null>(null)
    const [searchQuery, setSearchQuery] = useState('')

    const leaveBalance = {
        casual: { total: 12, used: 3, remaining: 9 },
        sick: { total: 10, used: 2, remaining: 8 },
        earned: { total: 15, used: 0, remaining: 15 },
    }

    const leaveHistory: LeaveRequest[] = [
        {
            id: '1',
            type: 'casual',
            fromDate: '2026-01-20',
            toDate: '2026-01-21',
            days: 2,
            reason: 'Personal family function to attend in hometown',
            status: 'approved',
            appliedOn: '2026-01-15',
        },
        {
            id: '2',
            type: 'sick',
            fromDate: '2026-01-10',
            toDate: '2026-01-10',
            days: 1,
            reason: 'Unwell due to fever, doctor consultation required',
            status: 'approved',
            appliedOn: '2026-01-10',
        },
        {
            id: '3',
            type: 'casual',
            fromDate: '2026-02-05',
            toDate: '2026-02-05',
            days: 1,
            reason: 'Important personal work at bank',
            status: 'pending',
            appliedOn: '2026-01-28',
        },
        {
            id: '4',
            type: 'sick',
            fromDate: '2025-12-15',
            toDate: '2025-12-15',
            days: 1,
            reason: 'Medical checkup scheduled',
            status: 'approved',
            appliedOn: '2025-12-14',
        },
    ]

    const filteredLeaveHistory = leaveHistory.filter(leave =>
        leave.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
        leave.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        leave.status.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="space-y-6 animate-slide-up">
            {/* Header */}
            <header>
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-2 h-2 rounded-full bg-teal-500" />
                    <span className="text-xs font-medium tracking-widest uppercase text-[var(--foreground-muted)]">
                        Leave Management
                    </span>
                </div>
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                    <div>
                        <h1 className="font-display text-3xl font-semibold tracking-tight text-[var(--foreground)]">
                            Leave Request
                        </h1>
                        <p className="mt-1 text-[var(--foreground-secondary)]">
                            Apply for leave and track your requests
                        </p>
                    </div>
                    <Button
                        size="sm"
                        className="gap-2 bg-emerald-500 hover:bg-emerald-600 text-white"
                        onClick={() => setShowNewLeaveModal(true)}
                    >
                        <Plus className="w-4 h-4" />
                        New Request
                    </Button>
                </div>
            </header>

            {/* Leave Balance */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-blue-200/50 dark:border-blue-800/50 bg-gradient-to-br from-blue-500/5 to-indigo-500/5">
                    <CardContent className="p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-[var(--foreground)]">Casual Leave</h3>
                            <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400">
                                {leaveBalance.casual.remaining} left
                            </Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm text-[var(--foreground-muted)] mb-2">
                            <span>Used: {leaveBalance.casual.used}</span>
                            <span>Total: {leaveBalance.casual.total}</span>
                        </div>
                        <div className="h-2 bg-[var(--background-tertiary)] rounded-full overflow-hidden">
                            <div
                                className="h-full bg-blue-500 rounded-full"
                                style={{ width: `${(leaveBalance.casual.used / leaveBalance.casual.total) * 100}%` }}
                            />
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-red-200/50 dark:border-red-800/50 bg-gradient-to-br from-red-500/5 to-rose-500/5">
                    <CardContent className="p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-[var(--foreground)]">Sick Leave</h3>
                            <Badge className="bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400">
                                {leaveBalance.sick.remaining} left
                            </Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm text-[var(--foreground-muted)] mb-2">
                            <span>Used: {leaveBalance.sick.used}</span>
                            <span>Total: {leaveBalance.sick.total}</span>
                        </div>
                        <div className="h-2 bg-[var(--background-tertiary)] rounded-full overflow-hidden">
                            <div
                                className="h-full bg-red-500 rounded-full"
                                style={{ width: `${(leaveBalance.sick.used / leaveBalance.sick.total) * 100}%` }}
                            />
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-emerald-200/50 dark:border-emerald-800/50 bg-gradient-to-br from-emerald-500/5 to-teal-500/5">
                    <CardContent className="p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-[var(--foreground)]">Earned Leave</h3>
                            <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400">
                                {leaveBalance.earned.remaining} left
                            </Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm text-[var(--foreground-muted)] mb-2">
                            <span>Used: {leaveBalance.earned.used}</span>
                            <span>Total: {leaveBalance.earned.total}</span>
                        </div>
                        <div className="h-2 bg-[var(--background-tertiary)] rounded-full overflow-hidden">
                            <div
                                className="h-full bg-emerald-500 rounded-full"
                                style={{ width: `${(leaveBalance.earned.used / leaveBalance.earned.total) * 100}%` }}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Leave History */}
            <div className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h2 className="font-display text-lg font-semibold text-[var(--foreground)]">
                        Leave History
                    </h2>
                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--foreground-muted)]" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by reason, type, status..."
                            className="w-full pl-10 pr-4 py-2 bg-[var(--background-secondary)] rounded-xl text-sm border border-transparent hover:border-[var(--border)] focus:outline-none focus:border-teal-500 transition-all"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredLeaveHistory.length > 0 ? (
                        filteredLeaveHistory.map(leave => (
                            <LeaveCard
                                key={leave.id}
                                leave={leave}
                                onClick={() => setSelectedLeave(leave)}
                            />
                        ))
                    ) : (
                        <div className="md:col-span-2 py-12 text-center bg-[var(--background-secondary)] rounded-2xl border border-dashed border-[var(--border)]">
                            <p className="text-[var(--foreground-muted)]">No leave requests found matching your search.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            {showNewLeaveModal && (
                <NewLeaveModal
                    onClose={() => setShowNewLeaveModal(false)}
                    onSubmit={() => setShowNewLeaveModal(false)}
                />
            )}
            {selectedLeave && (
                <LeaveDetailModal
                    leave={selectedLeave}
                    onClose={() => setSelectedLeave(null)}
                />
            )}
        </div>
    )
}
