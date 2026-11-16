import { getSession } from '../actions/authActions'
import { getChildren } from '../actions/childActions'
import { getChildTeachers } from '../actions/teacherActions'
import { redirect } from 'next/navigation'
import TeachersContent from './TeachersContent'

export default async function TeachersPage({
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

    const teachers = await getChildTeachers(selectedChildId)

    return (
        <TeachersContent
            initialChildren={children}
            teachersData={teachers}
            selectedChildId={selectedChildId}
        />
    )
}
