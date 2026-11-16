'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    ChevronRight,
    CreditCard,
    Fingerprint,
    Cpu,
    CheckCircle2,
    XCircle,
    Settings2,
    RefreshCw,
    HelpCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { getDeviceIntegrations, toggleDeviceConnection, DeviceIntegration } from '@/app/(admin)/actions'

export default function DeviceIntegrationsPage() {
    const [devices, setDevices] = useState<DeviceIntegration[]>([])
    const [loading, setLoading] = useState(true)
    const [actionId, setActionId] = useState<string | null>(null)

    useEffect(() => {
        fetchDevices()
    }, [])

    const fetchDevices = async () => {
        setLoading(true)
        const response = await getDeviceIntegrations()
        if (response.success) {
            setDevices(response.data)
        }
        setLoading(false)
    }

    const handleToggle = async (id: string) => {
        setActionId(id)
        const response = await toggleDeviceConnection(id)
        if (response.success) {
            toast.success(response.message)
            setDevices(prev => prev.map(d => d.id === id ? response.data : d))
        } else {
            toast.error(response.message || 'Action failed')
        }
        setActionId(null)
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Link href="/admin/dashboard" className="text-sm font-medium text-[var(--foreground-secondary)] hover:text-indigo-600 transition-colors">Admin Dashboard</Link>
                        <ChevronRight className="w-4 h-4 text-[var(--foreground-muted)]" />
                        <span className="text-sm font-bold text-indigo-600 uppercase tracking-widest">Hardware</span>
                    </div>
                    <h1 className="text-3xl font-black tracking-tight text-[var(--foreground)]">Device Integrations</h1>
                    <p className="text-[var(--foreground-secondary)] mt-1 font-medium">Manage and configure external hardware nodes for payments and attendance.</p>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        onClick={fetchDevices}
                        disabled={loading}
                        className="h-12 rounded-2xl border-[var(--border)] font-bold text-[var(--foreground-secondary)] hover:text-indigo-600 transition-all"
                    >
                        <RefreshCw className={cn("w-5 h-5 mr-2", loading && "animate-spin")} />
                        Refresh Status
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {loading ? (
                    // Skeleton Loaders
                    [1, 2].map((i) => (
                        <div key={i} className="h-[350px] rounded-[2.5rem] bg-[var(--card-background)] animate-pulse border border-[var(--border)]" />
                    ))
                ) : (
                    devices.map((device) => (
                        <Card key={device.id} className="border-none bg-[var(--card-background)] rounded-[2.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-none overflow-hidden flex flex-col group transition-all hover:shadow-indigo-500/10 dark:hover:shadow-indigo-500/5">
                            <CardHeader className="p-8 pb-4">
                                <div className="flex items-start justify-between">
                                    <div className={cn(
                                        "w-16 h-16 rounded-3xl flex items-center justify-center transition-colors shadow-lg",
                                        device.type === 'payment' ? "bg-amber-50 text-amber-600 dark:bg-amber-900/20" : "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20"
                                    )}>
                                        {device.type === 'payment' ? <CreditCard className="w-8 h-8" /> : <Fingerprint className="w-8 h-8" />}
                                    </div>
                                    <Badge className={cn(
                                        "font-black uppercase tracking-widest text-[10px] px-3 py-1 rounded-full border-none",
                                        device.status === 'connected' ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30" : "bg-rose-50 text-rose-600 dark:bg-rose-900/30"
                                    )}>
                                        {device.status === 'connected' ? (
                                            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3" /> Online</span>
                                        ) : (
                                            <span className="flex items-center gap-1.5"><XCircle className="w-3 h-3" /> Offline</span>
                                        )}
                                    </Badge>
                                </div>
                                <div className="mt-6">
                                    <CardTitle className="text-2xl font-black text-[var(--foreground)]">{device.name}</CardTitle>
                                    <CardDescription className="text-[var(--foreground-secondary)] font-medium mt-2 leading-relaxed h-12 overflow-hidden">
                                        {device.description}
                                    </CardDescription>
                                </div>
                            </CardHeader>

                            <CardContent className="p-8 pt-4 space-y-6 flex-1">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between text-xs font-bold">
                                        <span className="text-[var(--foreground-muted)] uppercase tracking-widest">Compatible Models</span>
                                        <HelpCircle className="w-4 h-4 text-[var(--foreground-muted)] cursor-help" />
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {device.compatibleModels.map((model) => (
                                            <Badge key={model} variant="outline" className="rounded-xl font-bold py-1 bg-[var(--background-secondary)]/50 border-[var(--border)] text-[var(--foreground-secondary)]">
                                                {model}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                {device.lastSync && (
                                    <div className="flex items-center gap-2 text-[10px] font-black text-indigo-600/70 border-t border-[var(--border)] pt-4 uppercase tracking-tight">
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                                        Last Synchronized: {device.lastSync}
                                    </div>
                                )}

                                <div className="pt-4 flex gap-3 mt-auto">
                                    <Button
                                        className={cn(
                                            "h-12 flex-1 rounded-2xl font-bold transition-all shadow-lg",
                                            device.status === 'connected'
                                                ? "bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20"
                                                : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20"
                                        )}
                                        onClick={() => handleToggle(device.id)}
                                        disabled={actionId === device.id}
                                    >
                                        {actionId === device.id ? (
                                            <RefreshCw className="w-5 h-5 animate-spin" />
                                        ) : (
                                            device.status === 'connected' ? 'Disconnect Device' : 'Connect Now'
                                        )}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="h-12 w-12 p-0 rounded-2xl border-[var(--border)] hover:bg-[var(--background-secondary)]"
                                    >
                                        <Settings2 className="w-5 h-5 text-[var(--foreground-secondary)]" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            <Card className="border-none bg-slate-900 dark:bg-indigo-900/20 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 text-white/5 group-hover:text-white/10 transition-colors pointer-events-none">
                    <Cpu className="w-64 h-64 rotate-12" />
                </div>
                <div className="relative z-10 max-w-2xl">
                    <h3 className="text-xl font-black mb-2">Need custom integration?</h3>
                    <p className="text-slate-400 dark:text-indigo-200 font-medium leading-relaxed">
                        If you are using a device not listed in the compatible models, our technical team can help you with a custom driver integration to sync your hardware with the ERP.
                    </p>
                    <Button className="mt-6 bg-white text-slate-900 hover:bg-slate-100 rounded-xl font-bold px-6 h-11">
                        Contact Support
                    </Button>
                </div>
            </Card>
        </div>
    )
}
