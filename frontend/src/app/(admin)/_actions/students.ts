'use server'

import { ApiResponse, PaginatedResponse } from '@/lib/api'

export interface Student {
    id: number
    admissionNo: string
    rollNo: string
    firstName: string
    lastName: string
    className: string
    section: string
    status: 'active' | 'left' | 'graduated' | 'suspended'
    phone: string
    email: string
}

const API_URL = 'http://127.0.0.1:8000/api'

export async function getStudents(query?: string, page: number = 1): Promise<PaginatedResponse<Student>> {
    try {
        const url = new URL(`${API_URL}/students`);
        url.searchParams.append('page', page.toString());
        if (query) url.searchParams.append('search', query);

        const res = await fetch(url.toString(), { cache: 'no-store' });
        if (!res.ok) throw new Error("Failed to fetch students from API");

        const data = await res.json();

        const items = data.data.map((s: any) => ({
            id: s.id,
            admissionNo: s.admission_number,
            rollNo: s.roll_number || 'N/A',
            firstName: s.first_name,
            lastName: s.last_name,
            className: s.class?.name || 'Unassigned',
            section: s.section?.name || 'Unassigned',
            status: s.status || 'active',
            phone: s.guardian?.phone || s.user?.phone || 'N/A',
            email: s.user?.email || 'N/A'
        }));

        return {
            success: true,
            data: {
                items,
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
            error: e instanceof Error ? e.message : 'Failed to load students'
        }
    }
}

export async function createStudent(data: any): Promise<ApiResponse<Student>> {
    try {
        const res = await fetch(`${API_URL}/students`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await res.json();

        if (!res.ok) {
            throw new Error(result.message || "Validation failed");
        }

        const student: Student = {
            id: result.id,
            admissionNo: result.admission_number,
            rollNo: result.roll_number || 'N/A',
            firstName: result.first_name,
            lastName: result.last_name,
            className: result.class?.name || 'Unassigned',
            section: result.section?.name || 'Unassigned',
            status: result.status || 'active',
            phone: 'N/A',
            email: result.user?.email || 'N/A'
        };

        return {
            success: true,
            data: student,
            message: "Student enrolled successfully"
        };
    } catch (e) {
        console.error(e);
        return {
            success: false,
            data: null as any,
            message: e instanceof Error ? e.message : 'Failed to enroll student'
        };
    }
}

export async function updateStudentStatus(id: number, status: Student['status']): Promise<ApiResponse<Student>> {
    try {
        const res = await fetch(`${API_URL}/students/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({ status })
        });
        if (!res.ok) throw new Error("Update failed");
        const data = await res.json();
        return { success: true, data: data as Student, message: "Status updated" };
    } catch (e) {
        return { success: false, data: null as any, message: 'Update failed' };
    }
}
