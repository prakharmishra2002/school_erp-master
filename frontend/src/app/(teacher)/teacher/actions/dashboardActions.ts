'use server'

import { DashboardStats, ScheduleItem, ClassInfo, PendingTask } from './types'

// Dummy Data
const dummyStats: DashboardStats = {
    classesToday: 6,
    totalStudents: 186,
    pendingMarks: 2,
    attendancePending: 4,
    rating: 4.8,
}

const dummySchedule: ScheduleItem[] = [
    { time: '8:00 AM', subject: 'Mathematics', class: 'Class 10-A', status: 'completed', room: 'Room 301' },
    { time: '9:00 AM', subject: 'Mathematics', class: 'Class 9-B', status: 'completed', room: 'Room 205' },
    { time: '10:00 AM', subject: 'Mathematics', class: 'Class 8-A', status: 'current', room: 'Room 102' },
    { time: '11:00 AM', subject: 'Mathematics', class: 'Class 10-B', status: 'upcoming', room: 'Room 301' },
    { time: '12:00 PM', subject: 'Lunch Break', class: '—', status: 'upcoming', room: '' },
    { time: '1:00 PM', subject: 'Mathematics', class: 'Class 9-A', status: 'upcoming', room: 'Room 204' },
]

const dummyPendingTasks: PendingTask[] = [
    { task: 'Mark Attendance', detail: 'Class 8-A, 9-A, 9-B, 10-B — Today', priority: 'high', icon: 'CalendarCheck' },
    { task: 'Enter Marks', detail: 'Unit Test 2 — Class 10-A', priority: 'medium', icon: 'FileText' },
    { task: 'Enter Marks', detail: 'Unit Test 2 — Class 10-B', priority: 'medium', icon: 'FileText' },
    { task: 'Review Results', detail: 'Mid-term Analysis Report', priority: 'low', icon: 'GraduationCap' },
]

export async function getDashboardStats() {
    await new Promise(resolve => setTimeout(resolve, 300))
    return dummyStats
}

export async function getSchedule() {
    return dummySchedule
}

export async function getPendingTasks() {
    return dummyPendingTasks
}
