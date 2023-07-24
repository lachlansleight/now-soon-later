import { Goal, PopulatedGoal, PopulatedTask, Task } from "lib/types";

class DatabaseUtils {
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
