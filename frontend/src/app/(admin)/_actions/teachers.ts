'use server'

import { PaginatedResponse, ApiResponse } from '@/lib/api'
import { delay } from './shared'

export interface Teacher {
    id: number
    employeeId: string
    firstName: string
    lastName: string
    subject: string
    className: string
    status: 'active' | 'on-leave' | 'resigned'
    phone: string
    email: string
}

const mockTeachers: Teacher[] = [
    { id: 1, employeeId: 'T2026001', firstName: 'Rajesh', lastName: 'Kumar', subject: 'Mathematics', className: 'Class 10-A', status: 'active', phone: '+91 98765 00001', email: 'rajesh.k@school.edu' },
    { id: 2, employeeId: 'T2026002', firstName: 'Sunita', lastName: 'Sharma', subject: 'Science', className: 'Class 9-B', status: 'active', phone: '+91 98765 00002', email: 'sunita.s@school.edu' },
    { id: 3, employeeId: 'T2026003', firstName: 'Vikram', lastName: 'Singh', subject: 'History', className: 'Class 8-C', status: 'on-leave', phone: '+91 98765 00003', email: 'vikram.s@school.edu' },
]

export async function getTeachers(page = 1, limit = 10): Promise<PaginatedResponse<Teacher>> {
    try {
        const res = await fetch(`http://127.0.0.1:8000/api/teachers?page=${page}&per_page=${limit}`, { cache: 'no-store' });
        if (!res.ok) throw new Error("Failed to fetch teachers from API");
        const data = await res.json();

        const items = data.data.map((t: any) => ({
            id: t.id,
            employeeId: t.employee_id,
            firstName: t.first_name,
            lastName: t.last_name,
            subject: t.department,
            className: t.designation,
            status: t.status,
            phone: t.user?.phone || 'N/A',
            email: t.user?.email || 'N/A'
        }));

        return {
            success: true,
            data: {
                items: items,
                total: data.total,
                page: data.current_page,
                per_page: data.per_page,
                last_page: data.last_page
            }
        };
    } catch (e) {
        console.error(e);
        return {
            success: false,
            data: { items: [], total: 0, page: 1, per_page: 10, last_page: 1 },
            error: e instanceof Error ? e.message : 'Failed to fetch teachers from API'
        };
    }
}

export async function createTeacher(data: any): Promise<ApiResponse<Teacher>> {
    try {
        const res = await fetch(`http://127.0.0.1:8000/api/teachers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await res.json();

        if (!res.ok) {
            // Laravel validation errors often come as result.errors
            const errorMsg = result.message || "Validation failed";
            throw new Error(errorMsg);
        }

        const teacher = {
            id: result.id,
            employeeId: result.employee_id,
            firstName: result.first_name,
            lastName: result.last_name,
            subject: result.department,
            className: result.designation,
            status: result.status,
            phone: result.user?.phone || 'N/A',
            email: result.user?.email || 'N/A'
        };

        return {
            success: true,
            data: teacher,
            message: "Teacher created successfully"
        };

    } catch (e) {
        console.error(e);
        return {
            success: false,
            data: null as any,
            message: e instanceof Error ? e.message : 'Failed to create teacher'
        };
    }
}
