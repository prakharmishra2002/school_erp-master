'use server'

import { TeacherRating } from './types'

export interface ChildTeacher {
    id: string
    name: string
    subject: string
    qualification: string
    photoUrl?: string
    isClassTeacher: boolean
}

const dummyTeachers: Record<string, ChildTeacher[]> = {
    'child_1': [
        { id: 't1', name: 'Rajesh Sharma', subject: 'Mathematics', qualification: 'M.Sc, B.Ed', isClassTeacher: true },
        { id: 't2', name: 'Sunita Verma', subject: 'Science', qualification: 'Ph.D, Physics', isClassTeacher: false },
        { id: 't3', name: 'Amit Khurana', subject: 'English', qualification: 'M.A, English', isClassTeacher: false },
        { id: 't4', name: 'Priya Das', subject: 'Social Studies', qualification: 'M.A, History', isClassTeacher: false },
    ]
}

export async function getChildTeachers(childId: string) {
    await new Promise(resolve => setTimeout(resolve, 500))
    return dummyTeachers[childId] || []
}

export async function submitTeacherRating(rating: TeacherRating) {
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log('Submitted Rating:', rating)
    return { success: true }
}
