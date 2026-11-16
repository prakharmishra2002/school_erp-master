'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    Bell,
    Megaphone,
    AlertCircle,
    CheckCircle2,
    Search,
    Filter,
    Calendar,
    IndianRupee,
    ChevronRight,
    MoreVertical
} from 'lucide-react'
import { ParentNotification, ParentChild } from '../actions/types'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'

export default function NotificationsContent({
    initialNotifications,
    initialChildren,
    selectedChildId: propSelectedChildId
}: {
    initialNotifications: ParentNotification[],
    initialChildren: ParentChild[],
    selectedChildId: string
}) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const [localSelectedChildId, setLocalSelectedChildId] = useState(propSelectedChildId)
    const [notifications, setNotifications] = useState(initialNotifications)
    const [filter, setFilter] = useState<'all' | 'announcement' | 'fee' | 'attendance'>('all')

    const handleChildSelect = (id: string) => {
        setLocalSelectedChildId(id)
        const params = new URLSearchParams(searchParams.toString())
        params.set('childId', id)
        router.push(`${pathname}?${params.toString()}`)
    }

    const filtered = filter === 'all'
        ? notifications
        : notifications.filter(n => n.type === filter)

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'fee': return <IndianRupee className="w-5 h-5 text-amber-600" />
            case 'attendance': return <Calendar className="w-5 h-5 text-emerald-600" />
            case 'announcement': return <Megaphone className="w-5 h-5 text-blue-600" />
            default: return <Bell className="w-5 h-5 text-slate-600" />
        }
    }

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'fee': return 'bg-amber-100 dark:bg-amber-900/30'
            case 'attendance': return 'bg-emerald-100 dark:bg-emerald-900/30'
            case 'announcement': return 'bg-blue-100 dark:bg-blue-900/30'
            default: return 'bg-slate-100 dark:bg-slate-800'
        }
    }

    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h1 className="text-3xl font-bold tracking-tight dark:text-white">Notification Hub</h1>
                        <Badge className="bg-blue-600 text-white font-black text-[10px] uppercase">
                            {notifications.filter(n => !n.isRead).length} New
                        </Badge>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400">
                        Stay updated with school announcements and alerts.
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

                <div className="flex gap-2">
                    <Button variant="outline" className="rounded-xl gap-2 font-bold shadow-sm">
                        <CheckCircle2 className="w-4 h-4" /> Mark all read
                    </Button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Filters Sidebar */}
                <div className="space-y-4">
                    <h2 className="text-sm font-black uppercase tracking-widest text-slate-500 px-1">Categories</h2>
                    <div className="flex lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
                        {(['all', 'announcement', 'fee', 'attendance'] as const).map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                className={cn(
                                    "flex-shrink-0 lg:w-full text-left px-5 py-3.5 rounded-2xl border transition-all flex items-center justify-between group",
                                    filter === cat
                                        ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20"
                                        : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-300"
                                )}
                            >
                                <span className="font-bold capitalize">{cat}</span>
                                <Badge className={cn(
                                    "font-black text-[10px]",
                                    filter === cat ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                                )}>
                                    {cat === 'all' ? notifications.length : notifications.filter(n => n.type === cat).length}
                                </Badge>
                            </button>
                        ))}
                    </div>

                    <Card className="p-6 border-0 bg-gradient-to-br from-slate-800 to-slate-950 text-white rounded-3xl relative overflow-hidden hidden lg:block">
                        <div className="relative z-10">
                            <h4 className="font-bold mb-2">Push Alerts</h4>
                            <p className="text-xs text-slate-400 mb-4">Never miss an update. Enable browser notifications.</p>
                            <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl h-10">
                                Enable Now
                            </Button>
                        </div>
                    </Card>
                </div>

                {/* Notifications List */}
                <div className="lg:col-span-3 space-y-4">
                    <div className="flex items-center justify-between mb-2 px-1">
                        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400">
                            <Bell className="w-3.5 h-3.5" />
                            Showing {filtered.length} Updates
                        </div>
                    </div>

                    <div className="space-y-3">
                        {filtered.map((notif) => (
                            <Card
                                key={notif.id}
                                className={cn(
                                    "border-slate-200 dark:border-slate-800 shadow-sm rounded-3xl overflow-hidden group hover:border-blue-500/50 transition-all",
                                    !notif.isRead && "border-l-4 border-l-blue-600 ring-1 ring-blue-600/5 bg-blue-50/10 dark:bg-blue-900/5"
                                )}
                            >
                                <CardContent className="p-5 flex gap-5">
                                    <div className={cn(
                                        "w-14 h-14 rounded-2xl shrink-0 flex items-center justify-center transition-transform group-hover:scale-110",
                                        getTypeColor(notif.type)
                                    )}>
                                        {getTypeIcon(notif.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-1">
                                            <div className="flex items-center gap-2">
                                                <h4 className={cn(
                                                    "font-bold text-lg text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors",
                                                    !notif.isRead && "font-black"
                                                )}>
                                                    {notif.title}
                                                </h4>
                                                {!notif.isRead && (
                                                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                                                )}
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-tighter text-slate-400">
                                                {new Date(notif.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed pr-6">
                                            {notif.message}
                                        </p>
                                        <div className="mt-4 flex items-center gap-4">
                                            <button className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1">
                                                View Details <ChevronRight className="w-3 h-3" />
                                            </button>
                                            {!notif.isRead && (
                                                <button className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors">
                                                    Mark as read
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" className="shrink-0 rounded-xl text-slate-300 hover:text-slate-600">
                                        <MoreVertical className="w-4 h-4" />
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {filtered.length === 0 && (
                        <div className="p-20 flex flex-col items-center justify-center bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-100 dark:border-slate-800">
                            <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-4">
                                <CheckCircle2 className="w-8 h-8 text-slate-200" />
                            </div>
                            <h4 className="font-bold text-slate-400 uppercase tracking-widest">No updates found</h4>
                            <p className="text-xs text-slate-400 mt-1">Try clearing your filters or check back later.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

