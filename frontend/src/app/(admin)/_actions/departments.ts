'use server'

import { ApiResponse } from '@/lib/api'
import { delay } from './shared'

export interface Department {
    id: number
    name: string
    code: string
    hodName: string
    staffCount: number
    studentFocus?: string
    status: 'active' | 'archived'
    lastUpdate: string
    iconColor: string
}

const mockDepartments: Department[] = [
    { id: 1, name: 'Science Faculty', code: 'SCI-ACAD', hodName: 'Suresh Kumar', staffCount: 18, studentFocus: 'Class 6-12', status: 'active', lastUpdate: '2 hours ago', iconColor: 'bg-indigo-600' },
    { id: 2, name: 'Mathematics Wing', code: 'MATH-ACAD', hodName: 'Meenkashi Iyer', staffCount: 12, studentFocus: 'Class 1-12', status: 'active', lastUpdate: '1 day ago', iconColor: 'bg-purple-600' },
    { id: 3, name: 'Accounts & Finance', code: 'FIN-ADMIN', hodName: 'Rajesh Khanna', staffCount: 5, status: 'active', lastUpdate: '3 days ago', iconColor: 'bg-emerald-600' },
    { id: 4, name: 'Human Resources', code: 'HR-ADMIN', hodName: 'Sunita Mehra', staffCount: 4, status: 'active', lastUpdate: '1 week ago', iconColor: 'bg-rose-500' },
    { id: 5, name: 'Operations & Security', code: 'OPS-ADMIN', hodName: 'Vikram Singh', staffCount: 15, status: 'active', lastUpdate: '2 hours ago', iconColor: 'bg-amber-500' },
    { id: 6, name: 'IT Infrastructure', code: 'IT-ADMIN', hodName: 'Alok Sharma', staffCount: 3, status: 'active', lastUpdate: '4 days ago', iconColor: 'bg-blue-600' },
]

export async function getDepartments(): Promise<ApiResponse<Department[]>> {
    await delay(800)
    return {
        success: true,
        data: mockDepartments
    }
}
