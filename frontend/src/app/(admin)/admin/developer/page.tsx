'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getSystemLogs, getDeveloperUsers, impersonateUser } from '@/app/(admin)/_actions/developer'
import { toast } from 'sonner'
import { Activity, Shield, Key, Eye, AlertTriangle, Monitor, User } from 'lucide-react'

export default function DeveloperToolsPage() {
    const [logs, setLogs] = useState<any[]>([])
    const [users, setUsers] = useState<any[]>([])
    const [selectedUserId, setSelectedUserId] = useState<string>('')
    const [isLoadingLogs, setIsLoadingLogs] = useState(true)
    const [isImpersonating, setIsImpersonating] = useState(false)

    useEffect(() => {
        loadLogs()
        loadUsers()
    }, [])

    const loadLogs = async () => {
        setIsLoadingLogs(true)
        const res = await getSystemLogs()
        if (res.success && res.data) {
            setLogs(res.data.data) // Laravel pagination returns object with data array
        }
        setIsLoadingLogs(false)
    }

    const loadUsers = async () => {
        const res = await getDeveloperUsers()
        if (res.success && res.data) {
            setUsers(res.data)
        }
    }

    const handleImpersonate = async () => {
        if (!selectedUserId) {
            toast.error('Please select a user to impersonate')
            return
        }
        setIsImpersonating(true)
        const res = await impersonateUser(parseInt(selectedUserId))
        setIsImpersonating(false)

        if (res.success) {
            toast.success(`Actively impersonating ${res.data.user.name}`, {
                description: 'A temporary Sanctum token was generated. Reload page to see changes. (Mocked behavior for now)'
            })
            // Real world: Switch out cookies/local storage to this new token, and reload or redirect.
            loadLogs() // Refresh logs to show the impersonation activity
        } else {
            toast.error('Impersonation failed: ' + res.message)
        }
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-[var(--foreground)]">Developer Control Hub</h1>
                    <p className="text-sm font-medium text-[var(--foreground-muted)]">System monitoring and elevated access controls.</p>
                </div>
            </div>

            <Tabs defaultValue="logs" className="space-y-8">
                <TabsList className="bg-[var(--card-background)] rounded-2xl p-1 shadow-sm border border-[var(--border)]">
                    <TabsTrigger value="logs" className="rounded-xl data-[state=active]:bg-indigo-500/10 data-[state=active]:text-indigo-600 font-bold tracking-wide">
                        <Activity className="w-4 h-4 mr-2" />
                        System Audit Logs
                    </TabsTrigger>
                    <TabsTrigger value="impersonate" className="rounded-xl data-[state=active]:bg-rose-500/10 data-[state=active]:text-rose-600 font-bold tracking-wide">
                        <Shield className="w-4 h-4 mr-2" />
                        User Impersonation
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="logs">
                    <Card className="border-none bg-[var(--card-background)] rounded-[2.5rem] p-8 shadow-2xl shadow-indigo-950/5">
                        <CardHeader className="px-0 pt-0 pb-6 flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-xl font-black">API Request Trajectory</CardTitle>
                                <CardDescription className="text-xs font-bold uppercase tracking-widest text-[var(--foreground-muted)]">Recent system mutations</CardDescription>
                            </div>
                            <Button variant="outline" onClick={loadLogs} className="rounded-xl h-10 border-slate-200 dark:border-slate-800">Refresh Logs</Button>
                        </CardHeader>
                        <CardContent className="px-0 pb-0">
                            {isLoadingLogs ? (
                                <div className="py-20 flex justify-center"><Activity className="w-8 h-8 text-indigo-500 animate-spin" /></div>
                            ) : (
                                <div className="space-y-4">
                                    {logs?.map((log, idx) => (
                                        <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:border-indigo-500/30">
                                            <div className="flex items-start gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 flex-shrink-0 mt-1">
                                                    <Monitor className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <div className="flex flex-wrap items-center gap-2 mb-1">
                                                        <span className="text-sm font-black text-slate-800 dark:text-slate-200">{log.action}</span>
                                                        <Badge variant="outline" className="text-[10px] bg-white dark:bg-black font-mono">{log.ip_address}</Badge>
                                                    </div>
                                                    <p className="text-xs text-slate-500 break-all line-clamp-2 max-w-2xl font-mono">{log.description}</p>
                                                </div>
                                            </div>
                                            <div className="text-right flex-shrink-0">
                                                <p className="text-sm font-bold text-slate-600 dark:text-slate-400">
                                                    {log.user ? log.user.name : 'System/Guest'}
                                                </p>
                                                <p className="text-[10px] text-slate-400 uppercase tracking-widest">{new Date(log.created_at).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                    {logs.length === 0 && <div className="py-10 text-center text-sm font-medium text-slate-500">No recent logs recorded.</div>}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="impersonate">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Card className="border-none bg-[var(--card-background)] rounded-[2.5rem] p-8 shadow-2xl shadow-rose-950/5 relative overflow-hidden">
                            <div className="relative z-10 space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-rose-500 flex items-center justify-center text-white shadow-lg shadow-rose-500/20">
                                        <Key className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl font-black">Login As User</CardTitle>
                                        <CardDescription className="text-xs font-bold uppercase tracking-widest text-[var(--foreground-muted)] text-amber-600">Caution: Direct Access</CardDescription>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                                        Select a user below to issue a temporary elevated Sanctum token bridging their account privileges. This action will be logged.
                                    </p>

                                    <div className="space-y-2 pt-4">
                                        <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Target Account</label>
                                        <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                                            <SelectTrigger className="h-14 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none font-bold">
                                                <SelectValue placeholder="Select user role..." />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-2xl border-none shadow-xl">
                                                {users.map(u => (
                                                    <SelectItem key={u.id} value={u.id.toString()} className="font-medium rounded-xl focus:bg-indigo-500/10 cursor-pointer py-3">
                                                        <div className="flex items-center justify-between w-full gap-4">
                                                            <span>{u.name} <span className="text-slate-400 font-normal">({u.email})</span></span>
                                                            <Badge variant="outline" className="text-[10px] uppercase font-black">{u.role}</Badge>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <Button
                                        onClick={handleImpersonate}
                                        disabled={isImpersonating || !selectedUserId}
                                        className="w-full h-14 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all mt-4"
                                    >
                                        {isImpersonating ? 'Bridging Access...' : (
                                            <span className="flex items-center gap-2">
                                                <Eye className="w-4 h-4" /> Assume Identity
                                            </span>
                                        )}
                                    </Button>
                                </div>
                            </div>
                            <div className="absolute -bottom-20 -right-20 opacity-[0.03] pointer-events-none">
                                <AlertTriangle className="w-96 h-96" />
                            </div>
                        </Card>

                        <div className="space-y-6">
                            <Card className="border-none bg-indigo-950 text-white rounded-[2.5rem] p-8">
                                <h3 className="text-lg font-black mb-2 flex items-center gap-2 text-indigo-300">
                                    <Shield className="w-5 h-5" /> Impersonation Rules
                                </h3>
                                <ul className="space-y-3 text-sm font-medium text-indigo-200 mt-6">
                                    <li className="flex gap-3">
                                        <div className="mt-1 w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0" />
                                        <span>Authentication bridging allows troubleshooting bug reports specifically tied to account states.</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <div className="mt-1 w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0" />
                                        <span>All actions performed while impersonating a user will be securely logged against the developer's original session.</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <div className="mt-1 w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0" />
                                        <span>Tokens expire after 60 minutes automatically or upon forced demotion.</span>
                                    </li>
                                </ul>
                            </Card>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
