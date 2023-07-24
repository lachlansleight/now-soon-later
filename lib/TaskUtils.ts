import { Task } from "./types";

class TaskUtils {
    static deserializeDates(task: Task): Task {
        return {
            ...task,
            completedAt: task.completedAt ? new Date(task.completedAt) : null,
            createdAt: new Date(task.createdAt),
            targetDate: new Date(task.targetDate),
            extendedFrom: task.extendedFrom ? task.extendedFrom.map(d => new Date(d)) : undefined,
            additionalComments: task.additionalComments
                ? task.additionalComments.map(c => ({ ...c, date: new Date(c.date) }))
                : undefined,
        };
    }

    static sortByTargetDate(a: Task, b: Task): number {
        return a.targetDate.valueOf() - b.targetDate.valueOf();
    }
}

export default TaskUtils;
