'use server'

export interface TimetableSlot {
    time: string
    subject: string
    teacher: string
    room: string
}

export interface DaySchedule {
    day: string
    slots: TimetableSlot[]
}

const dummyTimetable: Record<string, DaySchedule[]> = {
    'child_1': [
        {
            day: 'Monday',
            slots: [
                { time: '08:00 AM', subject: 'Mathematics', teacher: 'Rajesh Sharma', room: '301' },
                { time: '09:00 AM', subject: 'Science', teacher: 'Sunita Verma', room: 'Labs' },
                { time: '10:15 AM', subject: 'English', teacher: 'Amit Khurana', room: '202' },
                { time: '11:15 AM', subject: 'History', teacher: 'Priya Das', room: '105' },
            ]
        },
        {
            day: 'Tuesday',
            slots: [
                { time: '08:00 AM', subject: 'Science', teacher: 'Sunita Verma', room: 'Labs' },
                { time: '09:00 AM', subject: 'Mathematics', teacher: 'Rajesh Sharma', room: '301' },
                { time: '10:15 AM', subject: 'Computer', teacher: 'Vikram Singh', room: 'IT Hub' },
                { time: '11:15 AM', subject: 'Physical Ed.', teacher: 'Sanjay P.', room: 'Ground' },
            ]
        }
    ]
}

export async function getChildTimetable(childId: string) {
    await new Promise(resolve => setTimeout(resolve, 400))
    return dummyTimetable[childId] || []
}
