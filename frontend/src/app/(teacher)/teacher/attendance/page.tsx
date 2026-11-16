import { getAttendanceList, getClasses } from '../actions/attendanceActions'
import AttendanceContent from './AttendanceContent'

export default async function AttendancePage() {
    const classes = await getClasses()
    const initialClass = classes[0]
    const initialStudents = await getAttendanceList(initialClass, new Date().toISOString().split('T')[0])

    return (
        <AttendanceContent
            initialStudents={initialStudents}
            initialClass={initialClass}
            classes={classes}
        />
    )
}
