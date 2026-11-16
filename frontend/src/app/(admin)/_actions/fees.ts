'use server'

import { ApiResponse } from '@/lib/api'
import { delay } from './shared'

export interface FeeRecord {
    id: number
    studentName: string
    amount: number
    dueDate: string
    status: 'paid' | 'pending' | 'overdue'
}

const API_URL = 'http://127.0.0.1:8000/api'

export async function getUpcomingFees(): Promise<ApiResponse<FeeRecord[]>> {
    try {
        const res = await fetch(`${API_URL}/fees/upcoming`, { cache: 'no-store' });
        if (!res.ok) throw new Error('API request failed');
        const data = await res.json();
        return { success: true, data };
    } catch (e) {
        console.error(e);
        return { success: false, data: [], message: 'Failed to fetch upcoming fees' };
    }
}

// --- Fee Account Search & Deposit ---

export interface FeeHead {
    id: string
    name: string
    due: number
    paid: number
    balance: number
}

export interface FeeAccount {
    name: string
    admissionNo: string
    class: string
    parent: string
    photo: string
    totalBalance: number
    feeHeads: FeeHead[]
    recentActivity: Array<{ date: string; type: string; amount: number; method: string }>
}

export async function searchFeeAccount(query: string): Promise<ApiResponse<FeeAccount>> {
    if (!query) return { success: false, data: null as any, message: 'Query is empty' };

    try {
        const url = new URL(`${API_URL}/fees/search`);
        url.searchParams.append('query', query);

        const res = await fetch(url.toString(), { cache: 'no-store' });
        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || 'Student fee account not found');
        }

        return { success: true, data };
    } catch (e) {
        console.error(e);
        return { success: false, data: null as any, message: e instanceof Error ? e.message : 'Search failed' };
    }
}

export async function recordFeeDeposit(admissionNo: string, amounts: Record<string, number>, method: string): Promise<ApiResponse<{ receiptId: string }>> {
    try {
        const res = await fetch(`${API_URL}/fees/deposit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ admissionNo, amounts, method })
        });

        const result = await res.json();

        if (!res.ok) throw new Error(result.message || 'Deposit failed');

        return {
            success: true,
            data: { receiptId: result.receiptId },
            message: result.message
        };
    } catch (e) {
        console.error(e);
        return { success: false, data: null as any, message: e instanceof Error ? e.message : 'Deposit failed' };
    }
}

// --- Fee Structure ---

export interface ClassFeeStructure {
    grade: string
    baseTuition: number
    transportBase: number
    admissionFee: number
    examFees: number
}

const mockGradeFees: ClassFeeStructure[] = [
    { grade: 'Class 8', baseTuition: 4500, transportBase: 1200, admissionFee: 15000, examFees: 2000 },
    { grade: 'Class 9', baseTuition: 5000, transportBase: 1200, admissionFee: 15000, examFees: 2500 },
    { grade: 'Class 10', baseTuition: 5500, transportBase: 1200, admissionFee: 15000, examFees: 3000 },
    { grade: 'Class 11-SCI', baseTuition: 7500, transportBase: 1500, admissionFee: 25000, examFees: 5000 },
]

export async function getFeeStructure(): Promise<ApiResponse<ClassFeeStructure[]>> {
    try {
        const res = await fetch(`${API_URL}/fees/structure`, { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch fee structure');
        const data = await res.json();
        return { success: true, data };
    } catch (e) {
        return { success: false, data: [], message: 'Structure load failed' };
    }
}

export async function updateFeeStructure(structure: ClassFeeStructure[]): Promise<ApiResponse<ClassFeeStructure[]>> {
    await delay(1200)
    return {
        success: true,
        data: structure,
        message: 'Fee structure synchronized across all grades.'
    }
}
