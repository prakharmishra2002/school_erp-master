import { getSession } from '../actions/authActions'
import { getChildren, getNotifications } from '../actions/childActions'
import { redirect } from 'next/navigation'
import DashboardContent from './DashboardContent'

export default async function ParentDashboardPage({
    searchParams
}: {
    searchParams: { childId?: string }
}) {
    const params = await searchParams
    const childId = params.childId
    const session = await getSession()

    if (!session) {
        redirect('/parent/login')
    }

    const [children, notifications] = await Promise.all([
        getChildren(),
        getNotifications()
    ])

    return (
        <DashboardContent
            initialChildren={children}
            notifications={notifications}
            selectedChildId={childId}
        />
    )
}
