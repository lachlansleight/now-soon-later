import GoalUtils from "lib/GoalUtils";
import TaskUtils from "lib/TaskUtils";
import { Goal, Task } from "lib/types";

class Data {
    tasks: Task[] = [];
    goals: Goal[] = [];

    constructor(tasks: Task[], goals: Goal[]) {
        this.tasks = tasks.map(TaskUtils.deserializeDates);
        this.goals = goals.map(GoalUtils.deserializeDates).map(GoalUtils.collapseIds);
    }

    public getTask(id: string) {
        return this.tasks.find(t => t.id === id);
    }

    public findTask(name: string) {
        return this.tasks.find(t => t.name === name);
    }

    public getGoal(id: string) {
        return this.goals.find(g => g.id === id);
    }

    public findGoal(name: string) {
        return this.goals.find(g => g.name === name);
    }
}

export default Data;
