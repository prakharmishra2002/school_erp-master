'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Megaphone,
    Bell,
    Calendar,
    Pin,
    ArrowRight,
    Star,
    AlertCircle,
    Info,
    ChevronRight,
    X,
    Clock,
    User,
    Share2,
    Bookmark,
} from 'lucide-react'
import Link from 'next/link'

interface Announcement {
    id: string
    title: string
    content: string
    fullContent?: string
    type: 'general' | 'urgent' | 'event' | 'holiday'
    date: string
    author: string
    isPinned?: boolean
    isNew?: boolean
    attachments?: { name: string; type: string }[]
}

function AnnouncementDetailModal({
    announcement,
    onClose
}: {
    announcement: Announcement | null
    onClose: () => void
}) {
    if (!announcement) return null

    const typeStyles = {
        general: { bg: 'from-blue-500/10 to-indigo-500/10', border: 'border-blue-200 dark:border-blue-800', icon: Info, iconColor: 'text-blue-500', badgeClass: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400' },
        urgent: { bg: 'from-red-500/10 to-rose-500/10', border: 'border-red-200 dark:border-red-800', icon: AlertCircle, iconColor: 'text-red-500', badgeClass: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400' },
        event: { bg: 'from-violet-500/10 to-purple-500/10', border: 'border-violet-200 dark:border-violet-800', icon: Calendar, iconColor: 'text-violet-500', badgeClass: 'bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-400' },
        holiday: { bg: 'from-emerald-500/10 to-teal-500/10', border: 'border-emerald-200 dark:border-emerald-800', icon: Star, iconColor: 'text-emerald-500', badgeClass: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400' },
    }

    const style = typeStyles[announcement.type]
    const TypeIcon = style.icon

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden animate-slide-up" onClick={e => e.stopPropagation()}>
                {/* Header with gradient */}
                <div className={`relative p-6 bg-gradient-to-br ${style.bg}`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent dark:from-black/20" />
                    <div className="relative">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className={`w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 shadow-lg flex items-center justify-center`}>
                                    <TypeIcon className={`w-6 h-6 ${style.iconColor}`} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <Badge className={style.badgeClass}>
                                            {announcement.type.charAt(0).toUpperCase() + announcement.type.slice(1)}
                                        </Badge>
                                        {announcement.isNew && (
                                            <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400">
                                                New
                                            </Badge>
                                        )}
                                        {announcement.isPinned && (
                                            <Pin className="w-4 h-4 text-amber-500" />
                                        )}
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-xl hover:bg-black/10 transition-colors"
                            >
                                <X className="w-5 h-5 text-[var(--foreground-muted)]" />
                            </button>
                        </div>
                        <h2 className="font-display text-2xl font-semibold text-[var(--foreground)]">
                            {announcement.title}
                        </h2>
                    </div>
                </div>

                {/* Content */}
                <CardContent className="p-6 overflow-y-auto max-h-[50vh]">
                    {/* Meta info */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--foreground-muted)] mb-6 pb-4 border-b border-[var(--border)]">
                        <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            {announcement.author}
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {new Date(announcement.date).toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                        </div>
                    </div>

                    {/* Full content */}
                    <div className="prose prose-slate dark:prose-invert max-w-none">
                        <p className="text-[var(--foreground-secondary)] leading-relaxed whitespace-pre-line">
                            {announcement.fullContent || announcement.content}
                        </p>
                    </div>

                    {/* Attachments */}
                    {announcement.attachments && announcement.attachments.length > 0 && (
                        <div className="mt-6 pt-4 border-t border-[var(--border)]">
                            <h4 className="font-semibold text-[var(--foreground)] mb-3">Attachments</h4>
                            <div className="flex flex-wrap gap-2">
                                {announcement.attachments.map((file, i) => (
                                    <Button key={i} variant="secondary" size="sm" className="gap-2">
                                        📎 {file.name}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>

                {/* Footer actions */}
                <div className="p-4 border-t border-[var(--border)] bg-[var(--background-secondary)] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="gap-2">
                            <Bookmark className="w-4 h-4" />
                            Save
                        </Button>
                        <Button variant="ghost" size="sm" className="gap-2">
                            <Share2 className="w-4 h-4" />
                            Share
                        </Button>
                    </div>
                    <Button variant="secondary" size="sm" onClick={onClose}>
                        Close
                    </Button>
                </div>
            </Card>
        </div>
    )
}

function AnnouncementCard({ announcement, onClick }: { announcement: Announcement; onClick: () => void }) {
    const typeStyles = {
        general: { bg: 'from-blue-500/10 to-indigo-500/10', border: 'border-blue-200 dark:border-blue-800', icon: Info, iconColor: 'text-blue-500' },
        urgent: { bg: 'from-red-500/10 to-rose-500/10', border: 'border-red-200 dark:border-red-800', icon: AlertCircle, iconColor: 'text-red-500' },
        event: { bg: 'from-violet-500/10 to-purple-500/10', border: 'border-violet-200 dark:border-violet-800', icon: Calendar, iconColor: 'text-violet-500' },
        holiday: { bg: 'from-emerald-500/10 to-teal-500/10', border: 'border-emerald-200 dark:border-emerald-800', icon: Star, iconColor: 'text-emerald-500' },
    }

    const style = typeStyles[announcement.type]
    const TypeIcon = style.icon

    return (
        <Card
            className={`relative group hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer ${style.border} ${announcement.isPinned ? 'ring-2 ring-amber-300 dark:ring-amber-700' : ''}`}
            onClick={onClick}
        >
            <div className={`absolute inset-0 bg-gradient-to-br ${style.bg} opacity-30 pointer-events-none`} />
            <CardContent className="relative p-5">
                <div className="flex items-start gap-4">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${style.bg} flex items-center justify-center shrink-0`}>
                        <TypeIcon className={`w-5 h-5 ${style.iconColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                            {announcement.isPinned && (
                                <Pin className="w-4 h-4 text-amber-500" />
                            )}
                            <h3 className="font-semibold text-[var(--foreground)]">{announcement.title}</h3>
                            {announcement.isNew && (
                                <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400">
                                    New
                                </Badge>
                            )}
                            <Badge variant="outline" className="text-xs">
                                {announcement.type.charAt(0).toUpperCase() + announcement.type.slice(1)}
                            </Badge>
                        </div>
                        <p className="text-sm text-[var(--foreground-muted)] line-clamp-2 mb-3">
                            {announcement.content}
                        </p>
                        <div className="flex items-center justify-between text-xs text-[var(--foreground-muted)]">
                            <span>{announcement.author}</span>
                            <span>{new Date(announcement.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-[var(--foreground-muted)] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </div>
            </CardContent>
        </Card>
    )
}

export default function AnnouncementsPage() {
    const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null)

    const announcements: Announcement[] = [
        {
            id: '1',
            title: 'Republic Day Celebration',
            content: 'All teachers are requested to assemble at the main ground by 7:30 AM for the flag hoisting ceremony. Students will perform cultural activities.',
            fullContent: `Dear Faculty Members,

We are pleased to announce the Republic Day celebration schedule for this year.

📅 Date: 26th January 2026
⏰ Time: 7:30 AM onwards
📍 Venue: Main School Ground

Program Schedule:
• 7:30 AM - Assembly and Flag Hoisting
• 8:00 AM - National Anthem and Pledge
• 8:15 AM - Cultural Performances by Students
• 9:30 AM - Special Address by Chief Guest
• 10:00 AM - Distribution of Sweets

Important Instructions:
1. All teaching staff must report by 7:15 AM
2. Formal dress code is mandatory
3. Please ensure your assigned students are in proper uniform
4. House-wise seating arrangement to be followed

Looking forward to your active participation.

Regards,
Principal Office`,
            type: 'event',
            date: '2026-01-25',
            author: 'Principal Office',
            isPinned: true,
            isNew: true,
            attachments: [
                { name: 'Republic_Day_Schedule.pdf', type: 'pdf' },
                { name: 'Seating_Arrangement.pdf', type: 'pdf' },
            ],
        },
        {
            id: '2',
            title: 'Unit Test 2 Schedule Released',
            content: 'The schedule for Unit Test 2 has been finalized. Please check the examination section for detailed timetable. Ensure all syllabus is completed before the exams.',
            fullContent: `Dear Teachers,

The Unit Test 2 examination schedule has been finalized and is now available.

Examination Period: 10th - 18th February 2026

Key Points:
• Please complete your syllabus by 5th February
• Submit question papers by 3rd February
• Marks entry deadline: 25th February

Refer to the Examinations section for the detailed subject-wise timetable.

Best regards,
Examination Cell`,
            type: 'urgent',
            date: '2026-01-24',
            author: 'Examination Cell',
            isNew: true,
        },
        {
            id: '3',
            title: 'Staff Meeting - Monthly Review',
            content: 'Monthly staff meeting will be held on February 1st at 3:00 PM in the conference hall. Attendance is mandatory for all teaching staff.',
            type: 'general',
            date: '2026-01-22',
            author: 'Vice Principal',
        },
        {
            id: '4',
            title: 'Annual Day Event Preparations',
            content: 'Teachers interested in helping with Annual Day preparations are requested to submit their preferences by January 30th. Cultural committee meeting on Feb 5th.',
            type: 'event',
            date: '2026-01-20',
            author: 'Cultural Committee',
        },
        {
            id: '5',
            title: 'Holi Holiday Announcement',
            content: 'School will remain closed on March 13-14, 2026 for Holi celebrations. Classes will resume from March 15th. Happy Holi to all!',
            type: 'holiday',
            date: '2026-01-18',
            author: 'Administration',
        },
        {
            id: '6',
            title: 'New Library Books Available',
            content: 'The library has received a fresh collection of reference books for Mathematics and Science. Teachers can recommend these to students for additional reading.',
            type: 'general',
            date: '2026-01-15',
            author: 'Library',
        },
    ]

    const pinnedAnnouncements = announcements.filter(a => a.isPinned)
    const regularAnnouncements = announcements.filter(a => !a.isPinned)

    return (
        <div className="space-y-6 animate-slide-up">
            {/* Header */}
            <header>
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-2 h-2 rounded-full bg-indigo-500" />
                    <span className="text-xs font-medium tracking-widest uppercase text-[var(--foreground-muted)]">
                        Communication
                    </span>
                </div>
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                    <div>
                        <h1 className="font-display text-3xl font-semibold tracking-tight text-[var(--foreground)]">
                            Announcements
                        </h1>
                        <p className="mt-1 text-[var(--foreground-secondary)]">
                            Stay updated with school notices and events
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="secondary" size="sm" className="gap-2" asChild>
                            <Link href="/teacher/notifications">
                                <Bell className="w-4 h-4" />
                                Notification Settings
                            </Link>
                        </Button>
                    </div>
                </div>
            </header>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-blue-200/50 dark:border-blue-800/50">
                    <CardContent className="p-4 text-center">
                        <p className="font-display text-2xl font-semibold text-blue-600">{announcements.length}</p>
                        <p className="text-sm text-[var(--foreground-muted)]">Total</p>
                    </CardContent>
                </Card>
                <Card className="border-emerald-200/50 dark:border-emerald-800/50">
                    <CardContent className="p-4 text-center">
                        <p className="font-display text-2xl font-semibold text-emerald-600">{announcements.filter(a => a.isNew).length}</p>
                        <p className="text-sm text-[var(--foreground-muted)]">New</p>
                    </CardContent>
                </Card>
                <Card className="border-red-200/50 dark:border-red-800/50">
                    <CardContent className="p-4 text-center">
                        <p className="font-display text-2xl font-semibold text-red-600">{announcements.filter(a => a.type === 'urgent').length}</p>
                        <p className="text-sm text-[var(--foreground-muted)]">Urgent</p>
                    </CardContent>
                </Card>
                <Card className="border-violet-200/50 dark:border-violet-800/50">
                    <CardContent className="p-4 text-center">
                        <p className="font-display text-2xl font-semibold text-violet-600">{announcements.filter(a => a.type === 'event').length}</p>
                        <p className="text-sm text-[var(--foreground-muted)]">Events</p>
                    </CardContent>
                </Card>
            </div>

            {/* Pinned Announcements */}
            {pinnedAnnouncements.length > 0 && (
                <div>
                    <h2 className="font-display text-lg font-semibold text-[var(--foreground)] mb-4 flex items-center gap-2">
                        <Pin className="w-5 h-5 text-amber-500" />
                        Pinned
                    </h2>
                    <div className="space-y-4">
                        {pinnedAnnouncements.map(announcement => (
                            <AnnouncementCard
                                key={announcement.id}
                                announcement={announcement}
                                onClick={() => setSelectedAnnouncement(announcement)}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* All Announcements */}
            <div>
                <h2 className="font-display text-lg font-semibold text-[var(--foreground)] mb-4 flex items-center gap-2">
                    <Megaphone className="w-5 h-5 text-indigo-500" />
                    Recent Announcements
                </h2>
                <div className="space-y-4">
                    {regularAnnouncements.map(announcement => (
                        <AnnouncementCard
                            key={announcement.id}
                            announcement={announcement}
                            onClick={() => setSelectedAnnouncement(announcement)}
                        />
                    ))}
                </div>
            </div>

            {/* Detail Modal */}
            <AnnouncementDetailModal
                announcement={selectedAnnouncement}
                onClose={() => setSelectedAnnouncement(null)}
            />
        </div>
    )
}
