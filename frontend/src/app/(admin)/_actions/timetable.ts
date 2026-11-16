'use server'

import { ApiResponse } from '@/lib/api'
import { delay } from './shared'

export interface ScheduleSlot {
    subject: string
    teacherId: string
    teacherName: string
    color: string
}

export interface TimetableData {
    schedule: Record<string, Record<string, ScheduleSlot>>
    conflicts: number
    assignedSlots: number
}

const mockSchedule: Record<string, Record<string, ScheduleSlot>> = {
    'Monday': {
        'P1': { subject: 'Mathematics', teacherId: 'T001', teacherName: 'Meenkashi Iyer', color: 'bg-indigo-500' },
        'P2': { subject: 'Chemistry', teacherId: 'T008', teacherName: 'Dr. Verma', color: 'bg-emerald-600' },
        'P3': { subject: 'Physics', teacherId: 'T001', teacherName: 'Suresh Kumar', color: 'bg-rose-500' },
        'P5': { subject: 'English', teacherId: 'T012', teacherName: 'Anita Desai', color: 'bg-amber-500' },
    },
    'Tuesday': {
        'P1': { subject: 'Physics', teacherId: 'T001', teacherName: 'Suresh Kumar', color: 'bg-rose-500' },
        'P2': { subject: 'Mathematics', teacherId: 'T001', teacherName: 'Meenkashi Iyer', color: 'bg-indigo-500' },
        'P4': { subject: 'Biology', teacherId: 'T015', teacherName: 'Sneha Rao', color: 'bg-blue-600' },
    }
}

export async function getTimetableData(classId: string): Promise<ApiResponse<TimetableData>> {
    await delay(900)
    return {
        success: true,
        data: {
            schedule: mockSchedule,
            conflicts: 0,
            assignedSlots: 38
        }
    }
}
