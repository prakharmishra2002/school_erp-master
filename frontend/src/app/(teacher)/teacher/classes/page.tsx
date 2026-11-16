import { getClasses } from '../actions/classesActions'
import ClassesContent from './ClassesContent'

export default async function MyClassesPage() {
    const initialClasses = await getClasses()

    return <ClassesContent initialClasses={initialClasses} />
}
