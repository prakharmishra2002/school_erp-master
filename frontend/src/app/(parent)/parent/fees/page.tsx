import { getSession } from '../actions/authActions'
import { getChildren } from '../actions/childActions'
import { getChildFees, getPaymentHistory } from '../actions/feeActions'
import { redirect } from 'next/navigation'
import FeesContent from './FeesContent'

export default async function FeesPage({
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
    const [fees, history] = await Promise.all([
        getChildFees(activeChildId),
        getPaymentHistory(activeChildId)
    ])

    return (
        <FeesContent
            initialChildren={children}
            feesData={fees}
            historyData={history}
            selectedChildId={activeChildId}
        />
    )
}
