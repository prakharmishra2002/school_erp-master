'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createStudent } from '@/app/(admin)/_actions/students'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
    ChevronRight,
    ChevronLeft,
    Check,
    User,
    Phone,
    Heart,
    GraduationCap,
    Upload,
    Calendar,
    MapPin,
    AlertCircle,
    Info,
    CheckCircle2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"

const steps = [
    { id: 'personal', title: 'Personal Identity', icon: User, description: 'Student basic information' },
    { id: 'contact', title: 'Contact Network', icon: MapPin, description: 'Address and primary phone' },
    { id: 'guardian', title: 'Guardian Hierarchy', icon: Heart, description: 'Parent and family details' },
    { id: 'academic', title: 'Academic Placement', icon: GraduationCap, description: 'Class and section assignment' },
]

export default function NewAdmissionPage() {
    const router = useRouter()
    const [currentStep, setCurrentStep] = useState(0)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Form State
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        date_of_birth: '',
        gender: '',
        blood_group: '',
        class_id: '',
        section_id: '',
    })

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1)
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1)
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }

    const handleSubmit = async () => {
        setIsSubmitting(true)

        // Generate a random admission number (in a real app, backend generates this sequence)
        const admNo = `2026${Math.floor(1000 + Math.random() * 9000).toString()}`

        const payload = {
            ...formData,
            admission_number: admNo,
            admission_date: new Date().toISOString().split('T')[0],
        }

        const res = await createStudent(payload)
        setIsSubmitting(false)

        if (res.success) {
            toast.success('Student Enrolled Successfully', {
                description: `Admission #${admNo} has been generated.`
            })
            router.push('/admin/students')
        } else {
            toast.error('Enrollment Failed', {
                description: res.message
            })
        }
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Link href="/admin/students" className="text-sm font-medium text-[var(--foreground-secondary)] hover:text-indigo-600 transition-colors">Student Hub</Link>
                        <ChevronRight className="w-4 h-4 text-[var(--foreground-muted)]" />
                        <span className="text-sm font-bold text-indigo-600 uppercase tracking-widest">New Admission</span>
                    </div>
                    <h1 className="text-3xl font-black tracking-tight text-[var(--foreground)]">Enroll New Student</h1>
                    <p className="text-[var(--foreground-secondary)] mt-1 font-medium">Complete the multi-step form to register a student in the 2026-27 session.</p>
                </div>

                <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 rounded-2xl">
                    <Info className="w-4 h-4 text-indigo-500" />
                    <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-widest">Adm Mode: Online</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Fixed Progress Sidebar */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="sticky top-28 space-y-2">
                        {steps.map((step, index) => {
                            const isCompleted = index < currentStep
                            const isActive = index === currentStep
                            return (
                                <div
                                    key={step.id}
                                    className={cn(
                                        "p-4 rounded-[1.5rem] border-2 transition-all duration-500 flex items-start gap-4",
                                        isActive ? "bg-[var(--card-background)] border-indigo-500 shadow-xl shadow-indigo-500/10 scale-[1.02]" :
                                            isCompleted ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800 opacity-80" : "bg-transparent border-transparent opacity-40"
                                    )}
                                >
                                    <div className={cn(
                                        "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-colors",
                                        isActive ? "bg-indigo-600 text-white" :
                                            isCompleted ? "bg-emerald-500 text-white" : "bg-[var(--background-secondary)] text-[var(--foreground-muted)]"
                                    )}>
                                        {isCompleted ? <Check className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
                                    </div>
                                    <div className="min-w-0">
                                        <p className={cn(
                                            "text-xs font-black uppercase tracking-widest leading-none mb-1",
                                            isActive ? "text-indigo-600" : isCompleted ? "text-emerald-700" : "text-[var(--foreground-muted)]"
                                        )}>
                                            {step.title}
                                        </p>
                                        <p className="text-[10px] font-bold text-[var(--foreground-muted)] opacity-60 leading-tight">
                                            {step.description}
                                        </p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Main Form Content */}
                <div className="lg:col-span-3">
                    <Card className="border-none bg-[var(--card-background)] rounded-[2.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-none overflow-hidden">
                        <CardHeader className="p-8 pb-4 border-b border-[var(--border)]">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-2xl font-black flex items-center gap-3 text-[var(--foreground)]">
                                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 flex items-center justify-center">
                                        {(() => {
                                            const Icon = steps[currentStep].icon
                                            return <Icon className="w-6 h-6" />
                                        })()}
                                    </div>
                                    {steps[currentStep].title}
                                </CardTitle>
                                <Badge variant="outline" className="rounded-lg h-8 px-4 font-black border-[var(--border)] text-[var(--foreground-muted)] bg-[var(--background-secondary)] uppercase tracking-tighter">
                                    Step {currentStep + 1} of 4
                                </Badge>
                            </div>
                        </CardHeader>

                        <CardContent className="p-10">
                            {/* Step Transitions - Mock */}
                            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                                {currentStep === 0 && (
                                    <div className="space-y-8">
                                        <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-[var(--border)] rounded-[2rem] bg-[var(--background-secondary)]/50 group hover:border-indigo-200 dark:hover:border-indigo-800 hover:bg-indigo-50/5 dark:hover:bg-indigo-900/10 transition-all cursor-pointer">
                                            <div className="w-24 h-24 rounded-full bg-[var(--card-background)] border-4 border-[var(--card-background)] shadow-xl flex items-center justify-center text-[var(--foreground-muted)] group-hover:text-indigo-500 transition-colors">
                                                <Upload className="w-8 h-8" />
                                            </div>
                                            <p className="mt-4 text-sm font-bold text-[var(--foreground-secondary)] tracking-tight">Upload Student Photograph</p>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)] mt-1 opacity-60">JPEG, PNG • Max 2MB</p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase tracking-widest text-[var(--foreground-muted)] ml-1">First Name (Student) *</label>
                                                <Input
                                                    placeholder="e.g. Aarav"
                                                    value={formData.first_name}
                                                    onChange={e => handleInputChange('first_name', e.target.value)}
                                                    className="h-14 rounded-2xl border-[var(--border)] bg-[var(--background-secondary)]/50 focus:bg-[var(--card-background)] focus:ring-indigo-500/20 text-base font-semibold"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase tracking-widest text-[var(--foreground-muted)] ml-1">Last Name</label>
                                                <Input
                                                    placeholder="e.g. Sharma"
                                                    value={formData.last_name}
                                                    onChange={e => handleInputChange('last_name', e.target.value)}
                                                    className="h-14 rounded-2xl border-[var(--border)] bg-[var(--background-secondary)]/50 focus:bg-[var(--card-background)] focus:ring-indigo-500/20 text-base font-semibold"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase tracking-widest text-[var(--foreground-muted)] ml-1">Date of Birth *</label>
                                                <div className="relative">
                                                    <Input
                                                        type="date"
                                                        value={formData.date_of_birth}
                                                        onChange={e => handleInputChange('date_of_birth', e.target.value)}
                                                        className="h-14 rounded-2xl border-[var(--border)] bg-[var(--background-secondary)]/50 focus:bg-[var(--card-background)] focus:ring-indigo-500/20 text-base font-semibold text-[var(--foreground)]"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase tracking-widest text-[var(--foreground-muted)] ml-1">Gender *</label>
                                                <Select value={formData.gender} onValueChange={val => handleInputChange('gender', val)}>
                                                    <SelectTrigger className="h-14 rounded-2xl border-[var(--border)] bg-[var(--background-secondary)]/50 focus:bg-[var(--card-background)] focus:ring-indigo-500/20 text-base font-semibold">
                                                        <SelectValue placeholder="Select gender" />
                                                    </SelectTrigger>
                                                    <SelectContent className="rounded-2xl border-[var(--border)] p-2 bg-[var(--card-background)]">
                                                        <SelectItem value="male" className="rounded-xl font-bold py-3 text-[var(--foreground)]">Male</SelectItem>
                                                        <SelectItem value="female" className="rounded-xl font-bold py-3 text-[var(--foreground)]">Female</SelectItem>
                                                        <SelectItem value="other" className="rounded-xl font-bold py-3 text-[var(--foreground)]">Other</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase tracking-widest text-[var(--foreground-muted)] ml-1">Blood Group</label>
                                                <Input
                                                    placeholder="e.g. O+ve"
                                                    value={formData.blood_group}
                                                    onChange={e => handleInputChange('blood_group', e.target.value)}
                                                    className="h-14 rounded-2xl border-[var(--border)] bg-[var(--background-secondary)]/50 focus:bg-[var(--card-background)] focus:ring-indigo-500/20 text-base font-semibold"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase tracking-widest text-[var(--foreground-muted)] ml-1">Aadhaar Number</label>
                                                <Input placeholder="XXXX-XXXX-XXXX" className="h-14 rounded-2xl border-[var(--border)] bg-[var(--background-secondary)]/50 focus:bg-[var(--card-background)] focus:ring-indigo-500/20 text-base font-semibold" />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {currentStep === 1 && (
                                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-widest text-[var(--foreground-muted)] ml-1">Permanent Residential Address *</label>
                                            <textarea
                                                className="w-full min-h-[120px] p-5 rounded-[2rem] border-2 border-[var(--border)] bg-[var(--background-secondary)]/50 focus:bg-[var(--card-background)] focus:border-indigo-500/50 outline-none text-base font-semibold text-[var(--foreground)] transition-all resize-none"
                                                placeholder="Enter full address with street name, house number..."
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase tracking-widest text-[var(--foreground-muted)] ml-1">City</label>
                                                <Input placeholder="e.g. Mumbai" className="h-14 rounded-2xl border-[var(--border)] bg-[var(--background-secondary)]/50 focus:bg-[var(--card-background)]" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase tracking-widest text-[var(--foreground-muted)] ml-1">State</label>
                                                <Input placeholder="e.g. Maharashtra" className="h-14 rounded-2xl border-[var(--border)] bg-[var(--background-secondary)]/50 focus:bg-[var(--card-background)]" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase tracking-widest text-[var(--foreground-muted)] ml-1">Pincode</label>
                                                <Input placeholder="400001" className="h-14 rounded-2xl border-[var(--border)] bg-[var(--background-secondary)]/50 focus:bg-[var(--card-background)]" />
                                            </div>
                                        </div>
                                        <div className="p-6 rounded-[2rem] bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50 flex items-start gap-4">
                                            <AlertCircle className="w-6 h-6 text-indigo-500 shrink-0" />
                                            <div>
                                                <h4 className="text-sm font-bold text-indigo-900 dark:text-indigo-300 leading-none mb-1">Mobile Connectivity</h4>
                                                <p className="text-xs text-indigo-700/80 dark:text-indigo-400/70 font-medium leading-relaxed">
                                                    SMS alerts and student notifications will be sent to the primary mobile number provided in the next guardian step.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {currentStep === 2 && (
                                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                                        <div className="p-8 rounded-[2.5rem] bg-[var(--background-secondary)] border-2 border-[var(--border)] space-y-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/20">
                                                    <span className="text-sm font-black">01</span>
                                                </div>
                                                <h4 className="text-lg font-black text-[var(--foreground)] tracking-tight">Primary Guardian Details</h4>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-black uppercase tracking-widest text-[var(--foreground-muted)] ml-1">Relation *</label>
                                                    <Select defaultValue="father">
                                                        <SelectTrigger className="h-14 rounded-2xl bg-[var(--card-background)] border-[var(--border)] font-bold text-[var(--foreground)]">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent className="rounded-2xl border-[var(--border)] p-2 bg-[var(--card-background)]">
                                                            <SelectItem value="father" className="rounded-xl font-bold py-3 text-[var(--foreground)]">Father</SelectItem>
                                                            <SelectItem value="mother" className="rounded-xl font-bold py-3 text-[var(--foreground)]">Mother</SelectItem>
                                                            <SelectItem value="guardian" className="rounded-xl font-bold py-3 text-[var(--foreground)]">Guardian</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-black uppercase tracking-widest text-[var(--foreground-muted)] ml-1">Full Name *</label>
                                                    <Input placeholder="Enter guardian name" className="h-14 rounded-2xl bg-[var(--card-background)] border-[var(--border)] font-bold text-[var(--foreground)]" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-black uppercase tracking-widest text-[var(--foreground-muted)] ml-1">Phone Number *</label>
                                                    <div className="relative">
                                                        <Input placeholder="+91 XXXXX XXXXX" className="h-14 rounded-2xl bg-[var(--card-background)] border-[var(--border)] font-bold pl-12 text-[var(--foreground)]" />
                                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--foreground-muted)]" />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-black uppercase tracking-widest text-[var(--foreground-muted)] ml-1">Email (Optional)</label>
                                                    <Input placeholder="guardian@example.com" className="h-14 rounded-2xl bg-[var(--card-background)] border-[var(--border)] font-bold text-[var(--foreground)]" />
                                                </div>
                                            </div>
                                        </div>

                                        <button className="w-full h-16 rounded-[2rem] border-2 border-dashed border-[var(--border)] flex items-center justify-center gap-3 text-[var(--foreground-muted)] hover:border-indigo-300 dark:hover:border-indigo-800 hover:text-indigo-600 hover:bg-[var(--background-secondary)] transition-all font-bold group">
                                            <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                            Add Secondary Guardian / Mother's Details
                                        </button>
                                    </div>
                                )}

                                {currentStep === 3 && (
                                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase tracking-widest text-[var(--foreground-muted)] ml-1">Assigned Class *</label>
                                                <Select value={formData.class_id} onValueChange={val => handleInputChange('class_id', val)}>
                                                    <SelectTrigger className="h-14 rounded-2xl border-[var(--border)] bg-[var(--background-secondary)]/50 font-bold text-[var(--foreground)]">
                                                        <SelectValue placeholder="Select class" />
                                                    </SelectTrigger>
                                                    <SelectContent className="rounded-2xl border-[var(--border)] p-2 bg-[var(--card-background)]">
                                                        <SelectItem value="1" className="rounded-xl font-bold py-3 text-[var(--foreground)]">Class 10</SelectItem>
                                                        <SelectItem value="2" className="rounded-xl font-bold py-3 text-[var(--foreground)]">Class 9</SelectItem>
                                                        <SelectItem value="3" className="rounded-xl font-bold py-3 text-[var(--foreground)]">Class 8</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase tracking-widest text-[var(--foreground-muted)] ml-1">Target Section *</label>
                                                <Select value={formData.section_id} onValueChange={val => handleInputChange('section_id', val)}>
                                                    <SelectTrigger className="h-14 rounded-2xl border-[var(--border)] bg-[var(--background-secondary)]/50 font-bold text-[var(--foreground)]">
                                                        <SelectValue placeholder="Select section" />
                                                    </SelectTrigger>
                                                    <SelectContent className="rounded-2xl border-[var(--border)] p-2 bg-[var(--card-background)]">
                                                        <SelectItem value="1" className="rounded-xl font-bold py-3 text-[var(--foreground)]">Section A</SelectItem>
                                                        <SelectItem value="2" className="rounded-xl font-bold py-3 text-[var(--foreground)]">Section B</SelectItem>
                                                        <SelectItem value="3" className="rounded-xl font-bold py-3 text-[var(--foreground)]">Section C</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 flex items-center justify-center">
                                                    <History className="w-5 h-5" />
                                                </div>
                                                <h4 className="text-lg font-black text-[var(--foreground)] tracking-tight">Previous Schooling History</h4>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-black uppercase tracking-widest text-[var(--foreground-muted)] ml-1">Previous School Name</label>
                                                    <Input placeholder="e.g. Saint Xaviers High" className="h-14 rounded-2xl border-[var(--border)] bg-[var(--background-secondary)]/50 focus:bg-[var(--card-background)] font-bold text-[var(--foreground)]" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-black uppercase tracking-widest text-[var(--foreground-muted)] ml-1">Last Class Attended</label>
                                                    <Input placeholder="e.g. Class 9" className="h-14 rounded-2xl border-[var(--border)] bg-[var(--background-secondary)]/50 focus:bg-[var(--card-background)] font-bold text-[var(--foreground)]" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Confirmation Modal Section */}
                                        <div className="p-8 rounded-[2.5rem] bg-indigo-600 shadow-xl shadow-indigo-600/30 text-white relative overflow-hidden group">
                                            <div className="relative z-10">
                                                <h4 className="text-xl font-bold mb-2 flex items-center gap-2">
                                                    <CheckCircle2 className="w-6 h-6" />
                                                    Ready for Enrollment?
                                                </h4>
                                                <p className="text-indigo-100/70 text-sm font-medium leading-relaxed max-w-lg mb-6">
                                                    By clicking enroll, the student will be officially registered in the school database and a unique admission number will be generated.
                                                </p>
                                                <div className="flex items-center gap-4">
                                                    <div className="px-5 py-2 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md">
                                                        <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Session</p>
                                                        <p className="text-sm font-bold">2026-27</p>
                                                    </div>
                                                    <div className="px-5 py-2 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md">
                                                        <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Status</p>
                                                        <p className="text-sm font-bold">Active</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>

                        {/* Sticky Action Bar */}
                        <div className="p-8 border-t border-[var(--border)] flex items-center justify-between bg-[var(--background-secondary)]/50">
                            <Button
                                variant="ghost"
                                onClick={prevStep}
                                disabled={currentStep === 0}
                                className="h-14 rounded-2xl px-8 font-bold text-[var(--foreground-muted)] hover:text-indigo-600 hover:bg-[var(--card-background)] transition-all disabled:opacity-30"
                            >
                                <ChevronLeft className="w-5 h-5 mr-3" />
                                Back to Previous
                            </Button>

                            <div className="flex items-center gap-4">
                                <Button variant="ghost" className="h-14 px-8 rounded-2xl font-bold text-[var(--foreground-muted)] hover:text-[var(--foreground)]">
                                    Save Draft
                                </Button>
                                {currentStep < steps.length - 1 ? (
                                    <Button
                                        onClick={nextStep}
                                        className="h-14 rounded-2xl px-10 bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 font-bold transition-all transform hover:translate-x-1 active:scale-95 text-white"
                                    >
                                        Save & Continue
                                        <ChevronRight className="w-5 h-5 ml-3" />
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={handleSubmit}
                                        disabled={isSubmitting}
                                        className="h-14 rounded-2xl px-12 bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-600/20 font-bold transition-all active:scale-95 text-white"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                                                Registering...
                                            </>
                                        ) : (
                                            <>
                                                Finalize Enrollment
                                                <Check className="w-5 h-5 ml-3" />
                                            </>
                                        )}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}

// Additional Icons that were missing but needed
import { History, Loader2, Plus } from 'lucide-react'
