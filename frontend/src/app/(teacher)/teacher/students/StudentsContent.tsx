'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Users,
    Search,
    Filter,
    Phone,
    Mail,
    MessageSquare,
    ChevronDown,
    Eye,
    UserCircle,
    GraduationCap,
    TrendingUp,
    TrendingDown,
    MoreHorizontal,
    Download,
    X,
    Send,
    Copy,
    Check,
    Calendar,
    BookOpen,
    FileText,
    AlertTriangle,
    Clock,
} from 'lucide-react'
import { Student } from '../actions/types'

// Call Modal Component
function CallModal({ student, onClose }: { student: Student; onClose: () => void }) {
    const [copied, setCopied] = useState(false)

    const handleCopy = () => {
        navigator.clipboard.writeText(student.guardianPhone.replace(/\s/g, ''))
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <Card className="w-full max-w-sm animate-slide-up" onClick={e => e.stopPropagation()}>
                <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                        <Phone className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-display text-lg font-semibold text-[var(--foreground)] mb-1">
                        Call Guardian
                    </h3>
                    <p className="text-sm text-[var(--foreground-muted)] mb-4">
                        {student.guardianName} (Guardian of {student.name})
                    </p>
                    <div className="flex items-center justify-center gap-2 mb-6">
                        <span className="font-mono text-2xl font-semibold text-[var(--foreground)]">
                            {student.guardianPhone}
                        </span>
                        <button
                            onClick={handleCopy}
                            className="p-2 rounded-lg hover:bg-[var(--background-secondary)] transition-colors"
                            title="Copy number"
                        >
                            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-[var(--foreground-muted)]" />}
                        </button>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="secondary" className="flex-1" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button
                            className="flex-1 gap-2 bg-emerald-500 hover:bg-emerald-600 text-white"
                            onClick={() => window.open(`tel:${student.guardianPhone.replace(/\s/g, '')}`)}
                        >
                            <Phone className="w-4 h-4" />
                            Call Now
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

// Email Modal Component
function EmailModal({ student, onClose }: { student: Student; onClose: () => void }) {
    const [subject, setSubject] = useState('')
    const [message, setMessage] = useState('')

    const handleSend = () => {
        window.open(`mailto:${student.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`)
        onClose()
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <Card className="w-full max-w-lg animate-slide-up" onClick={e => e.stopPropagation()}>
                <CardHeader className="border-b border-[var(--border)]">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                                <Mail className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <CardTitle className="font-display text-lg">Send Email</CardTitle>
                                <p className="text-sm text-[var(--foreground-muted)]">To: {student.email}</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
                    </div>
                </CardHeader>
                <CardContent className="p-5 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">Subject</label>
                        <input
                            type="text"
                            value={subject}
                            onChange={e => setSubject(e.target.value)}
                            placeholder="Regarding your ward's performance..."
                            className="w-full px-4 py-3 bg-[var(--background-secondary)] rounded-xl text-sm text-[var(--foreground)] border border-transparent hover:border-[var(--border)] focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">Message</label>
                        <textarea
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                            rows={5}
                            placeholder="Dear Parent/Guardian..."
                            className="w-full px-4 py-3 bg-[var(--background-secondary)] rounded-xl text-sm text-[var(--foreground)] border border-transparent hover:border-[var(--border)] focus:outline-none focus:border-blue-500 resize-none"
                        />
                    </div>
                    <div className="flex gap-3 pt-2">
                        <Button variant="secondary" className="flex-1" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button
                            className="flex-1 gap-2 bg-blue-500 hover:bg-blue-600 text-white"
                            onClick={handleSend}
                        >
                            <Send className="w-4 h-4" />
                            Open in Email
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

// Message Modal Component
function MessageModal({ student, onClose }: { student: Student; onClose: () => void }) {
    const [message, setMessage] = useState('')
    const [sent, setSent] = useState(false)

    const handleSend = () => {
        setSent(true)
        setTimeout(() => {
            onClose()
        }, 1500)
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <Card className="w-full max-w-lg animate-slide-up" onClick={e => e.stopPropagation()}>
                <CardHeader className="border-b border-[var(--border)]">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                                <MessageSquare className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <CardTitle className="font-display text-lg">Send Message</CardTitle>
                                <p className="text-sm text-[var(--foreground-muted)]">To: {student.guardianName}</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
                    </div>
                </CardHeader>
                <CardContent className="p-5">
                    {sent ? (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                                <Check className="w-8 h-8 text-emerald-600" />
                            </div>
                            <h3 className="font-semibold text-[var(--foreground)]">Message Sent!</h3>
                            <p className="text-sm text-[var(--foreground-muted)]">
                                Your message has been sent to {student.guardianName}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                                {['Attendance Alert', 'Meeting Request', 'Performance Update'].map(template => (
                                    <button
                                        key={template}
                                        onClick={() => setMessage(`Dear ${student.guardianName},\n\nThis is regarding ${template.toLowerCase()} for ${student.name}.\n\nPlease contact the school for more details.\n\nBest regards,\nMathematics Faculty`)}
                                        className="px-3 py-1.5 text-xs font-medium rounded-full bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400 hover:bg-violet-200 transition-colors shrink-0"
                                    >
                                        {template}
                                    </button>
                                ))}
                            </div>
                            <textarea
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                                rows={6}
                                placeholder="Type your message here..."
                                className="w-full px-4 py-3 bg-[var(--background-secondary)] rounded-xl text-sm text-[var(--foreground)] border border-transparent hover:border-[var(--border)] focus:outline-none focus:border-violet-500 resize-none"
                            />
                            <div className="flex items-center gap-2 text-xs text-[var(--foreground-muted)]">
                                <MessageSquare className="w-3 h-3" />
                                Message will be sent via SMS and App notification
                            </div>
                            <div className="flex gap-3">
                                <Button variant="secondary" className="flex-1" onClick={onClose}>
                                    Cancel
                                </Button>
                                <Button
                                    className="flex-1 gap-2 bg-violet-500 hover:bg-violet-600 text-white"
                                    onClick={handleSend}
                                    disabled={!message.trim()}
                                >
                                    <Send className="w-4 h-4" />
                                    Send Message
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

// Profile Modal Component
function ProfileModal({ student, onClose }: { student: Student; onClose: () => void }) {
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <Card className="w-full max-w-2xl animate-slide-up max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <CardHeader className="border-b border-[var(--border)]">
                    <div className="flex items-center justify-between">
                        <CardTitle className="font-display text-lg">Student Profile</CardTitle>
                        <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    {/* Profile Header */}
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-6 pb-6 border-b border-[var(--border)]">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg shrink-0">
                            {student.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex-1 text-center sm:text-left">
                            <h2 className="font-display text-2xl font-semibold text-[var(--foreground)]">{student.name}</h2>
                            <p className="text-[var(--foreground-muted)]">{student.class}-{student.section} • Roll #{student.rollNo}</p>
                            <div className="flex justify-center sm:justify-start gap-2 mt-2">
                                <Badge className={student.status === 'present' ? 'bg-emerald-100 text-emerald-700' : student.status === 'absent' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}>
                                    {student.status === 'present' ? 'Present Today' : student.status === 'absent' ? 'Absent Today' : 'On Leave'}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                        <div className="text-center p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20">
                            <p className="font-display text-2xl font-bold text-emerald-600">{student.attendance}%</p>
                            <p className="text-xs text-emerald-600/70">Attendance</p>
                        </div>
                        <div className="text-center p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20">
                            <p className="font-display text-2xl font-bold text-blue-600">{student.lastExamScore}/100</p>
                            <p className="text-xs text-blue-600/70">Last Exam</p>
                        </div>
                        <div className="text-center p-4 rounded-xl bg-violet-50 dark:bg-violet-900/20">
                            <p className="font-display text-2xl font-bold text-violet-600">A+</p>
                            <p className="text-xs text-violet-600/70">Grade</p>
                        </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="space-y-3">
                            <h3 className="text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">Personal Info</h3>
                            <div className="space-y-2">
                                <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--background-secondary)]">
                                    <Calendar className="w-4 h-4 text-[var(--foreground-muted)]" />
                                    <div>
                                        <p className="text-xs text-[var(--foreground-muted)]">Date of Birth</p>
                                        <p className="text-sm font-medium text-[var(--foreground)]">{student.dob || 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--background-secondary)]">
                                    <AlertTriangle className="w-4 h-4 text-[var(--foreground-muted)]" />
                                    <div>
                                        <p className="text-xs text-[var(--foreground-muted)]">Blood Group</p>
                                        <p className="text-sm font-medium text-[var(--foreground)]">{student.bloodGroup || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <h3 className="text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">Guardian Info</h3>
                            <div className="space-y-2">
                                <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--background-secondary)]">
                                    <UserCircle className="w-4 h-4 text-[var(--foreground-muted)]" />
                                    <div>
                                        <p className="text-xs text-[var(--foreground-muted)]">Guardian Name</p>
                                        <p className="text-sm font-medium text-[var(--foreground)]">{student.guardianName}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--background-secondary)]">
                                    <Phone className="w-4 h-4 text-[var(--foreground-muted)]" />
                                    <div>
                                        <p className="text-xs text-[var(--foreground-muted)]">Phone</p>
                                        <p className="text-sm font-medium text-[var(--foreground)]">{student.guardianPhone}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div>
                        <h3 className="text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider mb-3">Recent Activity</h3>
                        <div className="space-y-2">
                            <div className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border)]">
                                <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                                    <Check className="w-4 h-4 text-emerald-600" />
                                </div>
                                <div className="flex-1 text-left">
                                    <p className="text-sm font-medium text-[var(--foreground)]">Marked Present</p>
                                    <p className="text-xs text-[var(--foreground-muted)]">Today, 8:45 AM</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border)]">
                                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                    <FileText className="w-4 h-4 text-blue-600" />
                                </div>
                                <div className="flex-1 text-left">
                                    <p className="text-sm font-medium text-[var(--foreground)]">Submitted Assignment - Algebra</p>
                                    <p className="text-xs text-[var(--foreground-muted)]">Yesterday, 3:30 PM</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border)]">
                                <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                                    <BookOpen className="w-4 h-4 text-amber-600" />
                                </div>
                                <div className="flex-1 text-left">
                                    <p className="text-sm font-medium text-[var(--foreground)]">Unit Test 2 Score: {student.lastExamScore}/100</p>
                                    <p className="text-xs text-[var(--foreground-muted)]">3 days ago</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

// More Options Menu Component
function MoreOptionsMenu({ student, onClose, onAction }: {
    student: Student
    onClose: () => void
    onAction: (action: string) => void
}) {
    const options = [
        { id: 'attendance', label: 'View Attendance History', icon: Calendar },
        { id: 'marks', label: 'View All Marks', icon: FileText },
        { id: 'report', label: 'Generate Report Card', icon: Download },
        { id: 'notify', label: 'Send Notification', icon: MessageSquare },
    ]

    return (
        <>
            <div className="fixed inset-0 z-40" onClick={onClose} />
            <div className="absolute right-0 top-full mt-1 w-56 bg-[var(--card-background)] rounded-xl shadow-2xl border border-[var(--border)] z-50 overflow-hidden animate-slide-up">
                <div className="p-2">
                    {options.map(option => (
                        <button
                            key={option.id}
                            onClick={() => onAction(option.id)}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[var(--background-secondary)] transition-colors text-left"
                        >
                            <option.icon className="w-4 h-4 text-[var(--foreground-muted)]" />
                            <span className="text-sm text-[var(--foreground)]">{option.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </>
    )
}

// Student Row Component
function StudentRow({
    student,
    onCall,
    onEmail,
    onMessage,
    onViewProfile
}: {
    student: Student
    onCall: () => void
    onEmail: () => void
    onMessage: () => void
    onViewProfile: () => void
}) {
    const [showMoreMenu, setShowMoreMenu] = useState(false)

    return (
        <div className="group relative flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-[var(--card-background)] border border-[var(--border)] rounded-xl hover:border-emerald-300 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center gap-4 flex-1 min-w-0">
                {/* Avatar */}
                <div
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-semibold shadow-md cursor-pointer hover:scale-105 transition-transform shrink-0"
                    onClick={onViewProfile}
                >
                    {student.name.split(' ').map(n => n[0]).join('')}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 cursor-pointer text-left" onClick={onViewProfile}>
                    <div className="flex items-center gap-2 mb-0.5">
                        <h4 className="font-semibold text-[var(--foreground)] truncate hover:text-emerald-600 transition-colors">{student.name}</h4>
                        <Badge variant="outline" className="text-xs font-mono">
                            Roll #{student.rollNo}
                        </Badge>
                    </div>
                    <p className="text-sm text-[var(--foreground-muted)] truncate">
                        {student.class}-{student.section} • Guardian: {student.guardianName}
                    </p>
                </div>

                {/* Attendance */}
                <div className="hidden md:flex flex-col items-center px-4">
                    <div className={`flex items-center gap-1 font-semibold ${student.attendance >= 90 ? 'text-emerald-600' : student.attendance >= 75 ? 'text-amber-600' : 'text-red-600'
                        }`}>
                        {student.attendance >= 90 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        {student.attendance}%
                    </div>
                    <p className="text-xs text-[var(--foreground-muted)]">Attendance</p>
                </div>

                {/* Last Score */}
                <div className="hidden lg:flex flex-col items-center px-4">
                    <p className="font-semibold text-[var(--foreground)]">{student.lastExamScore}/100</p>
                    <p className="text-xs text-[var(--foreground-muted)]">Last Exam</p>
                </div>
            </div>

            {/* Contact Buttons */}
            <div className="flex items-center gap-1 sm:ml-auto pt-3 sm:pt-0 border-t sm:border-0 border-[var(--border)]">
                <Button
                    variant="ghost"
                    size="icon"
                    className="flex-1 sm:flex-none h-10 sm:h-9 rounded-xl hover:bg-emerald-100 dark:hover:bg-emerald-900/30"
                    title={`Call ${student.guardianPhone}`}
                    onClick={onCall}
                >
                    <Phone className="w-4 h-4 text-emerald-600" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="flex-1 sm:flex-none h-10 sm:h-9 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/30"
                    title={`Email ${student.email}`}
                    onClick={onEmail}
                >
                    <Mail className="w-4 h-4 text-blue-600" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="flex-1 sm:flex-none h-10 sm:h-9 rounded-xl hover:bg-violet-100 dark:hover:bg-violet-900/30"
                    title="Send Message"
                    onClick={onMessage}
                >
                    <MessageSquare className="w-4 h-4 text-violet-600" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="hidden sm:inline-flex h-9 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
                    title="View Profile"
                    onClick={onViewProfile}
                >
                    <Eye className="w-4 h-4 text-[var(--foreground-muted)]" />
                </Button>
                <div className="relative flex-1 sm:flex-none">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="w-full sm:w-10 h-10 sm:h-9 rounded-xl"
                        title="More Options"
                        onClick={() => setShowMoreMenu(!showMoreMenu)}
                    >
                        <MoreHorizontal className="w-4 h-4 text-[var(--foreground-muted)]" />
                    </Button>
                    {showMoreMenu && (
                        <MoreOptionsMenu
                            student={student}
                            onClose={() => setShowMoreMenu(false)}
                            onAction={(action) => {
                                console.log(`Action: ${action} for ${student.name}`)
                                setShowMoreMenu(false)
                            }}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

export default function StudentsContent({ initialStudents }: { initialStudents: Student[] }) {
    const [selectedClass, setSelectedClass] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')
    const [activeModal, setActiveModal] = useState<{ type: string; student: Student } | null>(null)
    const [students, setStudents] = useState<Student[]>(initialStudents)

    const filteredStudents = students.filter(student => {
        const matchesClass = selectedClass === 'all' || `${student.class}-${student.section}` === selectedClass
        const matchesSearch =
            student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.rollNo.toString().includes(searchQuery) ||
            student.guardianName.toLowerCase().includes(searchQuery.toLowerCase())

        return matchesClass && matchesSearch
    })

    const classes = ['Class 10-A', 'Class 10-B', 'Class 9-A', 'Class 9-B']

    const closeModal = () => setActiveModal(null)

    return (
        <div className="space-y-6 animate-slide-up">
            {/* Header */}
            <header>
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <span className="text-xs font-medium tracking-widest uppercase text-[var(--foreground-muted)]">
                        Teaching
                    </span>
                </div>
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                    <div>
                        <h1 className="font-display text-3xl font-semibold tracking-tight text-[var(--foreground)]">
                            My Students
                        </h1>
                        <p className="mt-1 text-[var(--foreground-secondary)]">
                            View and manage students in your assigned classes
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="secondary" size="sm" className="gap-2">
                            <Download className="w-4 h-4" />
                            Export
                        </Button>
                    </div>
                </div>
            </header>

            {/* Filters & Search */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                        {/* Search */}
                        <div className="flex items-center gap-2 px-4 py-2.5 bg-[var(--background-secondary)] rounded-xl flex-1 border border-transparent hover:border-[var(--border)] transition-colors">
                            <Search className="w-4 h-4 text-[var(--foreground-muted)]" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search students..."
                                className="flex-1 bg-transparent text-sm text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] outline-none"
                            />
                        </div>

                        {/* Class Filter */}
                        <div className="relative">
                            <select
                                value={selectedClass}
                                onChange={(e) => setSelectedClass(e.target.value)}
                                className="appearance-none px-4 py-2.5 pr-10 bg-[var(--background-secondary)] rounded-xl text-sm font-medium text-[var(--foreground)] border border-transparent hover:border-[var(--border)] focus:outline-none focus:border-emerald-500 cursor-pointer w-full md:w-auto"
                            >
                                <option value="all">All Classes</option>
                                {classes.map(cls => (
                                    <option key={cls} value={cls}>{cls}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--foreground-muted)] pointer-events-none" />
                        </div>

                        <Button variant="secondary" size="sm" className="gap-2 justify-center">
                            <Filter className="w-4 h-4" />
                            More Filters
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-blue-200/50 dark:border-blue-800/50">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 flex items-center justify-center shrink-0">
                            <Users className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="font-display text-2xl font-semibold text-[var(--foreground)]">{filteredStudents.length}</p>
                            <p className="text-sm text-[var(--foreground-muted)]">Students</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-emerald-200/50 dark:border-emerald-800/50">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 flex items-center justify-center shrink-0">
                            <UserCircle className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div>
                            <p className="font-display text-2xl font-semibold text-emerald-600">{filteredStudents.filter(s => s.status === 'present').length}</p>
                            <p className="text-sm text-[var(--foreground-muted)]">Present Today</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-amber-200/50 dark:border-amber-800/50">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 flex items-center justify-center shrink-0">
                            <TrendingUp className="w-6 h-6 text-amber-600" />
                        </div>
                        <div>
                            <p className="font-display text-2xl font-semibold text-amber-600">
                                {filteredStudents.length > 0 ? Math.round(filteredStudents.reduce((acc, s) => acc + s.attendance, 0) / filteredStudents.length) : 0}%
                            </p>
                            <p className="text-sm text-[var(--foreground-muted)]">Avg Attendance</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-violet-200/50 dark:border-violet-800/50">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 flex items-center justify-center shrink-0">
                            <GraduationCap className="w-6 h-6 text-violet-600" />
                        </div>
                        <div>
                            <p className="font-display text-2xl font-semibold text-violet-600">
                                {filteredStudents.length > 0 ? Math.round(filteredStudents.reduce((acc, s) => acc + s.lastExamScore, 0) / filteredStudents.length) : 0}
                            </p>
                            <p className="text-sm text-[var(--foreground-muted)]">Avg Score</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Students List */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <h2 className="font-display text-lg font-semibold text-[var(--foreground)]">
                        Student Directory
                    </h2>
                    <p className="text-sm text-[var(--foreground-muted)]">
                        Showing {filteredStudents.length} students
                    </p>
                </div>

                <div className="space-y-2">
                    {filteredStudents.length > 0 ? (
                        filteredStudents.map(student => (
                            <StudentRow
                                key={student.id}
                                student={student}
                                onCall={() => setActiveModal({ type: 'call', student })}
                                onEmail={() => setActiveModal({ type: 'email', student })}
                                onMessage={() => setActiveModal({ type: 'message', student })}
                                onViewProfile={() => setActiveModal({ type: 'profile', student })}
                            />
                        ))
                    ) : (
                        <div className="text-center py-12 bg-[var(--background-secondary)] rounded-2xl border border-dashed border-[var(--border)]">
                            <Search className="w-12 h-12 text-[var(--foreground-muted)] mx-auto mb-3" />
                            <p className="text-[var(--foreground)] font-medium">No students found</p>
                            <p className="text-sm text-[var(--foreground-muted)]">Try adjusting your search or filters</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            {activeModal?.type === 'call' && (
                <CallModal student={activeModal.student} onClose={closeModal} />
            )}
            {activeModal?.type === 'email' && (
                <EmailModal student={activeModal.student} onClose={closeModal} />
            )}
            {activeModal?.type === 'message' && (
                <MessageModal student={activeModal.student} onClose={closeModal} />
            )}
            {activeModal?.type === 'profile' && (
                <ProfileModal student={activeModal.student} onClose={closeModal} />
            )}
        </div>
    )
}
