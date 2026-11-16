import { getStudents } from '../actions/studentActions'
import StudentsContent from './StudentsContent'

export default async function StudentsPage() {
    // Initial data fetch on the server
    const initialStudents = await getStudents()

    return <StudentsContent initialStudents={initialStudents} />
}
