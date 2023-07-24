export type ItemStatus = "active" | "complete" | "cancel";

/** General-purpose interface for data items i.e. Goals and Tasks */
export interface Item {
    id: string;
    name: string;
    createdAt: Date;
    completedAt?: Date | null;
    targetDate: Date;
    extendedFrom?: Date[];
    status: ItemStatus;
    creationComment?: string;
    completionComment?: string;
    additionalComments?: {
        date: Date;
        text: string;
    }[];
}

/** Main interface for goals - can have parents and children */
export interface Goal extends Item {
    parentGoalId?: string; //id
    childGoalIds?: string[]; //ids
    taskIds?: string[]; //ids
}

/** Goal interface that is built client-side when we have the whole database to work with */
export interface PopulatedGoal extends Goal {
    parentGoal?: Goal;
    childGoals?: Goal[];
    tasks?: Task[];
}

export interface HierarchyGoal extends Goal {
    childGoals?: HierarchyGoal[];
}

/** Main interface for tasks */
export interface Task extends Item {
    goalId?: string; //id
}

/** Task interface that is built client-side when we have the whole database to work with */
export interface PopulatedTask extends Task {
    goal?: Goal;
}
