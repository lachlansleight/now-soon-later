import { FaPlus, FaSync } from "react-icons/fa";
import { useCallback, useMemo } from "react";
import { useModal } from "@ebay/nice-modal-react";
import dayjs from "dayjs";
import Layout from "components/layout/Layout";
import useData from "lib/clientData/useData";
import CreateTaskModal from "components/modals/CreateTaskModal";
import TaskCard from "components/cards/TaskCard";

const HomePage = (): JSX.Element => {
    const { data, loading } = useData();

    const createTaskModal = useModal(CreateTaskModal);
    const openCreateTaskModal = useCallback(() => {
        createTaskModal.show();
    }, [createTaskModal]);

    const todayTasks = useMemo(() => {
        return data?.tasks.filter(t => dayjs(t.targetDate).isSame(dayjs(), "day")) || [];
    }, [data]);
    const tomorrowTasks = useMemo(() => {
        return (
            data?.tasks.filter(t => dayjs(t.targetDate).isSame(dayjs().add(1, "day"), "day")) || []
        );
    }, [data]);
    const thisWeekTasks = useMemo(() => {
        return (
            data?.tasks.filter(t => {
                if (!dayjs(t.targetDate).isSame(dayjs(), "week")) return false;
                const dayOffset = dayjs(t.targetDate).diff(dayjs(), "day");
                if (dayOffset < 2) return false;
                return true;
            }) || []
        );
    }, [data]);
    const soonTasks = useMemo(() => {
        return (
            data?.tasks.filter(t => {
                if (dayjs(t.targetDate).isSame(dayjs(), "week")) return false;
                if (dayjs(t.targetDate).diff(dayjs(), "day") < 30) return true;
                return false;
            }) || []
        );
    }, [data]);
    const laterTasks = useMemo(() => {
        return data?.tasks.filter(t => dayjs(t.targetDate).diff(dayjs(), "day") > 30) || [];
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
                        <TaskCard key={task.id} task={task} />
                    ))}
                </div>
                <div className="flex flex-col gap-2 my-2">
                    <h1 className="text-3xl text-center">Tomorrow</h1>
                    {tomorrowTasks.map(task => (
                        <TaskCard key={task.id} task={task} />
                    ))}
                </div>
                <div className="flex flex-col gap-2 my-2">
                    <h1 className="text-3xl text-center">This Week</h1>
                    {thisWeekTasks.map(task => (
                        <TaskCard key={task.id} task={task} />
                    ))}
                </div>
                <div className="flex flex-col gap-2 my-2">
                    <h1 className="text-3xl text-center">Soon</h1>
                    {soonTasks.map(task => (
                        <TaskCard key={task.id} task={task} />
                    ))}
                </div>
                <div className="flex flex-col gap-2 my-2">
                    <h1 className="text-3xl text-center">Later</h1>
                    {laterTasks.map(task => (
                        <TaskCard key={task.id} task={task} />
                    ))}
                </div>
            </div>
            {!loading && (
                <div
                    className="fixed bottom-0 grid place-items-center pointer-events-none pb-4"
                    style={{
                        width: `calc(100vw - 0.5rem)`,
                    }}
                >
                    <button
                        className="bg-primary-600 grid place-items-center h-12 w-12 rounded-full shadow-md cursor-pointer text-2xl pointer-events-auto"
                        onClick={openCreateTaskModal}
                    >
                        <FaPlus />
                    </button>
                </div>
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
