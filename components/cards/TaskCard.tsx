import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { useMemo } from "react";
import { FaTrophy } from "react-icons/fa";
import useData from "lib/clientData/useData";
import { Task } from "lib/types";

dayjs.extend(advancedFormat);

const TaskCard = ({ task }: { task: Task }): JSX.Element => {
    const { data } = useData();
    const goal = useMemo(() => {
        if (!data) return null;
        if (!task.goalId) return null;
        return data.getGoal(task.goalId) || null;
    }, [data, task]);

    return (
        <div className="bg-neutral-700 rounded shadow-md px-2 py-1 cursor-pointer">
            <h3 className="text-xl m-0 leading-none">{task.name}</h3>
            <span className="bg-neutral-800 px-2 text-xs rounded-full text-neutral-300">
                {dayjs(task.targetDate).format("Do MMM 'YY")}
            </span>
            {goal && (
                <>
                    <hr className="-mx-2 my-2 border-white border-opacity-20" />
                    <div className="flex items-center gap-2 justify-between">
                        <FaTrophy className="text-yellow-500" />
                        <p className="flex-grow">{goal.name}</p>
                        <span className="bg-neutral-800 px-2 text-xs rounded-full text-neutral-300">
                            {dayjs(goal.targetDate).format("Do MMM 'YY")}
                        </span>
                    </div>
                </>
            )}
        </div>
    );
};

export default TaskCard;
