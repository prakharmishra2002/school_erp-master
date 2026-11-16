'use server'

import { ApiResponse } from '@/lib/api'
import { delay } from './shared'

export interface SalarySlab {
    designation: string
    baseSalary: number
    allowances: number
    deductions: number
    netPay: number
}

const mockSlabs: SalarySlab[] = [
    { designation: 'Senior Teacher', baseSalary: 35000, allowances: 5000, deductions: 2500, netPay: 37500 },
    { designation: 'HOD - Department', baseSalary: 45000, allowances: 8000, deductions: 3500, netPay: 49500 },
    { designation: 'Primary Teacher', baseSalary: 25000, allowances: 3000, deductions: 1500, netPay: 26500 },
    { designation: 'Admin Staff', baseSalary: 22000, allowances: 2000, deductions: 1200, netPay: 22800 },
]

export interface PayrollStats {
    totalPayroll: string
    staffCount: number
    totalDeductions: string
    bonusIncentives: string
}

export async function getPayrollStats(): Promise<ApiResponse<PayrollStats>> {
    await delay(700)
    return {
        success: true,
        data: {
            totalPayroll: '₹18.4L',
            staffCount: 84,
            totalDeductions: '₹1.8L',
            bonusIncentives: '₹45,000'
        }
    }
}

export async function getSalarySlabs(): Promise<ApiResponse<SalarySlab[]>> {
    await delay(600)
    return {
        success: true,
        data: mockSlabs
    }
}
