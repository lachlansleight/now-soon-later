import { FaSync } from "react-icons/fa";
import { useMemo } from "react";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import TaskCard from "components/items/TaskCard";
import Data from "lib/clientData/Data";
import { Task } from "lib/types";
import TaskUtils from "lib/TaskUtils";

dayjs.extend(isoWeek);

const TasksPageColumn = ({
    title,
    height,
    tasks,
    onTaskClick,
}: {
    title: string;
    height: number | string;
    tasks: Task[];
    onTaskClick?: (task: Task) => void;
}) => {
    return (
        <div
            className="flex flex-col gap-2 my-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-neutral-800"
            style={{ height }}
        >
            <h1 className="text-3xl text-center">{title}</h1>
            {tasks.map(task => (
                <TaskCard key={task.id} task={task} onClick={onTaskClick} />
            ))}
        </div>
    );
};

const TasksPage = ({
    data,
    onTaskClick,
}: {
    data: Data;
    onTaskClick: (task: Task) => void;
}): JSX.Element => {
    const filteredTasks = useMemo<Task[]>(() => {
        if (!data.tasks) return [];

        return data.tasks.filter(t => {
            //tasks marked complete or cancelled stay in the list for one day
            if (t.status === "complete" && dayjs(t.completedAt).diff(dayjs(), "day") < -1)
                return false;
            if (t.status === "cancel" && dayjs(t.cancelledAt).diff(dayjs(), "day") < -1)
                return false;
            return true;
        });
    }, [data]);

    const taskLocations = useMemo(() => {
        return filteredTasks.map(task => {
            if (dayjs(task.targetDate).isSame(dayjs(), "day"))
                return { id: task.id, location: "today" };
            if (dayjs(task.targetDate).diff(dayjs(), "hour") < 0)
                return { id: task.id, location: "today" };
            if (dayjs(task.targetDate).isSame(dayjs().add(1, "day"), "day"))
                return { id: task.id, location: "tomorrow" };
            if (dayjs(task.targetDate).isSame(dayjs(), "isoWeek"))
                return { id: task.id, location: "thisWeek" };
            if (dayjs(task.targetDate).isSame(dayjs().add(1, "week"), "isoWeek"))
                return { id: task.id, location: "nextWeek" };
            if (dayjs(task.targetDate).diff(dayjs(), "day") < 21)
                return { id: task.id, location: "soon" };
            return { id: task.id, location: "later" };
        });
    }, [filteredTasks]);

    const todayTasks = useMemo(() => {
        return (
            filteredTasks
                .filter(t => taskLocations.find(l => l.id === t.id)?.location === "today")
                .sort(TaskUtils.sortByTargetDate)
                .sort(TaskUtils.sortByStatus) || []
        );
    }, [filteredTasks, taskLocations]);
    const tomorrowTasks = useMemo(() => {
        return (
            filteredTasks
                .filter(t => taskLocations.find(l => l.id === t.id)?.location === "tomorrow")
                .sort(TaskUtils.sortByTargetDate)
                .sort(TaskUtils.sortByStatus) || []
        );
    }, [filteredTasks, taskLocations]);
    const thisWeekTasks = useMemo(() => {
        return (
            filteredTasks
                .filter(t => taskLocations.find(l => l.id === t.id)?.location === "thisWeek")
                .sort(TaskUtils.sortByTargetDate)
                .sort(TaskUtils.sortByStatus) || []
        );
    }, [filteredTasks, taskLocations]);
    const nextWeekTasks = useMemo(() => {
        return (
            filteredTasks
                .filter(t => taskLocations.find(l => l.id === t.id)?.location === "nextWeek")
                .sort(TaskUtils.sortByTargetDate)
                .sort(TaskUtils.sortByStatus) || []
        );
    }, [filteredTasks, taskLocations]);
    const soonTasks = useMemo(() => {
        return (
            filteredTasks
                .filter(t => {
                    if (taskLocations.find(l => l.id === t.id)?.location === "soon") return true;
                    return (
                        thisWeekTasks.length > 0 &&
                        taskLocations.find(l => l.id === t.id)?.location === "nextWeek"
                    );
                })
                .sort(TaskUtils.sortByTargetDate)
                .sort(TaskUtils.sortByStatus) || []
        );
    }, [data, thisWeekTasks]);
    const laterTasks = useMemo(() => {
        return (
            filteredTasks
                .filter(t => taskLocations.find(l => l.id === t.id)?.location === "later")
                .sort(TaskUtils.sortByTargetDate)
                .sort(TaskUtils.sortByStatus) || []
        );
    }, [filteredTasks, taskLocations]);

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
                <TasksPageColumn
                    title="Today"
                    height="calc(100vh - 7.9rem)"
                    tasks={todayTasks}
                    onTaskClick={onTaskClick}
                />
                <TasksPageColumn
                    title="Tomorrow"
                    height="calc(100vh - 7.9rem)"
                    tasks={tomorrowTasks}
                    onTaskClick={onTaskClick}
                />
                {thisWeekTasks.length > 0 ? (
                    <TasksPageColumn
                        title="This Week"
                        height="calc(100vh - 7.9rem)"
                        tasks={thisWeekTasks}
                        onTaskClick={onTaskClick}
                    />
                ) : (
                    <TasksPageColumn
                        title="Next Week"
                        height="calc(100vh - 7.9rem)"
                        tasks={nextWeekTasks}
                        onTaskClick={onTaskClick}
                    />
                )}
                <TasksPageColumn
                    title="Soon"
                    height="calc(100vh - 7.9rem)"
                    tasks={soonTasks}
                    onTaskClick={onTaskClick}
                />
                <TasksPageColumn
                    title="Later"
                    height="calc(100vh - 7.9rem)"
                    tasks={laterTasks}
                    onTaskClick={onTaskClick}
                />
            </div>
        </>
    );
};

export default TasksPage;
