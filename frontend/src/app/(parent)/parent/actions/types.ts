export interface ParentChild {
    id: string
    name: string
    rollNo: number
    class: string
    section: string
    photoUrl?: string
    attendance: number
    pendingFees: number
    lastResult: string
}

export interface ParentNotification {
    id: string
    title: string
    message: string
    date: string
    type: 'announcement' | 'alert' | 'fee' | 'attendance'
    isRead: boolean
}

export interface TeacherRating {
    teacherId: string
    teacherName: string
    subject: string
    rating: number
    comment: string
    date: string
}

export interface FeeItem {
    id: string
    category: string
    amount: number
    dueDate: string
    status: 'paid' | 'pending' | 'overdue'
}
