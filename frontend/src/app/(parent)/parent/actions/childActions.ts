'use server'

import { ParentChild, ParentNotification } from './types'

const dummyChildren: ParentChild[] = [
    {
        id: 'child_1',
        name: 'Aarav Kumar',
        rollNo: 12,
        class: 'Class 10',
        section: 'A',
        attendance: 94.5,
        pendingFees: 12500,
        lastResult: '88%'
    },
    {
        id: 'child_2',
        name: 'Ishani Kumar',
        rollNo: 8,
        class: 'Class 7',
        section: 'B',
        attendance: 91.2,
        pendingFees: 0,
        lastResult: '92%'
    }
]

const dummyNotifications: ParentNotification[] = [
    {
        id: '1',
        title: 'Fee Reminder',
        message: 'Second term fees for Aarav is due by Feb 15th.',
        date: '2026-01-28',
        type: 'fee',
        isRead: false
    },
    {
        id: '2',
        title: 'New Announcement',
        message: 'School will be closed on Friday due to Republic Day celebration.',
        date: '2026-01-26',
        type: 'announcement',
        isRead: true
    }
]

export async function getChildren() {
    await new Promise(resolve => setTimeout(resolve, 500))
    return dummyChildren
}

export async function getNotifications() {
    return dummyNotifications
}
