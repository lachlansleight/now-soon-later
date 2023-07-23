import { FaSync, FaTasks, FaTrophy } from "react-icons/fa";
import { useCallback, useMemo } from "react";
import { useModal } from "@ebay/nice-modal-react";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import Layout from "components/layout/Layout";
import useData from "lib/clientData/useData";
import CreateTaskModal from "components/modals/CreateTaskModal";
import TaskCard from "components/cards/TaskCard";
import ExpandingButton from "components/molecules/ExpandingButton";
import CreateGoalModal from "components/modals/CreateGoalModal";
import { Goal, Task } from "lib/types";

dayjs.extend(isoWeek);

const HomePage = (): JSX.Element => {
    const { data, loading } = useData();

    const createTaskModal = useModal(CreateTaskModal);
    const createGoalModal = useModal(CreateGoalModal);
    const openCreateTaskModal = useCallback(
        (task?: Task) => {
            createTaskModal.show({ task });
        },
        [createTaskModal]
    );
    const openCreateGoalModal = useCallback(
        (goal?: Goal) => {
            createGoalModal.show({ goal });
        },
        [createGoalModal]
    );

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
                    if (
                        dayjs(t.targetDate).isSame(
                            thisWeekTasks.length > 0 ? dayjs() : dayjs().add(7, "day"),
                            "isoWeek"
                        )
                    )
                        return false;
                    if (
                        dayjs(t.targetDate).diff(dayjs(), "day") < 30 &&
                        dayjs(t.targetDate).isAfter(dayjs())
                    )
                        return true;
                    return false;
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
            <Layout>
                <div className="h-96 grid place-items-center">
                    <FaSync className="animate-spin text-4xl" />
                </div>
            </Layout>
        );

    return (
        <Layout>
            {/* {loading ? <FaSync className="text-4xl animate-spin" /> : <pre>{JSON.stringify(data, null, 2)}</pre>} */}
            <div className="grid grid-cols-0 lg:grid-cols-5 gap-4">
                <div className="flex flex-col gap-2 my-2">
                    <h1 className="text-3xl text-center">Today</h1>
                    {todayTasks.map(task => (
                        <TaskCard key={task.id} task={task} onClick={openCreateTaskModal} />
                    ))}
                </div>
                <div className="flex flex-col gap-2 my-2">
                    <h1 className="text-3xl text-center">Tomorrow</h1>
                    {tomorrowTasks.map(task => (
                        <TaskCard key={task.id} task={task} onClick={openCreateTaskModal} />
                    ))}
                </div>
                {thisWeekTasks.length > 0 ? (
                    <div className="flex flex-col gap-2 my-2">
                        <h1 className="text-3xl text-center">This Week</h1>
                        {thisWeekTasks.map(task => (
                            <TaskCard key={task.id} task={task} onClick={openCreateTaskModal} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col gap-2 my-2">
                        <h1 className="text-3xl text-center">Next Week</h1>
                        {nextWeekTasks.map(task => (
                            <TaskCard key={task.id} task={task} onClick={openCreateTaskModal} />
                        ))}
                    </div>
                )}
                <div className="flex flex-col gap-2 my-2">
                    <h1 className="text-3xl text-center">Soon</h1>
                    {soonTasks.map(task => (
                        <TaskCard key={task.id} task={task} onClick={openCreateTaskModal} />
                    ))}
                </div>
                <div className="flex flex-col gap-2 my-2">
                    <h1 className="text-3xl text-center">Later</h1>
                    {laterTasks.map(task => (
                        <TaskCard key={task.id} task={task} onClick={openCreateTaskModal} />
                    ))}
                </div>
            </div>
            {!loading && (
                <ExpandingButton
                    options={[
                        {
                            icon: <FaTasks />,
                            id: "task",
                            label: "Add Task",
                        },
                        {
                            icon: <FaTrophy />,
                            id: "goal",
                            label: "Add Goal",
                        },
                    ]}
                    onClick={id => (id === "task" ? openCreateTaskModal() : openCreateGoalModal())}
                    buttonSpacing={36}
                    spreadAngle={60}
                />
            )}
        </Layout>
    );
};

export default HomePage;

/*
//Leaving this here so that I don't have to keep looking up the syntax...
import { GetServerSidePropsContext } from "next/types";
export async function getServerSideProps(ctx: GetServerSidePropsContext): Promise<{ props: any }> {
    return {
        props: {  },
    };
}
*/
