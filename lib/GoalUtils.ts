import { Goal, HierarchyGoal } from "./types";

class GoalUtils {
    static deserializeDates(goal: Goal): Goal {
        return {
            ...goal,
            completedAt: goal.completedAt ? new Date(goal.completedAt) : null,
            createdAt: new Date(goal.createdAt),
            targetDate: new Date(goal.targetDate),
            extendedFrom: goal.extendedFrom ? goal.extendedFrom.map(d => new Date(d)) : undefined,
            additionalComments: goal.additionalComments
                ? goal.additionalComments.map(c => ({ ...c, date: new Date(c.date) }))
                : undefined,
        };
    }

    static collapseIds(rawGoal: any): Goal {
        return {
            ...rawGoal,
            taskIds: rawGoal.taskIds ? Object.keys(rawGoal.taskIds) : undefined,
            childGoalIds: rawGoal.childGoalIds ? Object.keys(rawGoal.childGoalIds) : undefined,
        };
    }

    static getGoalHierarchy(goals: Goal[]): HierarchyGoal[] {
        const populateGoal = (goal: HierarchyGoal): HierarchyGoal => {
            return {
                ...goal,
                childGoals: goal.childGoalIds
                    ? goal.childGoalIds.map(id => {
                          const g = goals.find(g => g.id === id);
                          if (g) return populateGoal(g);
                          return goal;
                      })
                    : undefined,
            };
        };
        const topLevelGoals: HierarchyGoal[] = goals.filter(g => !g.parentGoalId).map(populateGoal);
        return topLevelGoals;
    }

    static getGoalDepth(goal: Goal, allGoals: Goal[]): number {
        if (!goal.parentGoalId) return 0;
        let depth = 0;
        let currentGoal = goal;
        while (currentGoal.parentGoalId) {
            depth++;
            const newGoal = allGoals.find(g => g.id === currentGoal.parentGoalId);
            if (newGoal) currentGoal = newGoal;
            else break;
        }
        return depth;
    }
}

export default GoalUtils;
