'use server'

import { ApiResponse } from '@/lib/api'

export interface Section {
    id: number
    name: string
    capacity: number
    enrolled: number
}

export interface ClassItem {
    id: number
    name: string
    shortName: string
    sections: Section[]
}

const API_URL = 'http://127.0.0.1:8000/api'

export async function getClasses(): Promise<ApiResponse<ClassItem[]>> {
    try {
        const res = await fetch(`${API_URL}/classes`, { cache: 'no-store' });
        if (!res.ok) throw new Error("Failed to fetch classes from API");

        const data = await res.json();

        // Temporarily, we will just fetch sections for each class individually or assume they come with `show` call.
        // Let's modify the Laravel controller to include sections in index() to avoid N+1 and simplify here if needed.
        // Actually, our ClassController index doesn't load sections right now. Let's fetch sections separately or modify backend.
        // For now, let's just return the classes with empty sections, and we can adjust the backend to load relations.

        const items: ClassItem[] = data.map((c: any) => ({
            id: c.id,
            name: c.name,
            shortName: c.name, // Using name as shortName if backend doesn't have shortName right now
            sections: [] // Will be populated with sections data if backend `with('sections')` is used
        }));

        // Fetching all sections to attach to classes
        const sectionsRes = await fetch(`${API_URL}/sections`, { cache: 'no-store' });
        if (sectionsRes.ok) {
            const sectionsData = await sectionsRes.json();
            const sectionsMap = sectionsData.reduce((acc: any, sec: any) => {
                if (!acc[sec.class_id]) acc[sec.class_id] = [];
                acc[sec.class_id].push({
                    id: sec.id,
                    name: sec.name,
                    capacity: sec.capacity,
                    enrolled: 0 // We don't have enrolled count yet
                });
                return acc;
            }, {});

            items.forEach(c => {
                if (sectionsMap[c.id]) {
                    c.sections = sectionsMap[c.id];
                }
            });
        }

        return {
            success: true,
            data: items,
            message: "Classes fetched successfully"
        };
    } catch (e) {
        console.error(e);
        return {
            success: false,
            data: [],
            message: e instanceof Error ? e.message : 'Failed to fetch classes'
        };
    }
}

export async function createClass(data: { name: string, numeric_value: number, capacity: number }): Promise<ApiResponse<ClassItem>> {
    try {
        const res = await fetch(`${API_URL}/classes`, {
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

        const newClass = {
            id: result.id,
            name: result.name,
            shortName: result.name,
            sections: []
        };

        return {
            success: true,
            data: newClass,
            message: "Class created successfully"
        };

    } catch (e) {
        console.error(e);
        return {
            success: false,
            data: null as any,
            message: e instanceof Error ? e.message : 'Failed to create class'
        };
    }
}

export async function createSection(data: { class_id: number, name: string, capacity: number }): Promise<ApiResponse<Section>> {
    try {
        const res = await fetch(`${API_URL}/sections`, {
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

        const newSection = {
            id: result.id,
            name: result.name,
            capacity: result.capacity,
            enrolled: 0
        };

        return {
            success: true,
            data: newSection,
            message: "Section created successfully"
        };

    } catch (e) {
        console.error(e);
        return {
            success: false,
            data: null as any,
            message: e instanceof Error ? e.message : 'Failed to create section'
        };
    }
}
