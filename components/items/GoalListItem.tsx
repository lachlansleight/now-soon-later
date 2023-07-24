import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { CSSProperties, useMemo } from "react";
import useData from "lib/clientData/useData";
import { Goal } from "lib/types";

dayjs.extend(advancedFormat);

const GoalListItem = ({
    goal,
    onClick,
    className = "",
    style,
}: {
    goal: Goal;
    onClick?: (goal: Goal) => void;
    className?: string;
    style?: CSSProperties;
}): JSX.Element => {
    const { data } = useData();

    const tasks = useMemo(() => {
        if (!data) return [];
        if (!goal.taskIds) return [];
        return goal.taskIds.map(id => data.getTask(id)) || [];
    }, [data, goal]);

    const parentGoal = useMemo(() => {
        if (!data) return null;
        if (!goal.parentGoalId) return null;
        return data.getGoal(goal.parentGoalId) || null;
    }, [data, goal]);

    const childGoals = useMemo(() => {
        if (!data) return [];
        if (!goal.childGoalIds) return [];
        return goal.childGoalIds.map(id => data.getGoal(id)) || [];
    }, [data, goal]);

    const isOverdue = useMemo(() => {
        return dayjs(goal.targetDate).isBefore(dayjs(), "day");
    }, [goal]);

    return (
        <div
            className={`bg-neutral-700 rounded shadow-md px-2 py-1 cursor-pointer flex gap-4 ${className}`}
            style={style}
            onClick={() => {
                if (onClick) onClick(goal);
            }}
        >
            <h3 className="text-xl m-0 leading-none flex-grow">{goal.name}</h3>
            {parentGoal && <span>Parent: {parentGoal.name}</span>}
            {childGoals.length > 0 && (
                <span>
                    {childGoals?.length || 0} Child Goal{childGoals?.length === 1 ? "" : "s"}
                </span>
            )}
            <span>
                {tasks.length || 0} Task{tasks.length === 1 ? "" : "s"}
            </span>
            <span
                className={`${
                    goal.status === "complete"
                        ? "bg-green-900"
                        : isOverdue
                        ? "bg-red-900 bg-opacity-50"
                        : "bg-neutral-800"
                } px-2 text-xs rounded-full text-neutral-300 w-24 grid place-items-center`}
            >
                {dayjs(goal.targetDate).format("Do MMM 'YY")}
            </span>
        </div>
    );
};

export default GoalListItem;
