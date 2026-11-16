import { getSession } from '../actions/authActions'
import { getChildren } from '../actions/childActions'
import { getChildResults } from '../actions/academicActions'
import { redirect } from 'next/navigation'
import ResultsContent from './ResultsContent'

export default async function ResultsPage({
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
    const initialResults = await getChildResults(activeChildId)

    return (
        <ResultsContent
            initialChildren={children}
            resultsData={initialResults}
            selectedChildId={activeChildId}
        />
    )
}
