'use server'

import { SalarySlip, BankAccount } from './types'

// Dummy Data
const dummySalarySlips: SalarySlip[] = [
    {
        id: '1',
        month: 'January',
        year: 2026,
        basicSalary: 45000,
        allowances: { hra: 9000, da: 4500, ta: 2500, medical: 1500, other: 1000 },
        deductions: { pf: 5400, tax: 3500, insurance: 500, other: 200 },
        grossSalary: 63500,
        netSalary: 53900,
        status: 'processing',
        paidOn: null,
    },
    {
        id: '2',
        month: 'December',
        year: 2025,
        basicSalary: 45000,
        allowances: { hra: 9000, da: 4500, ta: 2500, medical: 1500, other: 1000 },
        deductions: { pf: 5400, tax: 3500, insurance: 500, other: 200 },
        grossSalary: 63500,
        netSalary: 53900,
        status: 'paid',
        paidOn: '2025-12-28',
    },
    {
        id: '3',
        month: 'November',
        year: 2025,
        basicSalary: 45000,
        allowances: { hra: 9000, da: 4500, ta: 2500, medical: 1500, other: 1000 },
        deductions: { pf: 5400, tax: 3500, insurance: 500, other: 200 },
        grossSalary: 63500,
        netSalary: 53900,
        status: 'paid',
        paidOn: '2025-11-28',
    },
]

const dummyBankAccounts: BankAccount[] = [
    {
        id: '1',
        bankName: 'State Bank of India',
        accountNumber: 'XXXX XXXX XXXX 4521',
        ifsc: 'SBIN0001234',
        type: 'Salary',
        isPrimary: true,
        verified: true,
        logo: 'SBI',
        color: 'from-blue-500 to-blue-700',
    },
    {
        id: '2',
        bankName: 'HDFC Bank',
        accountNumber: 'XXXX XXXX XXXX 8923',
        ifsc: 'HDFC0002345',
        type: 'Savings',
        isPrimary: false,
        verified: true,
        logo: 'HDFC',
        color: 'from-red-500 to-rose-700',
    },
]

export async function getSalarySlips(year: number) {
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 500))
    return dummySalarySlips.filter(s => s.year === year)
}

export async function getBankAccounts() {
    return dummyBankAccounts
}

export async function addBankAccount(account: Omit<BankAccount, 'id' | 'verified' | 'logo' | 'color'>) {
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log('Added bank account:', account)
    return { success: true }
}
