import { getSession } from '../actions/authActions'
import { getNotifications, getChildren } from '../actions/childActions'
import { redirect } from 'next/navigation'
import NotificationsContent from './NotificationsContent'

export default async function NotificationsPage({
    searchParams
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const session = await getSession()

    if (!session) {
        redirect('/parent/login')
    }

    const { childId } = await searchParams
    const children = await getChildren()
    const selectedChildId = (childId as string) || children[0]?.id

    // Fetch notifications (Mocked currently, but could be child-specific)
    const notifications = await getNotifications()

    return (
        <NotificationsContent
            initialNotifications={notifications}
            initialChildren={children}
            selectedChildId={selectedChildId}
        />
    )
}
