'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { GraduationCap, Phone, Lock, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react'
import { sendOtp, verifyOtp } from '../actions/authActions'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
    const [phone, setPhone] = useState('')
    const [otp, setOtp] = useState('')
    const [step, setStep] = useState<'phone' | 'otp'>('phone')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const router = useRouter()

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault()
        if (phone.length < 5) {
            setError('Please enter a valid phone number')
            return
        }
        setIsLoading(true)
        setError('')
        try {
            await sendOtp(phone)
            setStep('otp')
        } catch (err) {
            setError('Failed to send OTP. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault()
        if (otp.length !== 6) {
            setError('Please enter a valid 6-digit OTP')
            return
        }
        setIsLoading(true)
        setError('')
        try {
            const result = await verifyOtp(phone, otp)
            if (result.success) {
                router.push('/parent/dashboard')
            } else {
                setError(result.message || 'Verification failed')
            }
        } catch (err) {
            setError('An error occurred. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
            <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in duration-500">
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 shadow-xl shadow-blue-500/20 mb-4">
                        <GraduationCap className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight dark:text-white">EduVerse</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Digital Parent Portal</p>
                </div>

                <Card className="border-0 shadow-2xl shadow-blue-500/5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
                    <CardHeader>
                        <CardTitle className="text-xl">Parent Login</CardTitle>
                        <CardDescription>
                            {step === 'phone'
                                ? 'Enter your registered phone number to receive a secure OTP'
                                : `Enter the 6-digit code sent to +91 ${phone}`}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={step === 'phone' ? handleSendOtp : handleVerifyOtp} className="space-y-4">
                            {step === 'phone' ? (
                                <div className="space-y-2">
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                            <Phone className="w-4 h-4" />
                                        </div>
                                        <div className="absolute left-10 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium pr-3 border-r border-slate-200 dark:border-slate-700">
                                            +91
                                        </div>
                                        <Input
                                            type="tel"
                                            placeholder="Phone Number"
                                            className="pl-20 h-12 rounded-xl bg-slate-50 dark:bg-slate-950 border-0 focus-visible:ring-2 focus-visible:ring-blue-500 transition-all font-medium"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                                            required
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                            <Lock className="w-4 h-4" />
                                        </div>
                                        <Input
                                            type="text"
                                            placeholder="Enter 6-digit OTP"
                                            className="pl-10 h-12 rounded-xl bg-slate-50 dark:bg-slate-950 border-0 focus-visible:ring-2 focus-visible:ring-blue-500 transition-all text-center tracking-[0.5em] font-bold"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                            required
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setStep('phone')}
                                        className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
                                    >
                                        Change phone number
                                    </button>
                                </div>
                            )}

                            {error && (
                                <p className="text-sm font-medium text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                    {error}
                                </p>
                            )}

                            <Button
                                type="submit"
                                className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all flex items-center justify-center gap-2 group"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        {step === 'phone' ? 'Send Secure OTP' : 'Verify & Continue'}
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-3 gap-4 px-4">
                    <div className="flex flex-col items-center gap-2 text-center opacity-60">
                        <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        </div>
                        <p className="text-[10px] font-bold uppercase tracking-wider dark:text-white">Secure</p>
                    </div>
                    <div className="flex flex-col items-center gap-2 text-center opacity-60">
                        <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        </div>
                        <p className="text-[10px] font-bold uppercase tracking-wider dark:text-white">Encrypted</p>
                    </div>
                    <div className="flex flex-col items-center gap-2 text-center opacity-60">
                        <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        </div>
                        <p className="text-[10px] font-bold uppercase tracking-wider dark:text-white">Cloud API</p>
                    </div>
                </div>

                <p className="text-center text-slate-400 text-xs">
                    By logging in, you agree to our <br />
                    <a href="#" className="underline hover:text-slate-600">Terms of Service</a> and <a href="#" className="underline hover:text-slate-600">Privacy Policy</a>
                </p>
            </div>
        </div>
    )
}
