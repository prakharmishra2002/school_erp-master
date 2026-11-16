'use server'

import { AttendanceRecord } from './types'

// Dummy Data
const dummyAttendance: Record<string, AttendanceRecord[]> = {
    'Class 10-A': [
        { id: '1', studentId: '1', name: 'Aarav Sharma', rollNo: 1, status: null },
        { id: '2', studentId: '2', name: 'Priya Patel', rollNo: 2, status: null },
        { id: '3', studentId: '3', name: 'Arjun Reddy', rollNo: 3, status: null },
        { id: '4', studentId: '4', name: 'Sneha Gupta', rollNo: 4, status: null },
        { id: '5', studentId: '5', name: 'Vikram Singh', rollNo: 5, status: null },
        { id: '6', studentId: '6', name: 'Ananya Iyer', rollNo: 6, status: null },
        { id: '7', studentId: '7', name: 'Rohan Desai', rollNo: 7, status: null },
        { id: '8', studentId: '8', name: 'Kavya Menon', rollNo: 8, status: null },
        { id: '9', studentId: '9', name: 'Aditya Kumar', rollNo: 9, status: null },
        { id: '10', studentId: '10', name: 'Meera Nair', rollNo: 10, status: null },
    ],
    'Class 10-B': [
        { id: '11', studentId: '11', name: 'Rahul Bose', rollNo: 1, status: null },
        { id: '12', studentId: '12', name: 'Sanya Mirza', rollNo: 2, status: null },
    ]
}

export async function getAttendanceList(className: string, date: string) {
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 500))

    // In a real app, we'd fetch based on date too
    return dummyAttendance[className] || []
}

export async function saveAttendance(className: string, date: string, records: AttendanceRecord[]) {
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log(`Saved attendance for ${className} on ${date}:`, records)
    return { success: true }
}

export async function getClasses() {
    return ['Class 10-A', 'Class 10-B', 'Class 9-A', 'Class 9-B']
}
