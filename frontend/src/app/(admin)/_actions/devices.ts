'use server'

import { ApiResponse } from '@/lib/api'
import { delay } from './shared'

export interface DeviceIntegration {
    id: string
    name: string
    description: string
    type: 'payment' | 'attendance'
    status: 'connected' | 'disconnected'
    compatibleModels: string[]
    lastSync?: string
}

const mockDevices: DeviceIntegration[] = [
    {
        id: 'pos-1',
        name: 'POS Terminal',
        description: 'Connect a physical Point of Sale terminal to accept credit/debit card and UPI payments directly at the fee counter.',
        type: 'payment',
        status: 'disconnected',
        compatibleModels: ['Mswipe Wisepad 2', 'Pine Labs Plutus', 'Razorpay POS']
    },
    {
        id: 'biometric-1',
        name: 'Fingerprint Scanner',
        description: 'Sync biometric data from fingerprint scanners for automated student and staff attendance tracking.',
        type: 'attendance',
        status: 'connected',
        compatibleModels: ['Mantra MFS100', 'Morpho MSO 1300 E3', 'SecuGen Hamster Pro 20'],
        lastSync: '10 minutes ago'
    }
]

export async function getDeviceIntegrations(): Promise<ApiResponse<DeviceIntegration[]>> {
    await delay(600)
    return {
        success: true,
        data: mockDevices
    }
}

export async function toggleDeviceConnection(id: string): Promise<ApiResponse<DeviceIntegration>> {
    await delay(1000)
    const device = mockDevices.find(d => d.id === id)
    if (!device) return { success: false, data: null as any, message: 'Device not found' }

    const updated = {
        ...device,
        status: device.status === 'connected' ? 'disconnected' : 'connected' as any,
        lastSync: device.status === 'disconnected' ? 'just now' : device.lastSync
    }

    return {
        success: true,
        data: updated,
        message: `${device.name} ${updated.status === 'connected' ? 'connected' : 'disconnected'} successfully`
    }
}
