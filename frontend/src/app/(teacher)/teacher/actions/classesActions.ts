'use server'

import { ClassInfo } from './types'

// Dummy Data
const dummyClasses: ClassInfo[] = [
    {
        name: 'Class 10',
        section: 'A',
        subject: 'Mathematics',
        students: 45,
        attendanceRate: 94,
        pendingTasks: { attendance: true, marks: false },
        isClassTeacher: true,
        schedule: 'Mon, Wed, Fri',
    },
    {
        name: 'Class 10',
        section: 'B',
        subject: 'Mathematics',
        students: 44,
        attendanceRate: 91,
        pendingTasks: { attendance: true, marks: true },
        isClassTeacher: false,
        schedule: 'Tue, Thu, Sat',
    },
    {
        name: 'Class 9',
        section: 'A',
        subject: 'Mathematics',
        students: 48,
        attendanceRate: 88,
        pendingTasks: { attendance: true, marks: true },
        isClassTeacher: false,
        schedule: 'Mon, Wed, Fri',
    },
    {
        name: 'Class 9',
        section: 'B',
        subject: 'Mathematics',
        students: 49,
        attendanceRate: 92,
        pendingTasks: { attendance: true, marks: false },
        isClassTeacher: false,
        schedule: 'Tue, Thu, Sat',
    },
]

export async function getClasses() {
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 300))
    return dummyClasses
}
