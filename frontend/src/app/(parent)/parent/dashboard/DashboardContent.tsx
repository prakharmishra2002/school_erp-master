'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Users,
    CalendarCheck,
    BookOpen,
    IndianRupee,
    ArrowRight,
    TrendingUp,
    AlertCircle,
    Bell,
    ChevronRight,
    Star,
} from 'lucide-react'
import { ParentChild, ParentNotification } from '../actions/types'
import Link from 'next/link'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'

export default function DashboardContent({
    initialChildren,
    notifications,
    selectedChildId: propSelectedChildId
}: {
    initialChildren: ParentChild[],
    notifications: ParentNotification[],
    selectedChildId?: string
}) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const [localSelectedChildId, setLocalSelectedChildId] = useState(propSelectedChildId || initialChildren[0]?.id)
    const selectedChild = initialChildren.find(c => c.id === localSelectedChildId) || initialChildren[0]

    const handleChildSelect = (id: string) => {
        setLocalSelectedChildId(id)
        const params = new URLSearchParams(searchParams.toString())
        params.set('childId', id)
        router.push(`${pathname}?${params.toString()}`)
    }

    return (
        <div className="space-y-8">
            {/* Child Selector */}
            <section>
                <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4 px-1">
                    Your Children
                </h2>
                <div className="flex gap-4 overflow-x-auto pb-4 px-1 no-scrollbar">
                    {initialChildren.map((child) => (
                        <button
                            key={child.id}
                            onClick={() => handleChildSelect(child.id)}
                            className={cn(
                                "flex-shrink-0 flex items-center gap-4 p-4 rounded-3xl border-2 transition-all duration-300 text-left",
                                localSelectedChildId === child.id
                                    ? "bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-600/20 scale-105"
                                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-300"
                            )}
                        >
                            <div className={cn(
                                "w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl shadow-inner",
                                localSelectedChildId === child.id ? "bg-white/20" : "bg-blue-50 dark:bg-blue-900/30 text-blue-600"
                            )}>
                                {child.name[0]}
                            </div>
                            <div>
                                <p className="font-bold text-lg">{child.name}</p>
                                <p className={cn(
                                    "text-xs font-medium",
                                    localSelectedChildId === child.id ? "text-blue-100" : "text-slate-500"
                                )}>
                                    {child.class}-{child.section} • Roll #{child.rollNo}
                                </p>
                            </div>
                        </button>
                    ))}
                </div>
            </section>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white overflow-hidden group">
                    <CardContent className="p-6 relative">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                                <CalendarCheck className="w-6 h-6" />
                            </div>
                            <div className="flex items-center gap-1 text-xs font-bold bg-white/20 px-2 py-1 rounded-full">
                                <TrendingUp className="w-3 h-3" />
                                +2%
                            </div>
                        </div>
                        <p className="text-sm font-medium text-emerald-50 opacity-90">Attendance Rate</p>
                        <h3 className="text-3xl font-bold mt-1 tracking-tight">
                            {selectedChild.attendance}%
                        </h3>
                        {/* Background pattern */}
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                            <CalendarCheck className="w-24 h-24 -mr-8 -mt-8" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white overflow-hidden group">
                    <CardContent className="p-6 relative">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                                <BookOpen className="w-6 h-6" />
                            </div>
                            <div className="flex items-center gap-1 text-xs font-bold bg-white/20 px-2 py-1 rounded-full">
                                <Star className="w-3 h-3" />
                                Top 10%
                            </div>
                        </div>
                        <p className="text-sm font-medium text-blue-50 opacity-90">Academic Performance</p>
                        <h3 className="text-3xl font-bold mt-1 tracking-tight">
                            {selectedChild.lastResult}
                        </h3>
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                            <BookOpen className="w-24 h-24 -mr-8 -mt-8" />
                        </div>
                    </CardContent>
                </Card>

                <Card className={cn(
                    "border-0 shadow-lg overflow-hidden group",
                    selectedChild.pendingFees > 0
                        ? "bg-gradient-to-br from-amber-500 to-orange-600 text-white"
                        : "bg-gradient-to-br from-slate-700 to-slate-900 text-white"
                )}>
                    <CardContent className="p-6 relative">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                                <IndianRupee className="w-6 h-6" />
                            </div>
                            {selectedChild.pendingFees > 0 && (
                                <Badge className="bg-white/20 text-white border-0">Due soon</Badge>
                            )}
                        </div>
                        <p className="text-sm font-medium text-amber-50 opacity-90">Pending Fees</p>
                        <h3 className="text-3xl font-bold mt-1 tracking-tight">
                            ₹{selectedChild.pendingFees.toLocaleString()}
                        </h3>
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                            <IndianRupee className="w-24 h-24 -mr-8 -mt-8" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Areas */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Notifications */}
                <Card className="lg:col-span-2 border-slate-200 dark:border-slate-800 shadow-sm rounded-3xl overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 p-6">
                        <div>
                            <CardTitle className="text-lg">Recent Updates</CardTitle>
                            <p className="text-xs text-slate-500 mt-0.5">Stay informed about school activities</p>
                        </div>
                        <Button variant="ghost" size="sm" className="gap-1" asChild>
                            <Link href="/parent/notifications">
                                View All <ChevronRight className="w-4 h-4" />
                            </Link>
                        </Button>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            {notifications.map((notif) => (
                                <div key={notif.id} className="p-5 flex gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer">
                                    <div className={cn(
                                        "w-12 h-12 rounded-2xl shrink-0 flex items-center justify-center",
                                        notif.type === 'fee' ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30" : "bg-blue-100 text-blue-600 dark:bg-blue-900/30"
                                    )}>
                                        {notif.type === 'fee' ? <AlertCircle className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                                                {notif.title}
                                            </h4>
                                            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-tighter">
                                                {new Date(notif.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                                            {notif.message}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Shortcuts */}
                <div className="space-y-6">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 px-1">
                        Quick Shortcuts
                    </h2>
                    <div className="grid grid-cols-1 gap-4">
                        <Link href={`/parent/attendance?childId=${localSelectedChildId}`} className="group">
                            <Card className="p-4 border-slate-200 dark:border-slate-800 hover:border-blue-500 hover:shadow-lg transition-all rounded-2xl flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <CalendarCheck className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-slate-900 dark:text-white">Attendance</p>
                                    <p className="text-xs text-slate-500">View detailed history</p>
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
                            </Card>
                        </Link>
                        <Link href={`/parent/results?childId=${localSelectedChildId}`} className="group">
                            <Card className="p-4 border-slate-200 dark:border-slate-800 hover:border-blue-500 hover:shadow-lg transition-all rounded-2xl flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <BookOpen className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-slate-900 dark:text-white">Grades</p>
                                    <p className="text-xs text-slate-500">Report cards & marks</p>
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
                            </Card>
                        </Link>
                        <Link href={`/parent/fees?childId=${localSelectedChildId}`} className="group">
                            <Card className="p-4 border-slate-200 dark:border-slate-800 hover:border-blue-500 hover:shadow-lg transition-all rounded-2xl flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <IndianRupee className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-slate-900 dark:text-white">Payments</p>
                                    <p className="text-xs text-slate-500">Pay fees & receipts</p>
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
                            </Card>
                        </Link>
                    </div>

                    <Card className="p-6 border-0 bg-blue-600 text-white rounded-3xl relative overflow-hidden">
                        <span className="font-bold text-lg mb-2 relative z-10">Feedback matters!</span>
                        <p className="text-sm text-blue-100 mb-4 relative z-10">
                            Rate your child&apos;s teachers and help us improve.
                        </p>
                        <Button className="w-full bg-white text-blue-600 hover:bg-blue-50 font-bold relative z-10 h-11" asChild>
                            <Link href={`/parent/teachers?childId=${localSelectedChildId}`}>Rate Teachers</Link>
                        </Button>
                        <Star className="absolute -bottom-4 -right-4 w-24 h-24 text-white/10 rotate-12" />
                    </Card>
                </div>
            </div>
        </div>
    )
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ')
}
