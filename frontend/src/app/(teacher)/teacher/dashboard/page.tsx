import { getDashboardStats, getSchedule, getPendingTasks } from '../actions/dashboardActions'
import { getClasses } from '../actions/classesActions'
import DashboardContent from './DashboardContent'

export default async function TeacherDashboard() {
    const stats = await getDashboardStats()
    const schedule = await getSchedule()
    const classes = await getClasses()
    const pendingTasks = await getPendingTasks()

    return (
        <DashboardContent
            stats={stats}
            schedule={schedule}
            classes={classes}
            pendingTasks={pendingTasks}
        />
    )
}
