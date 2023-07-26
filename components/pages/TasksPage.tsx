import { FaSync } from "react-icons/fa";
import { useMemo } from "react";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import TaskCard from "components/items/TaskCard";
import Data from "lib/clientData/Data";
import { Task } from "lib/types";

dayjs.extend(isoWeek);

const TasksPage = ({
    data,
    onTaskClick,
}: {
    data: Data;
    onTaskClick: (task: Task) => void;
}): JSX.Element => {
    const todayTasks = useMemo(() => {
        return (
            data?.tasks
                .filter(t => {
                    if (dayjs(t.targetDate).isSame(dayjs(), "day")) return true;
                    if (dayjs(t.targetDate).isBefore(dayjs(), "day")) return true;
                    return false;
                })
                .sort((a, b) => a.targetDate.valueOf() - b.targetDate.valueOf()) || []
        );
    }, [data]);
    const tomorrowTasks = useMemo(() => {
        return (
            data?.tasks
                .filter(t => {
                    if (dayjs(t.targetDate).isSame(dayjs().add(1, "day"), "day")) return true;
                    return false;
                })
                .sort((a, b) => a.targetDate.valueOf() - b.targetDate.valueOf()) || []
        );
    }, [data]);
    const thisWeekTasks = useMemo(() => {
        return (
            data?.tasks
                .filter(t => {
                    if (!dayjs(t.targetDate).isSame(dayjs(), "isoWeek")) return false;
                    const dayOffset = dayjs(t.targetDate).diff(dayjs(), "day");
                    if (dayOffset < 2) return false;
                    return true;
                })
                .sort((a, b) => a.targetDate.valueOf() - b.targetDate.valueOf()) || []
        );
    }, [data]);
    const nextWeekTasks = useMemo(() => {
        return (
            data?.tasks
                .filter(t => {
                    if (!dayjs(t.targetDate).isSame(dayjs().add(7, "day"), "isoWeek")) return false;
                    return true;
                })
                .sort((a, b) => a.targetDate.valueOf() - b.targetDate.valueOf()) || []
        );
    }, [data]);
    const soonTasks = useMemo(() => {
        return (
            data?.tasks
                .filter(t => {
                    if (thisWeekTasks.length > 0) {
                        if (dayjs(t.targetDate).isSame(dayjs().add(7, "day"), "isoWeek"))
                            return false;
                    }
                    if (dayjs(t.targetDate).isSame(dayjs(), "isoWeek")) return false;
                    return true;
                })
                .sort((a, b) => a.targetDate.valueOf() - b.targetDate.valueOf()) || []
        );
    }, [data, thisWeekTasks]);
    const laterTasks = useMemo(() => {
        return (
            data?.tasks
                .filter(t => {
                    if (dayjs(t.targetDate).diff(dayjs(), "day") > 30) return true;
                    return false;
                })
                .sort((a, b) => a.targetDate.valueOf() - b.targetDate.valueOf()) || []
        );
    }, [data]);

    if (!data)
        return (
            <div className="h-96 grid place-items-center">
                <FaSync className="animate-spin text-4xl" />
            </div>
        );

    return (
        <>
            {/* {loading ? <FaSync className="text-4xl animate-spin" /> : <pre>{JSON.stringify(data, null, 2)}</pre>} */}
            <div className="grid grid-cols-0 lg:grid-cols-5 gap-4">
                <div className="flex flex-col gap-2 my-2">
                    <h1 className="text-3xl text-center">Today</h1>
                    {todayTasks.map(task => (
                        <TaskCard key={task.id} task={task} onClick={onTaskClick} />
                    ))}
                </div>
                <div className="flex flex-col gap-2 my-2">
                    <h1 className="text-3xl text-center">Tomorrow</h1>
                    {tomorrowTasks.map(task => (
                        <TaskCard key={task.id} task={task} onClick={onTaskClick} />
                    ))}
                </div>
                {thisWeekTasks.length > 0 ? (
                    <div className="flex flex-col gap-2 my-2">
                        <h1 className="text-3xl text-center">This Week</h1>
                        {thisWeekTasks.map(task => (
                            <TaskCard key={task.id} task={task} onClick={onTaskClick} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col gap-2 my-2">
                        <h1 className="text-3xl text-center">Next Week</h1>
                        {nextWeekTasks.map(task => (
                            <TaskCard key={task.id} task={task} onClick={onTaskClick} />
                        ))}
                    </div>
                )}
                <div className="flex flex-col gap-2 my-2">
                    <h1 className="text-3xl text-center">Soon</h1>
                    {soonTasks.map(task => (
                        <TaskCard key={task.id} task={task} onClick={onTaskClick} />
                    ))}
                </div>
                <div className="flex flex-col gap-2 my-2">
                    <h1 className="text-3xl text-center">Later</h1>
                    {laterTasks.map(task => (
                        <TaskCard key={task.id} task={task} onClick={onTaskClick} />
                    ))}
                </div>
            </div>
        </>
    );
};

export default TasksPage;
