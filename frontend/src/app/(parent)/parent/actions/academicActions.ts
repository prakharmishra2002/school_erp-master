'use server'

export interface SubjectResult {
    subject: string
    marks: number
    maxMarks: number
    grade: string
    remarks: string
}

export interface ExamResults {
    examName: string
    date: string
    totalPercentage: number
    subjects: SubjectResult[]
}

const dummyResults: Record<string, ExamResults[]> = {
    'child_1': [
        {
            examName: 'Mid-Term Examination 2025-26',
            date: '2025-10-15',
            totalPercentage: 88.4,
            subjects: [
                { subject: 'Mathematics', marks: 92, maxMarks: 100, grade: 'A1', remarks: 'Excellent performance' },
                { subject: 'Science', marks: 85, maxMarks: 100, grade: 'A2', remarks: 'Good understanding' },
                { subject: 'English', marks: 88, maxMarks: 100, grade: 'A2', remarks: 'Very good' },
                { subject: 'Social Studies', marks: 91, maxMarks: 100, grade: 'A1', remarks: 'Outstanding' },
                { subject: 'Hindi', marks: 86, maxMarks: 100, grade: 'A2', remarks: 'Keep it up' },
            ]
        },
        {
            examName: 'Quarterly Assessment 1',
            date: '2025-07-20',
            totalPercentage: 85.2,
            subjects: [
                { subject: 'Mathematics', marks: 88, maxMarks: 100, grade: 'A2', remarks: 'Good' },
                { subject: 'Science', marks: 82, maxMarks: 100, grade: 'B1', remarks: 'Can do better' },
                { subject: 'English', marks: 85, maxMarks: 100, grade: 'A2', remarks: 'Good' },
                { subject: 'Social Studies', marks: 89, maxMarks: 100, grade: 'A2', remarks: 'Very good' },
                { subject: 'Hindi', marks: 82, maxMarks: 100, grade: 'B1', remarks: 'Needs improvement' },
            ]
        }
    ]
}

export async function getChildResults(childId: string) {
    await new Promise(resolve => setTimeout(resolve, 700))
    return dummyResults[childId] || []
}
