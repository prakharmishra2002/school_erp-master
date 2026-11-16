'use client'

import { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { AlertCircle, LogOut } from 'lucide-react'
import { toast } from 'sonner'

interface StatusChangeDialogProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    title: string
    entityName: string
    onConfirm: (data: { status: string, reason: string, details: string }) => void
}

export function StatusChangeDialog({ isOpen, onOpenChange, title, entityName, onConfirm }: StatusChangeDialogProps) {
    const [status, setStatus] = useState('left')
    const [reason, setReason] = useState('')
    const [details, setDetails] = useState('')

    const handleConfirm = () => {
        if (!reason) {
            toast.error("Please select a primary reason.")
            return
        }
        onConfirm({ status, reason, details })
        onOpenChange(false)
        toast.success(`Status updated for ${entityName}`, {
            description: `Marked as ${status} due to ${reason}.`
        })
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[450px] rounded-[2.5rem] border-slate-100 p-0 overflow-hidden shadow-2xl">
                <div className="bg-rose-500 p-8 text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <DialogTitle className="text-2xl font-black mb-1">Exit/Status Update</DialogTitle>
                        <DialogDescription className="text-rose-100 font-medium">Process exit clearance for {entityName}.</DialogDescription>
                    </div>
                    <LogOut className="absolute top-0 right-0 p-8 w-32 h-32 text-white/10 rotate-12" />
                </div>

                <div className="p-8 space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">New System Status</label>
                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger className="h-12 rounded-2xl bg-slate-50 border-slate-100 font-bold">
                                    <SelectValue placeholder="Select Status" />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-slate-100 shadow-xl">
                                    <SelectItem value="left">Mark as Left/Exited</SelectItem>
                                    <SelectItem value="suspended">Process Suspension</SelectItem>
                                    <SelectItem value="resigned">Resignation (Staff Only)</SelectItem>
                                    <SelectItem value="graduated">Graduated (Students Only)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Primary Reason</label>
                            <Select value={reason} onValueChange={setReason}>
                                <SelectTrigger className="h-12 rounded-2xl bg-slate-50 border-slate-100 font-bold">
                                    <SelectValue placeholder="Select Reason" />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-slate-100 shadow-xl">
                                    <SelectItem value="personal">Personal Reasons</SelectItem>
                                    <SelectItem value="academic">Academic Dissatisfaction</SelectItem>
                                    <SelectItem value="transfer">Transfer to another Institute</SelectItem>
                                    <SelectItem value="conduct">Disciplinary Grounds</SelectItem>
                                    <SelectItem value="financial">Financial Constraints</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Additional Details (Mandatory)</label>
                            <Textarea
                                placeholder="Please provide specific reasoning for the system logs..."
                                className="min-h-[100px] rounded-2xl bg-slate-50 border-slate-100 font-medium resize-none"
                                value={details}
                                onChange={(e) => setDetails(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Button
                            variant="ghost"
                            className="flex-1 h-12 rounded-2xl font-bold text-slate-400"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="flex-1 h-12 rounded-2xl bg-rose-600 hover:bg-rose-700 font-black uppercase tracking-widest text-xs shadow-xl shadow-rose-600/20 text-white"
                            onClick={handleConfirm}
                        >
                            Confirm Exit
                        </Button>
                    </div>

                    <div className="flex items-center gap-2 p-4 bg-amber-50 rounded-2xl border border-amber-100">
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                        <p className="text-[10px] font-bold text-amber-700 leading-tight">
                            Note: This action may restrict login access and archive user records. This is permanent.
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
