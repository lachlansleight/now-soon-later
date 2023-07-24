import { FaSync, FaTasks, FaTrophy } from "react-icons/fa";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useModal } from "@ebay/nice-modal-react";
import Layout from "components/layout/Layout";
import useData from "lib/clientData/useData";
import TasksPage from "components/pages/TasksPage";
import GoalsPage from "components/pages/GoalsPage";
import ExpandingButton from "components/molecules/ExpandingButton";
import CreateGoalModal from "components/modals/CreateGoalModal";
import CreateTaskModal from "components/modals/CreateTaskModal";
import { Task, Goal } from "lib/types";

const HomePage = (): JSX.Element => {
    const { data, loading } = useData();
    const router = useRouter();

    const [page, setPage] = useState<"loading" | "tasks" | "goals" | "settings" | undefined>(
        "loading"
    );

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

    useEffect(() => {
        if (page === "loading") return;
        if (!page) return;
        router.push({
            pathname: "/" + page,
        });
    }, [page]);

    useEffect(() => {
        if (!router) return;
        setPage(router.query.page as any);
    }, [router]);

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
            <div className="flex gap-8 justify-center pt-2 pb-5 text-2xl border-b-2 border-white border-opacity-10 mb-2">
                <button
                    className={`${
                        page === "tasks" || !page ? "cursor-default" : "cursor-pointer underline"
                    }`}
                    onClick={() => setPage("tasks")}
                >
                    Tasks
                </button>
                <button
                    className={`${
                        page === "goals" ? "cursor-default" : "cursor-pointer underline"
                    }`}
                    onClick={() => setPage("goals")}
                >
                    Goals
                </button>
                <button
                    className={`${
                        page === "settings" ? "cursor-default" : "cursor-pointer underline"
                    }`}
                    onClick={() => setPage("settings")}
                >
                    Settings
                </button>
            </div>
            {(page === "tasks" || !page) && (
                <TasksPage data={data} onTaskClick={openCreateTaskModal} />
            )}
            {page === "goals" && <GoalsPage data={data} onGoalClick={openCreateGoalModal} />}
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
