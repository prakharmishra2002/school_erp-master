'use server'

import { ApiResponse } from '@/lib/api'
import { delay } from './shared'

export interface DashboardStats {
    totalStudents: number
    presentToday: number
    totalTeachers: number
    monthlyRevenue: number
    recentAlerts: Array<{ id: number; message: string; type: 'info' | 'warning' | 'error' }>
}

export async function getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    await delay(600)
    return {
        success: true,
        data: {
            totalStudents: 1280,
            presentToday: 1245,
            totalTeachers: 85,
            monthlyRevenue: 450000,
            recentAlerts: [
                { id: 1, message: 'Class 10-A attendance below 90%', type: 'warning' },
                { id: 2, message: 'New admission portal is live', type: 'info' },
                { id: 3, message: 'Server maintenance scheduled for Sunday', type: 'info' },
            ]
        }
    }
}
