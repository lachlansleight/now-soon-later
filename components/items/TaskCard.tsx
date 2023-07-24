import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FaCheck, FaTrophy } from "react-icons/fa";
import useData from "lib/clientData/useData";
import { Task } from "lib/types";
import ClientTask from "lib/database/ClientTask";

dayjs.extend(advancedFormat);

const TaskCard = ({
    task,
    onClick,
}: {
    task: Task;
    onClick?: (task: Task) => void;
}): JSX.Element => {
    const { data } = useData();
    const goal = useMemo(() => {
        if (!data) return null;
        if (!task.goalId) return null;
        return data.getGoal(task.goalId) || null;
    }, [data, task]);
    const isOverdue = useMemo(() => {
        return dayjs(task.targetDate).isBefore(dayjs(), "day");
    }, [task]);
    const [localComplete, setLocalComplete] = useState(task.status === "complete");
    const [taskComplete, setTaskComplete] = useState(task.status === "complete");
    const [changingComplete, setChangingComplete] = useState(false);

    const handleToggleClick = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            e.stopPropagation();
            if (changingComplete) return;
            setLocalComplete(cur => !cur);
        },
        [changingComplete]
    );

    useEffect(() => {
        if (localComplete !== taskComplete) {
            setChangingComplete(true);
            ClientTask.patch({
                ...task,
                status: localComplete ? "complete" : "active",
                completedAt: localComplete ? new Date() : null,
            }).then(() => {
                setChangingComplete(false);
                setTaskComplete(localComplete);
            });
        }
    }, [task, localComplete]);

    return (
        <div
            className="bg-neutral-700 rounded shadow-md px-2 py-1 cursor-pointer"
            onClick={() => {
                if (onClick) onClick(task);
            }}
        >
            <div className="flex justify-between">
                <div>
                    <h3 className="text-xl m-0 leading-none">{task.name}</h3>
                    <span
                        className={`${
                            localComplete
                                ? "bg-green-900"
                                : isOverdue
                                ? "bg-red-900 bg-opacity-50"
                                : "bg-neutral-800"
                        } px-2 text-xs rounded-full text-neutral-300`}
                    >
                        {dayjs(task.targetDate).format("Do MMM 'YY")}
                    </span>
                </div>
                <div
                    className={`relative grid place-items-center border border-white border-opacity-50 rounded-lg bg-neutral-900 w-6 h-6 ${
                        changingComplete ? "cursor-progress" : ""
                    }`}
                    onClick={handleToggleClick}
                >
                    {localComplete && (
                        <FaCheck className="relative text-2xl -top-0.5 left-0.5 text-green-400" />
                    )}
                </div>
            </div>
            {goal && (
                <>
                    <hr className="-mx-2 my-2 border-white border-opacity-20" />
                    <div className="flex items-center gap-2 justify-between mb-1">
                        <FaTrophy className="text-yellow-500" />
                        <p className="flex-grow text-sm leading-none">{goal.name}</p>
                        <span
                            className={`bg-neutral-800 px-2 text-xs rounded-full text-neutral-300 w-24 text-center`}
                        >
                            {dayjs(goal.targetDate).format("Do MMM 'YY")}
                        </span>
                    </div>
                </>
            )}
        </div>
    );
};

export default TaskCard;
