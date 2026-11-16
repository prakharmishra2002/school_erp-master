'use server'

import { Student } from './types'

// Dummy Data
const dummyStudents: Student[] = [
    {
        id: '1',
        name: 'Aarav Sharma',
        rollNo: 1,
        class: 'Class 10',
        section: 'A',
        guardianName: 'Rajesh Sharma',
        guardianPhone: '+91 98765 43210',
        email: 'rajesh.sharma@email.com',
        attendance: 96,
        lastExamScore: 89,
        status: 'present',
        dob: '2010-03-15',
        bloodGroup: 'B+',
        address: '123, Green Valley, Delhi'
    },
    {
        id: '2',
        name: 'Priya Patel',
        rollNo: 2,
        class: 'Class 10',
        section: 'A',
        guardianName: 'Amit Patel',
        guardianPhone: '+91 98765 43211',
        email: 'amit.patel@email.com',
        attendance: 92,
        lastExamScore: 95,
        status: 'present',
        dob: '2010-05-20',
        bloodGroup: 'O+',
        address: '456, Silver Springs, Delhi'
    },
    {
        id: '3',
        name: 'Arjun Reddy',
        rollNo: 3,
        class: 'Class 10',
        section: 'A',
        guardianName: 'Venkat Reddy',
        guardianPhone: '+91 98765 43212',
        email: 'venkat.reddy@email.com',
        attendance: 88,
        lastExamScore: 78,
        status: 'absent',
        dob: '2010-07-10',
        bloodGroup: 'A+',
        address: '789, Rose Garden, Hyderabad'
    },
    {
        id: '4',
        name: 'Sneha Gupta',
        rollNo: 4,
        class: 'Class 10',
        section: 'A',
        guardianName: 'Ramesh Gupta',
        guardianPhone: '+91 98765 43213',
        email: 'ramesh.gupta@email.com',
        attendance: 94,
        lastExamScore: 92,
        status: 'present',
        dob: '2010-09-05',
        bloodGroup: 'AB+',
        address: '101, Blue Hills, Bangalore'
    },
    {
        id: '5',
        name: 'Vikram Singh',
        rollNo: 5,
        class: 'Class 10',
        section: 'A',
        guardianName: 'Harpreet Singh',
        guardianPhone: '+91 98765 43214',
        email: 'harpreet.singh@email.com',
        attendance: 72,
        lastExamScore: 65,
        status: 'leave',
        dob: '2010-11-12',
        bloodGroup: 'B-',
        address: '202, Pine View, Chandigarh'
    },
    {
        id: '6',
        name: 'Ananya Iyer',
        rollNo: 6,
        class: 'Class 10',
        section: 'A',
        guardianName: 'Suresh Iyer',
        guardianPhone: '+91 98765 43215',
        email: 'suresh.iyer@email.com',
        attendance: 98,
        lastExamScore: 97,
        status: 'present',
        dob: '2011-01-25',
        bloodGroup: 'O-',
        address: '303, Palm Grove, Chennai'
    },
    {
        id: '7',
        name: 'Rohan Desai',
        rollNo: 7,
        class: 'Class 10',
        section: 'B',
        guardianName: 'Kiran Desai',
        guardianPhone: '+91 98765 43216',
        email: 'kiran.desai@email.com',
        attendance: 90,
        lastExamScore: 82,
        status: 'present',
        dob: '2011-03-30',
        bloodGroup: 'A-',
        address: '404, Sea Breeze, Mumbai'
    },
    {
        id: '8',
        name: 'Kavya Menon',
        rollNo: 8,
        class: 'Class 10',
        section: 'B',
        guardianName: 'Anil Menon',
        guardianPhone: '+91 98765 43217',
        email: 'anil.menon@email.com',
        attendance: 95,
        lastExamScore: 91,
        status: 'present',
        dob: '2011-06-14',
        bloodGroup: 'B+',
        address: '505, Hill Crest, Kochi'
    },
]

export async function getStudents(searchQuery?: string, className?: string) {
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 300))

    let students = [...dummyStudents]

    if (className && className !== 'all') {
        students = students.filter(s => `${s.class}-${s.section}` === className)
    }

    if (searchQuery) {
        const query = searchQuery.toLowerCase()
        students = students.filter(s =>
            s.name.toLowerCase().includes(query) ||
            s.rollNo.toString().includes(query) ||
            s.guardianName.toLowerCase().includes(query)
        )
    }

    return students
}

export async function getStudentById(id: string) {
    return dummyStudents.find(s => s.id === id)
}
