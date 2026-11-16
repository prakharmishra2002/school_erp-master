'use client'

import React, { useState } from 'react'
import { X, Calendar, AlertCircle, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

interface LeaveRequestModalProps {
    isOpen: boolean
    onClose: () => void
    childId: string
    childName: string
    onSubmit: (data: {
        childId: string,
        leaveType: string,
        startDate: string,
        endDate: string,
        reason: string
    }) => Promise<{ success: boolean; message: string }>
}

export default function LeaveRequestModal({ isOpen, onClose, childId, childName, onSubmit }: LeaveRequestModalProps) {
    const [leaveType, setLeaveType] = useState('Sick Leave')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [reason, setReason] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null)

    if (!isOpen) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setStatus(null)

        try {
            const result = await onSubmit({
                childId,
                leaveType,
                startDate,
                endDate,
                reason
            })
            if (result.success) {
                setStatus({ type: 'success', message: result.message })
                setTimeout(() => {
                    onClose()
                    setStatus(null)
                    // Reset form
                    setStartDate('')
                    setEndDate('')
                    setReason('')
                }, 2000)
            } else {
                setStatus({ type: 'error', message: result.message })
            }
        } catch (error) {
            setStatus({ type: 'error', message: 'Something went wrong. Please try again.' })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-200 dark:border-slate-800">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/50">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Apply for Leave</h2>
                        <p className="text-xs text-slate-500 font-medium mt-1">Requesting leave for <span className="text-blue-600 font-bold">{childName}</span></p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} className="rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800">
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {status && (
                        <div className={cn(
                            "p-4 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-2",
                            status.type === 'success' ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-red-50 text-red-600 border border-red-100"
                        )}>
                            {status.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                            <p className="text-sm font-bold">{status.message}</p>
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400">Leave Type</label>
                            <select
                                value={leaveType}
                                onChange={(e) => setLeaveType(e.target.value)}
                                className="w-full h-11 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                required
                            >
                                <option>Sick Leave</option>
                                <option>Urgent Work</option>
                                <option>Medical Appointment</option>
                                <option>Family Function</option>
                                <option>Other</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Start Date</label>
                                <Input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    required
                                    className="rounded-xl"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400">End Date</label>
                                <Input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    required
                                    className="rounded-xl"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400">Reason for Leave</label>
                            <Textarea
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder="Please explain the reason for leave..."
                                required
                                className="min-h-[120px] rounded-2xl resize-none"
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <Button type="button" variant="outline" onClick={onClose} className="flex-1 rounded-2xl h-12 font-bold">
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting} className="flex-1 rounded-2xl h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-600/20">
                            {isSubmitting ? 'Submitting...' : 'Submit Request'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
