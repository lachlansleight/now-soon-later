import { create, useModal } from "@ebay/nice-modal-react";
import { useState } from "react";
import TaskForm from "components/forms/TaskForm";
import useData from "lib/clientData/useData";
import { Task } from "lib/types";
import ClientTask from "lib/database/ClientTask";
import useKeyboard from "lib/hooks/useKeyboard";
import Modal from "./Modal";

const CreateTaskModal = create(({ task }: { task?: Task }) => {
    const modal = useModal();
    const { revalidate } = useData();
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (formVal: Task) => {
        setLoading(true);
        if (task) {
            const patchedTask = { ...formVal, id: task.id };
            if (formVal.targetDate !== task.targetDate) {
                if (patchedTask.extendedFrom) patchedTask.extendedFrom.push(task.targetDate);
                else patchedTask.extendedFrom = [task.targetDate];
            }
            const editedTask = await ClientTask.patch(patchedTask);
            console.log("Edited task in database: ", editedTask);
        } else {
            const newTask = await ClientTask.post(formVal);
            console.log("Created task in database: ", newTask);
        }
        setLoading(false);
        revalidate();
        modal.remove();
    };

    const setCancelled = (task: Task, cancel: boolean) => {
        handleSubmit({
            ...task,
            status: cancel ? "cancel" : task.completedAt ? "complete" : "active",
            cancelledAt: cancel ? new Date() : null,
        });
    };

    useKeyboard(e => {
        if (e.key === "Escape") modal.remove();
    }, []);

    return (
        <Modal
            onBgClick={() => {
                modal.remove();
            }}
        >
            <div className="w-auto lg:w-[50vw]">
                <TaskForm
                    task={task}
                    onSubmit={handleSubmit}
                    onCancelChange={setCancelled}
                    loading={loading}
                />
            </div>
        </Modal>
    );
});

export default CreateTaskModal;
