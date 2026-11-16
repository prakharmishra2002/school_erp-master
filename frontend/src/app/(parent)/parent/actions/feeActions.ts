'use server'

import { FeeItem } from './types'

export interface PaymentHistory {
    id: string
    date: string
    amount: number
    method: string
    status: 'success' | 'failed'
    receiptUrl: string
}

const dummyFees: Record<string, FeeItem[]> = {
    'child_1': [
        { id: 'fee_1', category: 'Tuition Fee (Q4)', amount: 8500, dueDate: '2026-02-15', status: 'pending' },
        { id: 'fee_2', category: 'Library Fee', amount: 500, dueDate: '2026-02-15', status: 'pending' },
        { id: 'fee_3', category: 'Transport Fee (Feb)', amount: 3500, dueDate: '2026-02-15', status: 'pending' },
        { id: 'fee_4', category: 'Tuition Fee (Q3)', amount: 8500, dueDate: '2025-11-15', status: 'paid' },
    ]
}

const dummyHistory: Record<string, PaymentHistory[]> = {
    'child_1': [
        { id: 'pay_1', date: '2025-11-10', amount: 8500, method: 'Online / UPI', status: 'success', receiptUrl: '#' },
        { id: 'pay_2', date: '2025-08-12', amount: 12000, method: 'Credit Card', status: 'success', receiptUrl: '#' },
    ]
}

export async function getChildFees(childId: string) {
    await new Promise(resolve => setTimeout(resolve, 500))
    return dummyFees[childId] || []
}

export async function getPaymentHistory(childId: string) {
    return dummyHistory[childId] || []
}
