'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
    Star,
    MessageSquare,
    Send,
    ShieldCheck,
    User,
    CheckCircle2,
    AlertCircle,
    ChevronRight,
    Search
} from 'lucide-react'
import { ParentChild } from '../actions/types'
import { ChildTeacher, submitTeacherRating } from '../actions/teacherActions'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'

export default function TeachersContent({
    initialChildren,
    teachersData,
    selectedChildId: propSelectedChildId
}: {
    initialChildren: ParentChild[],
    teachersData: ChildTeacher[],
    selectedChildId: string
}) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const [localSelectedChildId, setLocalSelectedChildId] = useState(propSelectedChildId)
    const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(null)
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const handleChildSelect = (id: string) => {
        setLocalSelectedChildId(id)
        const params = new URLSearchParams(searchParams.toString())
        params.set('childId', id)
        router.push(`${pathname}?${params.toString()}`)
    }

    const selectedChild = initialChildren.find(c => c.id === localSelectedChildId) || initialChildren[0]
    const selectedTeacher = teachersData.find(t => t.id === selectedTeacherId)

    const handleSubmit = async () => {
        if (!selectedTeacherId || rating === 0) return

        setIsSubmitting(true)
        try {
            await submitTeacherRating({
                teacherId: selectedTeacherId,
                teacherName: selectedTeacher?.name || '',
                subject: selectedTeacher?.subject || '',
                rating,
                comment,
                date: new Date().toISOString()
            })
            setIsSuccess(true)
            setTimeout(() => {
                setIsSuccess(false)
                setSelectedTeacherId(null)
                setRating(0)
                setComment('')
            }, 3000)
        } catch (err) {
            console.error(err)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight dark:text-white">Teacher Rating & Feedback</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Help us improve quality by rating your child&apos;s educators.
                    </p>
                </div>

                <div className="flex bg-white dark:bg-slate-900 p-1 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    {initialChildren.map((child) => (
                        <button
                            key={child.id}
                            onClick={() => handleChildSelect(child.id)}
                            className={cn(
                                "px-4 py-2 rounded-xl text-sm font-bold transition-all",
                                localSelectedChildId === child.id
                                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                                    : "text-slate-500 hover:text-blue-600"
                            )}
                        >
                            {child.name.split(' ')[0]}
                        </button>
                    ))}
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Teacher List */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-sm font-black uppercase tracking-widest text-slate-500 px-1">Curriculum Faculty</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {teachersData.map((teacher) => (
                            <button
                                key={teacher.id}
                                onClick={() => setSelectedTeacherId(teacher.id)}
                                className={cn(
                                    "text-left p-5 rounded-3xl border transition-all relative overflow-hidden group",
                                    selectedTeacherId === teacher.id
                                        ? "bg-white dark:bg-slate-900 border-blue-500 shadow-xl shadow-blue-500/10 ring-2 ring-blue-500/20"
                                        : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-300"
                                )}
                            >
                                <div className="flex items-center gap-4 relative z-10">
                                    <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 font-black text-xl">
                                        {teacher.name[0]}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="font-bold text-slate-900 dark:text-white truncate">{teacher.name}</h4>
                                            {teacher.isClassTeacher && (
                                                <Badge className="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 border-0 text-[8px] font-black uppercase tracking-tighter">Class Teacher</Badge>
                                            )}
                                        </div>
                                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{teacher.subject}</p>
                                        <p className="text-[10px] text-slate-400 mt-1">{teacher.qualification}</p>
                                    </div>
                                    <ChevronRight className={cn(
                                        "w-5 h-5 transition-transform",
                                        selectedTeacherId === teacher.id ? "text-blue-600 translate-x-1" : "text-slate-300"
                                    )} />
                                </div>
                                {selectedTeacherId === teacher.id && (
                                    <div className="absolute top-0 right-0 p-3">
                                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>

                    <Card className="p-6 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border-dashed">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm">
                                <Search className="w-5 h-5 text-slate-400" />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 dark:text-white">Missing a teacher?</h4>
                                <p className="text-xs text-slate-500">Only main subject teachers are listed currently.</p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Rating Panel */}
                <div className="space-y-6">
                    <h2 className="text-sm font-black uppercase tracking-widest text-slate-500 px-1">Feedback Panel</h2>
                    {selectedTeacherId ? (
                        <Card className="border-0 shadow-2xl rounded-3xl overflow-hidden bg-white dark:bg-slate-900 animate-in slide-in-from-right-4 duration-500">
                            <CardHeader className="bg-slate-900 text-white p-6">
                                <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest mb-1">Rating Now</p>
                                <CardTitle className="text-xl">{selectedTeacher?.name}</CardTitle>
                                <CardDescription className="text-slate-400">{selectedTeacher?.subject} Faculty</CardDescription>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                <div>
                                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Overall Rating</p>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <button
                                                key={s}
                                                onClick={() => setRating(s)}
                                                className="transition-transform active:scale-95"
                                            >
                                                <Star
                                                    className={cn(
                                                        "w-10 h-10 transition-colors",
                                                        rating >= s ? "fill-amber-400 text-amber-400" : "text-slate-200 dark:text-slate-700"
                                                    )}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Detailed Comments</p>
                                    <Textarea
                                        placeholder="Write your constructive feedback here..."
                                        className="rounded-2xl border-slate-200 dark:border-slate-800 min-h-[120px] focus-visible:ring-blue-500"
                                        value={comment}
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setComment(e.target.value)}
                                    />
                                </div>

                                <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-800 flex items-start gap-3">
                                    <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                                    <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold leading-relaxed">
                                        Your feedback is encrypted and anonymous. It is used solely for quality assurance and faculty development.
                                    </p>
                                </div>

                                {isSuccess ? (
                                    <div className="bg-emerald-500 text-white p-4 rounded-2xl flex items-center justify-center gap-3 animate-in zoom-in duration-300">
                                        <CheckCircle2 className="w-6 h-6" />
                                        <span className="font-black">Rating Submitted!</span>
                                    </div>
                                ) : (
                                    <Button
                                        className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-xl shadow-blue-600/20 group"
                                        disabled={rating === 0 || isSubmitting}
                                        onClick={handleSubmit}
                                    >
                                        {isSubmitting ? <span className="animate-pulse">Submitting...</span> : (
                                            <>Submit Feedback <Send className="w-4 h-4 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></>
                                        )}
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="border-0 shadow-sm rounded-3xl bg-slate-50 dark:bg-slate-900/50 p-8 border-dashed flex flex-col items-center text-center">
                            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                                <User className="w-8 h-8 text-slate-300" />
                            </div>
                            <h4 className="font-bold text-slate-900 dark:text-white">Select a Teacher</h4>
                            <p className="text-xs text-slate-500 mt-1 max-w-[180px]">
                                Choose a teacher from the list to start providing your feedback.
                            </p>
                        </Card>
                    )}

                    <Card className="p-6 border-0 bg-slate-900 text-white rounded-3xl relative overflow-hidden">
                        <div className="flex items-center gap-3 mb-4 relative z-10">
                            <MessageSquare className="w-5 h-5 text-blue-400" />
                            <h4 className="font-bold">Recent Impact</h4>
                        </div>
                        <p className="text-xs text-slate-400 italic leading-relaxed relative z-10">
                            &quot;Parent feedback has led to a 15% improvement in extracurricular participation this semester.&quot;
                        </p>
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Star className="w-20 h-20" />
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}

