import { Goal, Item, PopulatedGoal, PopulatedTask, Task } from "lib/types";

class DatabaseUtils {
    /** Ensures dates are turned from string representations back into dates */
    public static deserializeDates(data: Item) {
        data.createdAt = new Date(data.createdAt);
        if (data.completedAt) data.completedAt = new Date(data.completedAt);
        data.targetDate = new Date(data.targetDate);
        data.extendedFrom = data.extendedFrom?.map(date => new Date(date));
        data.additionalComments = data.additionalComments?.map(comment => {
            comment.date = new Date(comment.date);
            return comment;
        });
        return data;
    }

    public static populateData(
        tasks: Task[],
        goals: Goal[]
    ): { tasks: PopulatedTask[]; goals: PopulatedGoal[] } {
        const popTasks: PopulatedTask[] = tasks.map(t => ({
            ...t,
            goal: goals.find(g => g.id === t.goalId),
        }));
        const popGoals: PopulatedGoal[] = goals.map(g => ({
            ...g,
            parentGoal: goals.find(g2 => g2.id === g.parentGoalId),
            childGoals: goals.filter(g2 => g2.parentGoalId === g.id),
            tasks: tasks.filter(t => t.goalId === g.id),
        }));

        return {
            tasks: popTasks,
            goals: popGoals,
        };
    }
}

export default DatabaseUtils;
