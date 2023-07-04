import { Goal, Task } from "lib/types";

class Data {
    tasks: Task[] = [];
    goals: Goal[] = [];

    constructor(tasks: Task[], goals: Goal[]) {
        this.tasks = tasks;
        this.goals = goals;
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
