'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { GraduationCap, Mail, Lock, Eye, EyeOff, BookOpen, Users, Shield } from 'lucide-react'
import api from '@/lib/api'

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const response = await api.post('/auth/login', { email, password })

            if (response.data.success) {
                localStorage.setItem('auth_token', response.data.data.token)
                localStorage.setItem('user', JSON.stringify(response.data.data.user))

                // Redirect based on role
                const role = response.data.data.user.role
                if (role === 'admin' || role === 'super_admin') {
                    router.push('/admin/dashboard')
                } else if (role === 'teacher') {
                    router.push('/teacher/dashboard')
                } else if (role === 'parent') {
                    router.push('/parent/dashboard')
                } else if (role === 'developer') {
                    router.push('/dev')
                } else if (role === 'accountant') {
                    router.push('/admin/fees/collect') // Best match for now
                } else {
                    router.push('/admin/dashboard') // Default fallback for any other roles
                }
            }
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } }
            setError(error.response?.data?.message || 'Invalid credentials. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex">
            {/* Left Panel - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[var(--primary-900)] via-[var(--primary-800)] to-[var(--primary-950)] relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl" />
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-[var(--accent-500)] rounded-full blur-3xl" />
                </div>

                {/* Grid pattern overlay */}
                <div className="absolute inset-0 opacity-5" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }} />

                <div className="relative z-10 flex flex-col justify-between p-12 text-white">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
                            <GraduationCap className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="font-display text-2xl font-semibold">EduVerse</h1>
                            <p className="text-sm text-white/60">School Management System</p>
                        </div>
                    </div>

                    {/* Main content */}
                    <div className="space-y-8 max-w-md">
                        <div>
                            <h2 className="font-display text-4xl font-semibold leading-tight mb-4 text-white">
                                Empowering Education Through Innovation
                            </h2>
                            <p className="text-lg text-white/70 leading-relaxed">
                                A comprehensive platform designed to streamline school administration,
                                enhance learning outcomes, and foster academic excellence.
                            </p>
                        </div>

                        {/* Features */}
                        <div className="space-y-4">
                            {[
                                { icon: BookOpen, label: 'Complete Academic Management', desc: 'Students, teachers, classes & exams' },
                                { icon: Users, label: 'Multi-Role Access', desc: 'Admin, Teacher, Parent & Staff portals' },
                                { icon: Shield, label: 'Enterprise Security', desc: 'Role-based access & data protection' },
                            ].map((feature, i) => (
                                <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                                        <feature.icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-white">{feature.label}</h3>
                                        <p className="text-sm text-white/60">{feature.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="text-sm text-white/40">
                        © 2026 EduVerse. Crafted for Academic Excellence.
                    </div>
                </div>
            </div>

            {/* Right Panel - Login Form */}
            <div className="flex-1 flex items-center justify-center p-8 bg-[var(--background)]">
                <div className="w-full max-w-md animate-slide-up">
                    {/* Mobile logo */}
                    <div className="lg:hidden flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-gradient-to-br from-[var(--primary-600)] to-[var(--primary-700)] rounded-xl flex items-center justify-center">
                            <GraduationCap className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="font-display text-xl font-semibold text-[var(--foreground)]">EduVerse</h1>
                            <p className="text-xs text-[var(--foreground-muted)]">School ERP</p>
                        </div>
                    </div>

                    <Card variant="elevated" className="border-0 shadow-xl">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-2xl">Welcome back</CardTitle>
                            <CardDescription className="text-base">
                                Sign in to access your dashboard
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="pt-6">
                            <form onSubmit={handleLogin} className="space-y-5">
                                {error && (
                                    <div className="p-4 rounded-lg bg-[var(--error-light)] border border-[var(--error)]/20">
                                        <p className="text-sm text-[var(--error)]">{error}</p>
                                    </div>
                                )}

                                <Input
                                    type="email"
                                    label="Email Address"
                                    placeholder="admin@school.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    icon={<Mail className="w-5 h-5" />}
                                    required
                                />

                                <div className="relative">
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        label="Password"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        icon={<Lock className="w-5 h-5" />}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-[38px] text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>

                                <div className="flex items-center justify-between">
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 rounded border-[var(--input-border)] text-[var(--primary-600)] focus:ring-[var(--primary-500)]"
                                        />
                                        <span className="text-sm text-[var(--foreground-secondary)]">Remember me</span>
                                    </label>
                                    <a href="/forgot-password" className="text-sm font-medium text-[var(--primary-600)] hover:text-[var(--primary-700)]">
                                        Forgot password?
                                    </a>
                                </div>

                                <Button type="submit" className="w-full h-12 text-base" loading={loading}>
                                    Sign In
                                </Button>
                            </form>

                            <div className="mt-6 pt-6 border-t border-[var(--border)]">
                                <p className="text-sm text-center text-[var(--foreground-secondary)]">
                                    Are you a parent?{' '}
                                    <a href="/parent/login" className="font-medium text-[var(--primary-600)] hover:text-[var(--primary-700)]">
                                        Access Parent Portal
                                    </a>
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Demo credentials */}
                    <div className="mt-6 p-4 rounded-lg bg-[var(--background-secondary)] border border-[var(--border)]">
                        <p className="text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wide mb-2">
                            Demo Credentials
                        </p>
                        <div className="space-y-1 text-sm text-[var(--foreground-secondary)]">
                            <p><span className="text-[var(--foreground)] font-medium">Admin:</span> admin@school.com / password</p>
                            <p><span className="text-[var(--foreground)] font-medium">Teacher:</span> teacher@school.com / password</p>
                            <p><span className="text-[var(--foreground)] font-medium">Developer:</span> mvaibhav@gmail / passoword</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
