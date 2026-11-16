import { getMarksList, getExams } from '../actions/marksActions'
import { getClasses } from '../actions/attendanceActions'
import MarksContent from './MarksContent'

export default async function MarksEntryPage() {
    const classes = await getClasses()
    const exams = await getExams()

    const initialClass = classes[0]
    const initialExam = exams[0].id
    const initialStudents = await getMarksList(initialClass, initialExam)

    return (
        <MarksContent
            initialStudents={initialStudents}
            initialClass={initialClass}
            initialExam={initialExam}
            classes={classes}
            exams={exams}
        />
    )
}
