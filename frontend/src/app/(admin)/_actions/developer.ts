'use server'

import { ApiResponse } from '@/lib/api'

const API_URL = 'http://127.0.0.1:8000/api'

export async function getSystemLogs(page: number = 1): Promise<ApiResponse<any>> {
    try {
        const res = await fetch(`${API_URL}/developer/logs?page=${page}`, {
            cache: 'no-store'
            // We would pass the Authorization Bearer token here in a real deployment
            // via cookies or headers. For test dev without auth, it will just pass through.
        });
        if (!res.ok) throw new Error('API request failed');
        const data = await res.json();
        return { success: true, data };
    } catch (e) {
        console.error(e);
        return { success: false, data: null as any, message: 'Failed to fetch logs' };
    }
}

export async function getDeveloperUsers(): Promise<ApiResponse<any[]>> {
    try {
        const res = await fetch(`${API_URL}/developer/users`, { cache: 'no-store' });
        if (!res.ok) throw new Error('API request failed');
        const data = await res.json();
        return { success: true, data };
    } catch (e) {
        console.error(e);
        return { success: false, data: [], message: 'Failed to fetch users' };
    }
}

export async function impersonateUser(userId: number): Promise<ApiResponse<{ token: string, user: any }>> {
    try {
        const res = await fetch(`${API_URL}/developer/impersonate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ user_id: userId })
        });

        const result = await res.json();
        if (!res.ok) throw new Error(result.message || 'Impersonation failed');

        return {
            success: true,
            data: { token: result.token, user: result.user },
            message: result.message
        };
    } catch (e) {
        console.error(e);
        return { success: false, data: null as any, message: e instanceof Error ? e.message : 'Impersonation failed' };
    }
}
