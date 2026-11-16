'use server'

export interface DayAttendance {
    date: string
    status: 'present' | 'absent' | 'late' | 'leave'
}

const dummyAttendance: Record<string, DayAttendance[]> = {
    'child_1': [
        { date: '2026-01-01', status: 'present' },
        { date: '2026-01-02', status: 'present' },
        { date: '2026-01-05', status: 'absent' },
        { date: '2026-01-06', status: 'present' },
        { date: '2026-01-07', status: 'present' },
        { date: '2026-01-08', status: 'late' },
        { date: '2026-01-09', status: 'present' },
        { date: '2026-01-12', status: 'present' },
        { date: '2026-01-13', status: 'leave' },
        { date: '2026-01-14', status: 'present' },
        { date: '2026-01-15', status: 'present' },
        { date: '2026-01-16', status: 'present' },
        { date: '2026-01-19', status: 'present' },
        { date: '2026-01-20', status: 'present' },
        { date: '2026-01-21', status: 'present' },
        { date: '2026-01-22', status: 'present' },
        { date: '2026-01-23', status: 'present' },
        { date: '2026-01-27', status: 'present' },
        { date: '2026-01-28', status: 'present' },
        { date: '2026-01-29', status: 'present' },
        { date: '2026-01-30', status: 'present' },
    ]
}

export async function getChildAttendance(childId: string, month: number, year: number) {
    await new Promise(resolve => setTimeout(resolve, 600))
    return dummyAttendance[childId] || []
}

export async function submitLeaveRequest(data: {
    childId: string,
    leaveType: string,
    startDate: string,
    endDate: string,
    reason: string
}) {
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log('Leave Request Submitted:', data)
    return { success: true, message: 'Leave request submitted successfully!' }
}
