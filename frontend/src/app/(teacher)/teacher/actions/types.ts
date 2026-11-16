export interface Student {
    id: string
    name: string
    rollNo: number
    class: string
    section: string
    guardianName: string
    guardianPhone: string
    email: string
    attendance: number
    lastExamScore: number
    status: 'present' | 'absent' | 'leave'
    dob?: string
    bloodGroup?: string
    address?: string
    admissionDate?: string
}

export interface AttendanceRecord {
    id: string
    studentId: string
    name: string
    rollNo: number
    status: 'present' | 'absent' | 'late' | 'leave' | null
    lastStatus?: string
}

export interface ClassInfo {
    name: string
    section: string
    subject: string
    students: number
    attendanceRate: number
    pendingTasks: { attendance: boolean; marks: boolean }
    isClassTeacher?: boolean
    schedule: string
}

export interface Exam {
    id: string
    name: string
    date: string
    maxMarks: number
}

export interface StudentMark {
    id: string
    name: string
    rollNo: number
    marks: number | null
    maxMarks: number
}

export interface SalarySlip {
    id: string
    month: string
    year: number
    basicSalary: number
    allowances: {
        hra: number
        da: number
        ta: number
        medical: number
        other: number
    }
    deductions: {
        pf: number
        tax: number
        insurance: number
        other: number
    }
    grossSalary: number
    netSalary: number
    status: 'paid' | 'processing' | 'pending'
    paidOn: string | null
}

export interface BankAccount {
    id: string
    bankName: string
    accountNumber: string
    ifsc: string
    type: string
    isPrimary: boolean
    verified: boolean
    logo: string
    color: string
}

export interface ScheduleItem {
    time: string
    subject: string
    class: string
    status: 'completed' | 'current' | 'upcoming'
    room: string
}

export interface DashboardStats {
    classesToday: number
    totalStudents: number
    pendingMarks: number
    attendancePending: number
    rating: number
}

export interface PendingTask {
    task: string
    detail: string
    priority: 'high' | 'medium' | 'low'
    icon: string
}
