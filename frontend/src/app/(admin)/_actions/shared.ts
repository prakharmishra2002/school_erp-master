'use server'

// Helper to simulate network latency
export const delay = async (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
