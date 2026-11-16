'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function sendOtp(phone: string) {
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 800))
    console.log(`Sending OTP to ${phone}: 123456`)
    return { success: true, message: 'OTP sent successfully' }
}

export async function verifyOtp(phone: string, otp: string) {
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Accept any 6-digit OTP for testing
    if (otp.length === 6) {
        const cookieStore = await cookies()
        cookieStore.set('parent_token', 'mock_token_123', {
            path: '/',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
        })
        return { success: true }
    }

    return { success: false, message: 'Invalid OTP' }
}

export async function logout() {
    const cookieStore = await cookies()
    cookieStore.delete('parent_token')
    redirect('/parent/login')
}

export async function getSession() {
    const cookieStore = await cookies()
    return cookieStore.get('parent_token')?.value
}
