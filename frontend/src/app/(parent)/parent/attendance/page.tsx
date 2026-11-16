import { getSession } from '../actions/authActions'
import { getChildren } from '../actions/childActions'
import { getChildAttendance } from '../actions/attendanceActions'
import { redirect } from 'next/navigation'
import AttendanceContent from './AttendanceContent'

export default async function AttendancePage({
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

    const children = await getChildren()
    const activeChildId = childId || children[0]?.id
    const initialAttendance = await getChildAttendance(activeChildId, new Date().getMonth(), new Date().getFullYear())

    return (
        <AttendanceContent
            initialChildren={children}
            attendanceData={initialAttendance}
            selectedChildId={activeChildId}
        />
    )
}
