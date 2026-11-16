'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
    Plus,
    BookOpen,
    ChevronRight,
    Search,
    Edit2,
    Trash2,
    CheckCircle2,
    Settings2,
    BookMarked,
    Code,
    Languages,
    Microscope,
    History as HistoryIcon
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from "@/components/ui/tabs"
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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

interface Subject {
    id: number
    name: string
    code: string
    type: 'core' | 'elective' | 'language' | 'practical'
    classes: string[]
}

const initialSubjects: Subject[] = [
    { id: 1, name: 'Mathematics', code: 'MATH', type: 'core', classes: ['Class 8', 'Class 9', 'Class 10'] },
    { id: 2, name: 'Science', code: 'SCI', type: 'core', classes: ['Class 8', 'Class 9', 'Class 10'] },
    { id: 3, name: 'English Literature', code: 'ENG-LIT', type: 'language', classes: ['Class 8', 'Class 9', 'Class 10'] },
    { id: 4, name: 'Hindi', code: 'HIN', type: 'language', classes: ['Class 8', 'Class 9'] },
    { id: 5, name: 'Computer Applications', code: 'COMP', type: 'practical', classes: ['Class 10'] },
    { id: 6, name: 'Advanced Physics', code: 'PHYS-ADV', type: 'core', classes: ['Class 11-SCI'] },
]

export default function SubjectMappingPage() {
    const [subjects, setSubjects] = useState<Subject[]>(initialSubjects)
    const [activeTab, setActiveTab] = useState('master')
    const [isCreatingSubject, setIsCreatingSubject] = useState(false)
    const [newSubjectName, setNewSubjectName] = useState('')
    const [newSubjectCode, setNewSubjectCode] = useState('')
    const [newSubjectType, setNewSubjectType] = useState('core')

    const gradeLevels = ['Class 8', 'Class 9', 'Class 10', 'Class 11-SCI', 'Class 12-SCI']

    const handleCreateSubject = () => {
        if (!newSubjectName || !newSubjectCode) {
            toast.error('Missing details')
            return
        }

        const newSubject: Subject = {
            id: subjects.length + 1,
            name: newSubjectName,
            code: newSubjectCode,
            type: newSubjectType as any,
            classes: []
        }

        setSubjects([...subjects, newSubject])
        setNewSubjectName('')
        setNewSubjectCode('')
        setIsCreatingSubject(false)
        toast.success('Subject Created', { description: `${newSubjectName} is now available in the master list.` })
    }

    const toggleSubjectMapping = (subjectId: number, className: string) => {
        setSubjects(prev => prev.map(s => {
            if (s.id === subjectId) {
                const isMapped = s.classes.includes(className)
                const updatedClasses = isMapped
                    ? s.classes.filter(c => c !== className)
                    : [...s.classes, className]

                toast.info(isMapped ? 'Mapping Removed' : 'Mapping Added', {
                    description: `${s.name} ${isMapped ? 'unlinked from' : 'linked to'} ${className}`
                })
                return { ...s, classes: updatedClasses }
            }
            return s
        }))
    }

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'core': return <BookOpen className="w-4 h-4" />
            case 'practical': return <Code className="w-4 h-4" />
            case 'language': return <Languages className="w-4 h-4" />
            default: return <BookMarked className="w-4 h-4" />
        }
    }

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'core': return 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 border-indigo-100 dark:border-indigo-800/30'
            case 'practical': return 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 border-emerald-100 dark:border-emerald-800/30'
            case 'language': return 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 border-amber-100 dark:border-amber-800/30'
            default: return 'bg-[var(--background-secondary)] text-[var(--foreground-secondary)] border-[var(--border)]'
        }
    }

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Link href="/admin/dashboard" className="text-sm font-medium text-[var(--foreground-secondary)] hover:text-indigo-600 transition-colors">Dashboard</Link>
                        <ChevronRight className="w-4 h-4 text-[var(--foreground-muted)]" />
                        <span className="text-sm font-bold text-indigo-600">Subject Mapping</span>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">Academic Curriculum</h1>
                    <p className="text-[var(--foreground-secondary)] mt-1">Define subjects and map them to appropriate classes.</p>
                </div>

                <div className="flex items-center gap-3">
                    <Dialog open={isCreatingSubject} onOpenChange={setIsCreatingSubject}>
                        <DialogTrigger asChild>
                            <Button className="gap-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 px-6 h-12 font-bold transform hover:scale-105 transition-all text-white border-none">
                                <Plus className="w-5 h-5" />
                                Create Subject
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] rounded-[2rem] border-[var(--border)] bg-[var(--card-background)] p-8 shadow-2xl">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-black text-[var(--foreground)]">New Subject Master</DialogTitle>
                                <DialogDescription className="font-medium text-[var(--foreground-secondary)]">Define a core or elective subject for the curriculum.</DialogDescription>
                            </DialogHeader>
                            <div className="py-6 space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)] ml-1">Subject Name</label>
                                    <Input
                                        placeholder="e.g. Physics"
                                        value={newSubjectName}
                                        onChange={(e) => setNewSubjectName(e.target.value)}
                                        className="h-12 rounded-2xl bg-[var(--background-secondary)] border-[var(--border)] font-bold text-[var(--foreground)]"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)] ml-1">Short Code</label>
                                    <Input
                                        placeholder="e.g. PHY"
                                        value={newSubjectCode}
                                        onChange={(e) => setNewSubjectCode(e.target.value)}
                                        className="h-12 rounded-2xl bg-[var(--background-secondary)] border-[var(--border)] font-bold uppercase text-[var(--foreground)]"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)] ml-1">Subject Type</label>
                                    <Select defaultValue="core" onValueChange={setNewSubjectType}>
                                        <SelectTrigger className="h-12 rounded-2xl bg-[var(--background-secondary)] border-[var(--border)] font-bold text-[var(--foreground)]">
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-2xl border-[var(--border)] bg-[var(--card-background)] shadow-xl">
                                            <SelectItem value="core" className="rounded-xl font-bold">Core Subject</SelectItem>
                                            <SelectItem value="elective" className="rounded-xl font-bold">Elective</SelectItem>
                                            <SelectItem value="language" className="rounded-xl font-bold">Language</SelectItem>
                                            <SelectItem value="practical" className="rounded-xl font-bold">Practical / Lab</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                    onClick={handleCreateSubject}
                                    className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-600/20 text-white"
                                >
                                    Register Subject
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Content Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="bg-[var(--background-secondary)] p-1.5 rounded-2xl h-auto self-start border border-[var(--border)] shadow-sm">
                    <TabsTrigger value="master" className="rounded-xl px-6 py-2.5 font-bold data-[state=active]:bg-[var(--card-background)] data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm transition-all">
                        <BookMarked className="w-4 h-4 mr-2" />
                        Subject Master
                    </TabsTrigger>
                    <TabsTrigger value="mapping" className="rounded-xl px-6 py-2.5 font-bold data-[state=active]:bg-[var(--card-background)] data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm transition-all">
                        <Settings2 className="w-4 h-4 mr-2" />
                        Class-Wise Mapping
                    </TabsTrigger>
                    <TabsTrigger value="criteria" className="rounded-xl px-6 py-2.5 font-bold data-[state=active]:bg-[var(--card-background)] data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm transition-all">
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Passing Criteria
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="master" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-400">
                    {/* Search & Stats Area */}
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1 group">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--foreground-muted)] group-focus-within:text-indigo-500 transition-colors" />
                            <Input placeholder="Search subjects by name or code..." className="h-14 pl-12 rounded-2xl border-[var(--border)] bg-[var(--card-background)] shadow-sm font-medium text-[var(--foreground)]" />
                        </div>
                        <div className="flex items-center gap-4 bg-[var(--card-background)] p-2 rounded-2xl border border-[var(--border)] shadow-sm">
                            {[
                                { label: 'Total Subjects', value: '42' },
                                { label: 'Core', value: '18' },
                                { label: 'Electives', value: '12' },
                            ].map((stat, i) => (
                                <div key={i} className="px-5 py-2 text-center border-r last:border-0 border-[var(--border)]">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)]">{stat.label}</p>
                                    <p className="text-lg font-bold text-[var(--foreground)]">{stat.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Subject Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {subjects.map((subject) => (
                            <Card key={subject.id} className="border-none bg-[var(--card-background)] rounded-3xl shadow-xl shadow-slate-200/40 dark:shadow-none hover:shadow-indigo-500/10 transition-all group cursor-pointer border-t-4 border-transparent hover:border-indigo-500">
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between mb-6">
                                        <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm transform group-hover:scale-110 transition-transform", getTypeColor(subject.type))}>
                                            {getTypeIcon(subject.type)}
                                        </div>
                                        <div className="flex gap-1.5">
                                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-[var(--background-secondary)]">
                                                <Edit2 className="w-4 h-4 text-[var(--foreground-muted)] hover:text-indigo-600" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/10">
                                                <Trash2 className="w-4 h-4 text-[var(--foreground-muted)] hover:text-red-600" />
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="space-y-1 mb-6">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-xl font-bold text-[var(--foreground)] tracking-tight leading-none">{subject.name}</h3>
                                            <Badge variant="outline" className="rounded-md bg-[var(--background-secondary)] text-[10px] font-black uppercase tracking-wider text-[var(--foreground-muted)] border-[var(--border)]">{subject.code}</Badge>
                                        </div>
                                        <p className="text-xs font-semibold text-indigo-500 uppercase tracking-widest">{subject.type}</p>
                                    </div>

                                    <div className="space-y-3">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)]">Assigned To Classes</p>
                                        <div className="flex flex-wrap gap-2">
                                            {subject.classes.map((cls, i) => (
                                                <Badge key={i} className="rounded-lg bg-[var(--background-secondary)] text-[var(--foreground-secondary)] border-[var(--border)] font-bold px-2 py-1 hover:bg-indigo-500/10 hover:text-indigo-600 transition-colors">
                                                    {cls}
                                                </Badge>
                                            ))}
                                            <button className="w-8 h-8 rounded-lg border-2 border-dashed border-[var(--border)] flex items-center justify-center text-[var(--foreground-muted)] hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-500/10 transition-all">
                                                <Plus className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                </CardContent>
                                <div className="px-6 py-4 bg-[var(--background-secondary)]/30 border-t border-[var(--border)] flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-[var(--foreground-muted)] flex items-center gap-1.5">
                                        <HistoryIcon className="w-3 h-3" />
                                        Updated 2 days ago
                                    </span>
                                    <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase tracking-wider text-indigo-600 hover:bg-[var(--card-background)] h-7.5 rounded-lg border border-transparent hover:border-indigo-100 shadow-sm">
                                        View Curriculum
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="mapping" className="animate-in fade-in slide-in-from-bottom-2 duration-400">
                    <Card className="border-none bg-[var(--card-background)] rounded-[2.5rem] shadow-xl shadow-slate-200/40 dark:shadow-none overflow-hidden">
                        <CardHeader className="p-8 border-b border-[var(--border)]">
                            <CardTitle className="text-xl font-bold text-[var(--foreground)]">Curriculum Mapping Grid</CardTitle>
                            <CardDescription className="text-[var(--foreground-secondary)]">Toggle subject availability across different grade levels.</CardDescription>
                        </CardHeader>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-[var(--background-secondary)]/50 hover:bg-[var(--background-secondary)]/50 border-b border-[var(--border)]">
                                        <TableHead className="w-[250px] px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)]">Subject Label</TableHead>
                                        {gradeLevels.map(grade => (
                                            <TableHead key={grade} className="text-center px-4 py-5 text-[10px] font-black uppercase tracking-widest min-w-[120px] text-[var(--foreground-muted)]">{grade}</TableHead>
                                        ))}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {subjects.map((subject) => (
                                        <TableRow key={subject.id} className="group hover:bg-indigo-500/10 transition-colors border-b border-[var(--border)]">
                                            <TableCell className="px-8 py-5">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-[var(--foreground)]">{subject.name}</span>
                                                    <span className="text-[10px] font-black text-indigo-500 uppercase tracking-tighter">{subject.code}</span>
                                                </div>
                                            </TableCell>
                                            {gradeLevels.map(grade => (
                                                <TableCell key={grade} className="text-center px-4 py-5">
                                                    <div className="flex justify-center">
                                                        <Switch
                                                            checked={subject.classes.includes(grade)}
                                                            onCheckedChange={() => toggleSubjectMapping(subject.id, grade)}
                                                            className="data-[state=checked]:bg-indigo-600"
                                                        />
                                                    </div>
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                        <div className="p-8 bg-[var(--background-secondary)]/30 border-t border-[var(--border)] text-center">
                            <p className="text-xs font-semibold text-[var(--foreground-muted)] flex items-center justify-center gap-2">
                                <Settings2 className="w-3.5 h-3.5" />
                                Changes are saved automatically and reflected in teachers' class diaries.
                            </p>
                        </div>
                    </Card>
                </TabsContent>

                <TabsContent value="criteria" className="animate-in fade-in slide-in-from-bottom-2 duration-400">
                    <Card className="border-none bg-[var(--card-background)] rounded-[2.5rem] shadow-xl shadow-slate-200/40 dark:shadow-none overflow-hidden">
                        <div className="p-10 text-center space-y-4">
                            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-600 mx-auto">
                                <CheckCircle2 className="w-10 h-10" />
                            </div>
                            <h3 className="text-2xl font-bold text-[var(--foreground)]">Passing Criteria Setup</h3>
                            <p className="text-[var(--foreground-secondary)] max-w-md mx-auto">Global and class-specific passing marks configuration. Connect with examination module markers.</p>
                            <Button className="rounded-2xl bg-indigo-600 shadow-xl shadow-indigo-600/20 px-8 font-bold mt-4 text-white border-none" onClick={() => setActiveTab('master')}>
                                Back to Master List
                            </Button>
                        </div>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Bottom Insight Card */}
            <div className="p-8 rounded-[2.5rem] bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden group">
                <div className="relative z-10 space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-[1.2rem] bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                            <Microscope className="w-5 h-5 text-indigo-400" />
                        </div>
                        <h4 className="text-lg font-bold">New: Practical Assessments</h4>
                    </div>
                    <p className="text-slate-400 text-sm max-w-lg font-medium">
                        Subjects marked as "Practical" now support separate marks entry for theory and lab work in the grading module.
                    </p>
                </div>
                <Button className="bg-white text-indigo-950 hover:bg-indigo-50 rounded-2xl font-black text-xs uppercase tracking-widest px-8 h-12 relative z-10 transition-transform hover:scale-105 active:scale-95 border-none">
                    Configure Practicals
                </Button>
                {/* Decorative background circle */}
                <div className="absolute -top-12 -right-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] group-hover:scale-150 transition-transform duration-1000" />
            </div>
        </div>
    )
}
