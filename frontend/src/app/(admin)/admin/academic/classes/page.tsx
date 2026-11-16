'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getClasses, createClass, createSection, ClassItem, Section } from '@/app/(admin)/_actions/academic'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
    Plus,
    Building2,
    Users,
    ChevronRight,
    MoreVertical,
    Edit2,
    Trash2,
    GraduationCap,
    Layers,
    ArrowUpRight,
    Search,
    Filter
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function ClassesSectionsPage() {
    const [classes, setClasses] = useState<ClassItem[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [newClassName, setNewClassName] = useState('')
    const [newClassShort, setNewClassShort] = useState('')
    const [isAddingClass, setIsAddingClass] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        loadClasses()
    }, [])

    const loadClasses = async () => {
        setIsLoading(true)
        const res = await getClasses()
        if (res.success && res.data) {
            setClasses(res.data)
        } else {
            toast.error("Failed to load classes")
        }
        setIsLoading(false)
    }

    const filteredClasses = classes.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.sections?.some(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
    )

    const getTotalStudents = (cls: ClassItem) => cls.sections && cls.sections.length > 0 ? cls.sections.reduce((acc, s) => acc + s.enrolled, 0) : 0
    const getTotalCapacity = (cls: ClassItem) => cls.sections && cls.sections.length > 0 ? cls.sections.reduce((acc, s) => acc + s.capacity, 0) : 0

    const handleAddClass = async () => {
        if (!newClassName) {
            toast.error('Missing details', { description: 'Please provide a class name.' })
            return
        }

        setIsSubmitting(true)
        const payload = {
            name: newClassName,
            numeric_value: parseInt(newClassShort) || 1, // Fallback logic
            capacity: 40 // Default for now
        }

        const res = await createClass(payload)
        setIsSubmitting(false)

        if (res.success && res.data) {
            setClasses([...classes, res.data])
            setNewClassName('')
            setNewClassShort('')
            setIsAddingClass(false)
            toast.success('Grade Level Created', { description: `${newClassName} has been added to the system.` })
        } else {
            toast.error("Failed to add class", { description: res.message })
        }
    }

    const handleAddSection = async (classId: number) => {
        const cls = classes.find(c => c.id === classId)
        if (!cls) return

        const nextLetter = String.fromCharCode(65 + (cls.sections?.length || 0)) // A, B, C...

        const payload = {
            class_id: classId,
            name: nextLetter,
            capacity: 40
        }

        const res = await createSection(payload)
        if (res.success && res.data) {
            setClasses(prev => prev.map(c => {
                if (c.id === classId) {
                    return { ...c, sections: [...(c.sections || []), res.data!] }
                }
                return c
            }))
            toast.success(`Section ${nextLetter} Added`, { description: `New section established for ${cls.name}` })
        } else {
            toast.error("Failed to add section", { description: res.message })
        }
    }

    if (isLoading) {
        return <div className="py-20 flex justify-center text-[var(--foreground-muted)] font-bold uppercase tracking-widest">Loading Academic Hierarchy...</div>
    }

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Link href="/admin/dashboard" className="text-sm font-medium text-[var(--foreground-secondary)] hover:text-indigo-600 transition-colors">Dashboard</Link>
                        <ChevronRight className="w-4 h-4 text-[var(--foreground-muted)]" />
                        <span className="text-sm font-bold text-indigo-600">Classes & Sections</span>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">Academic Hierarchy</h1>
                    <p className="text-[var(--foreground-secondary)] mt-1">Configure grade levels and manage classroom distributions.</p>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" className="rounded-2xl border-[var(--border)] h-12 px-5 font-bold bg-[var(--card-background)]">
                        <Filter className="w-4 h-4 mr-2" />
                        Filter
                    </Button>

                    <Dialog open={isAddingClass} onOpenChange={setIsAddingClass}>
                        <DialogTrigger asChild>
                            <Button className="gap-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 px-6 h-12 font-bold transform hover:scale-105 transition-all text-white border-none">
                                <Plus className="w-5 h-5" />
                                Add New Class
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] rounded-[2rem] border-[var(--border)] bg-[var(--card-background)] p-8 shadow-2xl">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-black text-[var(--foreground)]">New Grade Level</DialogTitle>
                                <DialogDescription className="font-medium text-[var(--foreground-secondary)]">Define a new academic tier for your institution.</DialogDescription>
                            </DialogHeader>
                            <div className="py-6 space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)] ml-1">Full Class Name</label>
                                    <Input
                                        placeholder="e.g. Class 12 - Commerce"
                                        value={newClassName}
                                        onChange={(e) => setNewClassName(e.target.value)}
                                        className="h-12 rounded-2xl bg-[var(--background-secondary)] border-[var(--border)] font-bold text-[var(--foreground)]"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)] ml-1">Short Code / Tag</label>
                                    <Input
                                        placeholder="e.g. 12-COM"
                                        value={newClassShort}
                                        onChange={(e) => setNewClassShort(e.target.value)}
                                        className="h-12 rounded-2xl bg-[var(--background-secondary)] border-[var(--border)] font-bold uppercase text-[var(--foreground)]"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)] ml-1">Academic Stream</label>
                                    <Select defaultValue="general">
                                        <SelectTrigger className="h-12 rounded-2xl bg-[var(--background-secondary)] border-[var(--border)] font-bold text-[var(--foreground)]">
                                            <SelectValue placeholder="Select stream" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-2xl border-[var(--border)] bg-[var(--card-background)] shadow-xl">
                                            <SelectItem value="general" className="rounded-xl font-bold">General Education</SelectItem>
                                            <SelectItem value="science" className="rounded-xl font-bold">Science & Tech</SelectItem>
                                            <SelectItem value="commerce" className="rounded-xl font-bold">Commerce & Accounts</SelectItem>
                                            <SelectItem value="arts" className="rounded-xl font-bold">Humanities / Arts</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                    onClick={handleAddClass}
                                    disabled={isSubmitting}
                                    className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-600/20 text-white disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Processing...' : 'Establish Class'}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Search Hub */}
            <div className="relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--foreground-muted)] group-focus-within:text-indigo-500 transition-colors" />
                <Input
                    placeholder="Search classes or sections (e.g. 'Class 10' or 'Section A')..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-16 pl-14 pr-6 rounded-[2rem] border-[var(--border)] bg-[var(--card-background)] shadow-xl shadow-slate-200/50 dark:shadow-none text-base font-semibold focus:ring-indigo-500/20 transition-all text-[var(--foreground)]"
                />
            </div>

            {/* Quick Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Primary Classes', value: '12', icon: Building2, color: 'text-indigo-600', bg: 'bg-indigo-500/10' },
                    { label: 'Total Sections', value: '38', icon: Layers, color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
                    { label: 'Global Capacity', value: '1,500', icon: Users, color: 'text-blue-600', bg: 'bg-blue-500/10' },
                ].map((stat, i) => (
                    <div key={i} className="p-6 rounded-[2rem] bg-[var(--card-background)] border border-[var(--border)] flex items-center gap-5 shadow-sm hover:shadow-md transition-shadow">
                        <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-transform", stat.bg, stat.color)}>
                            <stat.icon className="w-7 h-7" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)] leading-none mb-1">{stat.label}</p>
                            <p className="text-2xl font-bold text-[var(--foreground)] leading-none">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Class Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-8">
                {filteredClasses.map((cls) => {
                    const totalStudents = getTotalStudents(cls)
                    const totalCapacity = getTotalCapacity(cls)
                    const enrolledPercent = totalCapacity > 0 ? (totalStudents / totalCapacity) * 100 : 0
                    return (
                        <Card key={cls.id} className="border-none bg-[var(--card-background)] rounded-[2.5rem] overflow-hidden shadow-xl shadow-slate-200/40 dark:shadow-none group relative">
                            <CardHeader className="p-8 pb-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-5">
                                        <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-indigo-500/20 transform group-hover:rotate-6 transition-transform">
                                            {cls.shortName}
                                        </div>
                                        <div>
                                            <CardTitle className="text-2xl font-bold text-[var(--foreground)]">{cls.name}</CardTitle>
                                            <div className="text-sm text-[var(--foreground-secondary)] flex items-center gap-2 mt-1">
                                                <Badge variant="outline" className="rounded-lg bg-indigo-500/10 text-indigo-600 border-indigo-500/20 font-bold px-2 py-0.5">
                                                    {(cls.sections || []).length} Sections
                                                </Badge>
                                                <span className="text-sm font-semibold text-[var(--foreground-muted)]">•</span>
                                                <span className="text-sm font-semibold text-[var(--foreground-secondary)]">{totalStudents} Students Total</span>
                                            </div>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" className="rounded-xl h-10 w-10 text-[var(--foreground-muted)] hover:text-indigo-600 hover:bg-[var(--background-secondary)] transition-colors">
                                        <MoreVertical className="w-5 h-5" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-8 pt-4 space-y-6">
                                {/* Fill Rate Indicator */}
                                <div className="space-y-2">
                                    <div className="flex justify-between items-end">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)]">Total Enrollment Status</span>
                                        <span className="text-xs font-black text-indigo-600 uppercase tracking-tighter">{Math.round(enrolledPercent)}% FULL</span>
                                    </div>
                                    <div className="h-2 w-full bg-[var(--background-secondary)] rounded-full overflow-hidden">
                                        <div
                                            className={cn(
                                                "h-full rounded-full transition-all duration-1000",
                                                enrolledPercent > 90 ? 'bg-amber-500' : 'bg-indigo-500'
                                            )}
                                            style={{ width: `${enrolledPercent}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Sections Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {(cls.sections || []).map((section) => {
                                        const sectionFill = section.capacity > 0 ? (section.enrolled / section.capacity) * 100 : 0
                                        const isFull = section.capacity > 0 && section.enrolled >= section.capacity
                                        return (
                                            <div key={section.id} className="p-5 rounded-[1.5rem] bg-[var(--background-secondary)]/50 border border-[var(--border)] hover:bg-[var(--background-secondary)] hover:border-indigo-300 transition-all group/sec relative overflow-hidden">
                                                <div className="flex items-center justify-between mb-3 relative z-10">
                                                    <div className="flex items-center gap-3">
                                                        <div className={cn(
                                                            "w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black shadow-sm transition-colors",
                                                            isFull ? "bg-amber-500 text-white shadow-amber-500/20" : "bg-[var(--card-background)] text-indigo-600 shadow-indigo-500/5"
                                                        )}>
                                                            {section.name}
                                                        </div>
                                                        <span className="text-sm font-bold text-[var(--foreground)] tracking-tight">Section {section.name}</span>
                                                    </div>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg opacity-0 group-hover/sec:opacity-100 transition-opacity">
                                                        <Edit2 className="w-3.5 h-3.5" />
                                                    </Button>
                                                </div>

                                                <div className="space-y-2 relative z-10">
                                                    <div className="flex justify-between text-[10px] font-bold text-[var(--foreground-muted)] uppercase tracking-wider">
                                                        <span>{section.enrolled} / {section.capacity} Seats</span>
                                                        <span>{Math.round(sectionFill)}%</span>
                                                    </div>
                                                    <Progress value={sectionFill} className={cn("h-1.5", isFull ? "bg-amber-100" : "bg-[var(--background-tertiary)]")} />
                                                </div>

                                                {isFull && (
                                                    <div className="absolute top-2 right-2 flex items-center gap-1 text-[8px] font-black bg-amber-500 text-white px-2 py-0.5 rounded-full uppercase tracking-widest animate-pulse">
                                                        Full
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    })}

                                    {/* Add Section Button */}
                                    <button
                                        onClick={() => handleAddSection(cls.id)}
                                        className="p-5 rounded-[1.5rem] border-2 border-dashed border-[var(--border)] hover:border-indigo-300 hover:bg-indigo-500/10 transition-all flex flex-col items-center justify-center gap-2 group/add min-h-[110px]"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-[var(--background-secondary)] flex items-center justify-center text-[var(--foreground-muted)] group-hover/add:bg-indigo-600 group-hover/add:text-white transition-all">
                                            <Plus className="w-5 h-5" />
                                        </div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)] group-hover/add:text-indigo-600 leading-none">Quick Add</p>
                                    </button>
                                </div>
                            </CardContent>

                            {/* Card Footer Actions */}
                            <div className="px-8 py-5 bg-[var(--background-secondary)]/50 border-t border-[var(--border)] flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <button className="flex items-center gap-1.5 text-xs font-bold text-[var(--foreground-secondary)] hover:text-indigo-600 transition-colors">
                                        <Users className="w-3.5 h-3.5" />
                                        Assign Teachers
                                    </button>
                                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--border)]" />
                                    <button className="flex items-center gap-1.5 text-xs font-bold text-[var(--foreground-secondary)] hover:text-indigo-600 transition-colors">
                                        <Layers className="w-3.5 h-3.5" />
                                        Manage Subjects
                                    </button>
                                </div>
                                <Button variant="ghost" size="sm" className="text-xs font-bold text-indigo-600 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 h-8 rounded-lg px-3">
                                    Detailed View
                                    <ArrowUpRight className="w-3.5 h-3.5 ml-1.5" />
                                </Button>
                            </div>
                        </Card>
                    )
                })}
            </div>

            {/* Empty State Illustration Placeholder */}
            {
                filteredClasses.length === 0 && (
                    <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
                        <div className="w-24 h-24 bg-[var(--background-secondary)] rounded-full flex items-center justify-center text-[var(--foreground-muted)]">
                            <GraduationCap className="w-12 h-12" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-[var(--foreground)]">No classes found</h3>
                            <p className="text-[var(--foreground-secondary)] text-sm">Try adjusting your search or add a new grade level.</p>
                        </div>
                        <Button className="rounded-2xl bg-indigo-600 shadow-xl shadow-indigo-600/20 px-8 font-bold">
                            Add First Class
                        </Button>
                    </div>
                )
            }
        </div >
    )
}
