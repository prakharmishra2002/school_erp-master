import { getSession } from '../actions/authActions'
import { getChildren } from '../actions/childActions'
import { getChildTimetable } from '../actions/scheduleActions'
import { redirect } from 'next/navigation'
import ScheduleContent from './ScheduleContent'

export default async function SchedulePage({
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
    const timetable = await getChildTimetable(activeChildId)

    return (
        <ScheduleContent
            initialChildren={children}
            timetableData={timetable}
            selectedChildId={activeChildId}
        />
    )
}
