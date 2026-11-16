import { getSalarySlips, getBankAccounts } from '../actions/salaryActions'
import SalaryContent from './SalaryContent'

export default async function SalaryPage() {
    const initialBankAccounts = await getBankAccounts()
    const initialSlips = await getSalarySlips(2026)

    return (
        <SalaryContent
            initialSlips={initialSlips}
            initialBankAccounts={initialBankAccounts}
        />
    )
}
