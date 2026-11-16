'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createTeacher } from '@/app/(admin)/_actions/teachers'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
    ChevronRight,
    ChevronLeft,
    Check,
    Briefcase,
    ShieldCheck,
    BookOpen,
    User,
    Upload,
    Calendar,
    Phone,
    Mail,
    Building2,
    DollarSign,
    Award,
    FileCheck
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
    { id: 'bio', title: 'Personal Bio', icon: User, description: 'Basic staff information' },
    { id: 'contract', title: 'Employment', icon: Briefcase, description: 'Role, Dept & Salary' },
    { id: 'docs', title: 'Compliance', icon: ShieldCheck, description: 'ID & Legal documents' },
    { id: 'academic', title: 'Competency', icon: BookOpen, description: 'Qualifications & Subjects' },
]

export default function NewStaffOnboardingPage() {
    const router = useRouter()
    const [currentStep, setCurrentStep] = useState(0)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        department: '',
        designation: '',
        employee_id: `TCH${new Date().getFullYear()}${Math.floor(1000 + Math.random() * 9000)}`
    })

    const handleChange = (field: string, value: string) => {
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
        try {
            const res = await createTeacher(formData)
            if (res.success) {
                toast.success('Staff Member Hired Successfully', {
                    description: `Employee ID ${res.data?.employeeId} has been assigned.`
                })
                router.push('/admin/teachers')
            } else {
                toast.error('Failed to register staff', {
                    description: res.message
                })
            }
        } catch (error: any) {
            toast.error('Error', { description: error.message })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Link href="/admin/teachers" className="text-sm font-medium text-[var(--foreground-secondary)] hover:text-indigo-600 transition-colors">Staff Hub</Link>
                        <ChevronRight className="w-4 h-4 text-[var(--foreground-muted)]" />
                        <span className="text-sm font-bold text-indigo-600 uppercase tracking-widest">New Onboarding</span>
                    </div>
                    <h1 className="text-3xl font-black tracking-tight text-[var(--foreground)]">Staff Onboarding</h1>
                    <p className="text-[var(--foreground-secondary)] mt-1 font-medium">Register new faculty members or administrative staff into the system.</p>
                </div>

                <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 rounded-2xl">
                    <FileCheck className="w-4 h-4 text-indigo-600" />
                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">HR Mode: Official Hiring</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Fixed Progress Sidebar */}
                <div className="lg:col-span-1">
                    <div className="sticky top-28 space-y-2">
                        {steps.map((step, index) => {
                            const isCompleted = index < currentStep
                            const isActive = index === currentStep
                            return (
                                <div
                                    key={step.id}
                                    className={cn(
                                        "p-4 rounded-[1.5rem] border-2 transition-all duration-500 flex items-start gap-4 cursor-pointer",
                                        isActive ? "bg-[var(--card-background)] border-indigo-500 shadow-xl shadow-indigo-500/10 scale-[1.02]" :
                                            isCompleted ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800 opacity-80" : "bg-transparent border-transparent opacity-40 hover:opacity-60"
                                    )}
                                    onClick={() => index < currentStep && setCurrentStep(index)}
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
                                            isActive ? "text-indigo-600" : isCompleted ? "text-emerald-500" : "text-[var(--foreground-muted)]"
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
                    <Card className="border-none bg-[var(--card-background)] rounded-[2.5rem] shadow-2xl shadow-slate-200/40 dark:shadow-none overflow-hidden">
                        <CardHeader className="p-10 pb-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <CardTitle className="text-2xl font-bold text-[var(--foreground)]">{steps[currentStep].title}</CardTitle>
                                    <CardDescription className="text-sm font-medium text-[var(--foreground-secondary)]">{steps[currentStep].description}</CardDescription>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--foreground-muted)] mb-1">Onboarding Progress</p>
                                    <div className="flex items-center gap-1">
                                        {[0, 1, 2, 3].map((i) => (
                                            <div key={i} className={cn(
                                                "h-1.5 w-8 rounded-full transition-all duration-500",
                                                i <= currentStep ? "bg-indigo-600" : "bg-[var(--background-secondary)]"
                                            )} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="p-10 pt-6">
                            {currentStep === 0 && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                                    <div className="flex flex-col md:flex-row gap-8 items-start">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-32 h-32 rounded-[2rem] bg-[var(--background-secondary)] border-4 border-dashed border-[var(--border)] flex flex-col items-center justify-center group hover:border-indigo-300 hover:bg-indigo-50/50 transition-all cursor-pointer">
                                                <Upload className="w-8 h-8 text-[var(--foreground-muted)] group-hover:text-indigo-500 transition-colors" />
                                                <p className="text-[8px] font-black uppercase tracking-widest text-[var(--foreground-muted)] mt-2">Upload Photo</p>
                                            </div>
                                            <p className="text-[10px] font-bold text-[var(--foreground-muted)] max-w-[120px] text-center uppercase tracking-tighter opacity-60">Recommended: Square Aspect Ratio</p>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase tracking-widest text-[var(--foreground-muted)] ml-1">First Name *</label>
                                                <Input value={formData.first_name} onChange={e => handleChange('first_name', e.target.value)} placeholder="Enter first name" className="h-14 rounded-2xl border-[var(--border)] bg-[var(--background-secondary)]/50 focus:bg-[var(--card-background)] focus:ring-indigo-500/20 font-semibold" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-black uppercase tracking-widest text-[var(--foreground-muted)] ml-1">Last Name</label>
                                                <Input value={formData.last_name} onChange={e => handleChange('last_name', e.target.value)} placeholder="Enter last name" className="h-14 rounded-2xl border-[var(--border)] bg-[var(--background-secondary)]/50 focus:bg-[var(--card-background)] focus:ring-indigo-500/20 font-semibold" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase tracking-widest text-[var(--foreground-muted)] ml-1">Date of Birth *</label>
                                                <Input type="date" className="h-14 rounded-2xl border-[var(--border)] bg-[var(--background-secondary)]/50 font-semibold text-[var(--foreground)]" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase tracking-widest text-[var(--foreground-muted)] ml-1">Gender *</label>
                                                <Select>
                                                    <SelectTrigger className="h-14 rounded-2xl bg-[var(--background-secondary)]/50 border-[var(--border)] font-semibold text-[var(--foreground)]">
                                                        <SelectValue placeholder="Select gender" />
                                                    </SelectTrigger>
                                                    <SelectContent className="rounded-2xl p-2 font-bold bg-[var(--card-background)] border-[var(--border)]">
                                                        <SelectItem value="male" className="rounded-xl py-3 px-4 italic">Male</SelectItem>
                                                        <SelectItem value="female" className="rounded-xl py-3 px-4 italic">Female</SelectItem>
                                                        <SelectItem value="other" className="rounded-xl py-3 px-4 italic">Other</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-widest text-[var(--foreground-muted)] ml-1">Personal Phone *</label>
                                            <div className="relative">
                                                <Input value={formData.phone} onChange={e => handleChange('phone', e.target.value)} placeholder="+91 XXXXX XXXXX" className="h-14 rounded-2xl bg-[var(--background-secondary)]/50 border-[var(--border)] font-semibold pl-12 text-[var(--foreground)]" />
                                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--foreground-muted)]" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-widest text-[var(--foreground-muted)] ml-1">Official Email Address *</label>
                                            <div className="relative">
                                                <Input value={formData.email} onChange={e => handleChange('email', e.target.value)} placeholder="name@school.edu" className="h-14 rounded-2xl bg-[var(--background-secondary)]/50 border-[var(--border)] font-semibold pl-12 text-[var(--foreground)]" />
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--foreground-muted)]" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {currentStep === 1 && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-widest text-[var(--foreground-muted)] ml-1">Primary Department *</label>
                                            <Select value={formData.department} onValueChange={val => handleChange('department', val)}>
                                                <SelectTrigger className="h-14 rounded-2xl bg-[var(--background-secondary)]/50 border-[var(--border)] font-semibold text-[var(--foreground)]">
                                                    <SelectValue placeholder="Pick department" />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-2xl p-2 font-bold bg-[var(--card-background)] border-[var(--border)]">
                                                    <SelectItem value="Science Faculty" className="rounded-xl py-3 px-4 italic">Science Faculty</SelectItem>
                                                    <SelectItem value="Mathematics" className="rounded-xl py-3 px-4 italic">Mathematics</SelectItem>
                                                    <SelectItem value="Language Arts" className="rounded-xl py-3 px-4 italic">Language Arts</SelectItem>
                                                    <SelectItem value="Other Classes" className="rounded-xl py-3 px-4 italic">Other Classes</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-widest text-[var(--foreground-muted)] ml-1">Official Designation *</label>
                                            <Input value={formData.designation} onChange={e => handleChange('designation', e.target.value)} placeholder="e.g. Senior Lecturer" className="h-14 rounded-2xl border-[var(--border)] bg-[var(--background-secondary)]/50 font-semibold text-[var(--foreground)]" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-widest text-[var(--foreground-muted)] ml-1">Joining Date *</label>
                                            <Input type="date" className="h-14 rounded-2xl border-[var(--border)] bg-[var(--background-secondary)]/50 font-semibold text-[var(--foreground)]" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-widest text-[var(--foreground-muted)] ml-1">Employment Type *</label>
                                            <Select defaultValue="permanent">
                                                <SelectTrigger className="h-14 rounded-2xl bg-[var(--background-secondary)]/50 border-[var(--border)] font-semibold text-[var(--foreground)]">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-2xl p-2 font-bold bg-[var(--card-background)] border-[var(--border)]">
                                                    <SelectItem value="permanent" className="rounded-xl py-3 px-4 italic">Permanent (Full Time)</SelectItem>
                                                    <SelectItem value="contract" className="rounded-xl py-3 px-4 italic">Contractual</SelectItem>
                                                    <SelectItem value="part_time" className="rounded-xl py-3 px-4 italic">Part Time / Visiting</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="p-8 rounded-[2.5rem] bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50 space-y-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/20">
                                                <DollarSign className="w-5 h-5" />
                                            </div>
                                            <h4 className="text-lg font-bold text-[var(--foreground)] tracking-tight">Financial Compensation</h4>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase tracking-widest text-[var(--foreground-muted)] ml-1">Monthly Basic Salary *</label>
                                                <div className="relative">
                                                    <Input placeholder="0.00" className="h-14 rounded-2xl bg-[var(--card-background)] border-[var(--border)] font-bold pl-12 text-[var(--foreground)]" />
                                                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)] font-bold">₹</span>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase tracking-widest text-[var(--foreground-muted)] ml-1">Allowances (HRA, TA etc.)</label>
                                                <div className="relative">
                                                    <Input placeholder="0.00" className="h-14 rounded-2xl bg-[var(--card-background)] border-[var(--border)] font-bold pl-12 text-[var(--foreground)]" />
                                                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)] font-bold">₹</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {currentStep === 2 && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-widest text-[var(--foreground-muted)] ml-1">PAN Card Number *</label>
                                            <Input placeholder="ABCDE1234F" className="h-14 rounded-2xl border-[var(--border)] bg-[var(--background-secondary)]/50 font-bold uppercase text-[var(--foreground)]" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-widest text-[var(--foreground-muted)] ml-1">Aadhaar Number *</label>
                                            <Input placeholder="XXXX-XXXX-XXXX" className="h-14 rounded-2xl border-[var(--border)] bg-[var(--background-secondary)]/50 font-bold uppercase text-[var(--foreground)]" />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-xs font-black uppercase tracking-widest text-[var(--foreground-muted)] ml-1">Document Verification Checklist</label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {[
                                                'Educational Certificates (Originals)',
                                                'Experience Letter from Prev. Employer',
                                                'KYC Verification (Aadhaar/PAN)',
                                                'Signed Employment Contract',
                                                'Address Proof Verification'
                                            ].map((item, i) => (
                                                <div key={i} className="flex items-center gap-4 p-5 rounded-2xl border-2 border-[var(--border)] bg-[var(--card-background)] group hover:border-indigo-500 transition-all cursor-pointer">
                                                    <div className="w-6 h-6 rounded-lg border-2 border-[var(--border)] flex items-center justify-center group-hover:border-indigo-500 transition-colors">
                                                        <div className="w-3 h-3 rounded-sm bg-indigo-500 scale-0 group-hover:scale-100 transition-transform duration-300" />
                                                    </div>
                                                    <span className="text-sm font-bold text-[var(--foreground-secondary)] group-hover:text-[var(--foreground)]">{item}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {currentStep === 3 && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 flex items-center justify-center">
                                                <Award className="w-5 h-5" />
                                            </div>
                                            <h4 className="text-lg font-bold text-[var(--foreground)] tracking-tight">Academic Qualifications</h4>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="md:col-span-2 space-y-2">
                                                <label className="text-xs font-black uppercase tracking-widest text-[var(--foreground-muted)] ml-1">Highest Degree *</label>
                                                <Input placeholder="e.g. M.Sc. in Physics" className="h-14 rounded-2xl border-[var(--border)] bg-[var(--background-secondary)]/50 font-bold text-[var(--foreground)]" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase tracking-widest text-[var(--foreground-muted)] ml-1">Experience (Years)</label>
                                                <Input placeholder="e.g. 8" type="number" className="h-14 rounded-2xl border-[var(--border)] bg-[var(--background-secondary)]/50 font-bold text-[var(--foreground)]" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-10 rounded-[2.5rem] bg-indigo-600 shadow-2xl shadow-indigo-600/30 text-white relative overflow-hidden group">
                                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                                            <div className="space-y-3 text-center md:text-left">
                                                <h4 className="text-2xl font-black flex items-center justify-center md:justify-start gap-3">
                                                    Confirm Staff Hire
                                                </h4>
                                                <p className="text-indigo-100/70 text-sm font-medium leading-relaxed max-w-md">
                                                    This will finalize the employment record and trigger the generation of login credentials and employee portal access.
                                                </p>
                                            </div>
                                            <Button
                                                onClick={handleSubmit}
                                                disabled={isSubmitting}
                                                className="h-16 px-12 rounded-[2rem] bg-white text-indigo-600 hover:bg-indigo-50 font-black uppercase tracking-widest text-xs transition-all transform active:scale-95 shadow-xl disabled:bg-indigo-100 disabled:text-indigo-400"
                                            >
                                                {isSubmitting ? 'Processing...' : 'Hire Personnel'}
                                            </Button>
                                        </div>
                                        {/* Decorative blob */}
                                        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000" />
                                    </div>
                                </div>
                            )}
                        </CardContent>

                        {/* Sticky Action Footer */}
                        <div className="p-8 border-t border-[var(--border)] flex items-center justify-between bg-[var(--card-background)]">
                            <Button
                                variant="ghost"
                                onClick={prevStep}
                                disabled={currentStep === 0}
                                className="h-14 rounded-2xl px-8 font-bold text-[var(--foreground-muted)] hover:text-indigo-600 hover:bg-[var(--background-secondary)] transition-all disabled:opacity-20"
                            >
                                <ChevronLeft className="w-5 h-5 mr-3" />
                                Previous Phase
                            </Button>

                            <div className="flex items-center gap-4">
                                <Button variant="ghost" className="h-14 px-8 rounded-2xl font-bold text-[var(--foreground-muted)] hover:text-rose-600 hidden md:inline-flex">
                                    Discard Application
                                </Button>
                                {currentStep < steps.length - 1 && (
                                    <Button
                                        onClick={nextStep}
                                        className="h-14 rounded-2xl px-12 bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 font-bold transition-all transform hover:translate-x-1 active:scale-95 text-white"
                                    >
                                        Validate & Next
                                        <ChevronRight className="w-5 h-5 ml-3" />
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
