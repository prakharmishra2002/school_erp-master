'use server'

import { StudentMark, Exam } from './types'

// Dummy Data
const dummyExams: Exam[] = [
    { id: 'unit-test-2', name: 'Unit Test 2', date: '2025-01-15', maxMarks: 100 },
    { id: 'mid-term', name: 'Mid Term Exam', date: '2024-12-10', maxMarks: 100 },
    { id: 'unit-test-1', name: 'Unit Test 1', date: '2024-11-05', maxMarks: 50 },
]

const dummyMarks: Record<string, StudentMark[]> = {
    'Class 10-A': [
        { id: '1', name: 'Aarav Sharma', rollNo: 1, marks: null, maxMarks: 100 },
        { id: '2', name: 'Priya Patel', rollNo: 2, marks: null, maxMarks: 100 },
        { id: '3', name: 'Arjun Reddy', rollNo: 3, marks: null, maxMarks: 100 },
        { id: '4', name: 'Sneha Gupta', rollNo: 4, marks: null, maxMarks: 100 },
        { id: '5', name: 'Vikram Singh', rollNo: 5, marks: null, maxMarks: 100 },
        { id: '6', name: 'Ananya Iyer', rollNo: 6, marks: null, maxMarks: 100 },
        { id: '7', name: 'Rohan Desai', rollNo: 7, marks: null, maxMarks: 100 },
        { id: '8', name: 'Kavya Menon', rollNo: 8, marks: null, maxMarks: 100 },
        { id: '9', name: 'Aditya Kumar', rollNo: 9, marks: null, maxMarks: 100 },
        { id: '10', name: 'Meera Nair', rollNo: 10, marks: null, maxMarks: 100 },
    ],
}

export async function getExams() {
    return dummyExams
}

export async function getMarksList(className: string, examId: string) {
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 500))
    return dummyMarks[className] || []
}

export async function saveMarks(className: string, examId: string, marks: StudentMark[]) {
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log(`Saved marks for ${className} - ${examId}:`, marks)
    return { success: true }
}
