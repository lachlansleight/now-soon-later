import { create, useModal } from "@ebay/nice-modal-react";
import { useState } from "react";
import TaskForm from "components/forms/TaskForm";
import useData from "lib/clientData/useData";
import { Task } from "lib/types";
import ClientTask from "lib/database/ClientTask";
import useKeyboard from "lib/hooks/useKeyboard";
import Modal from "./Modal";

const CreateTaskModal = create(() => {
    const modal = useModal();
    const { revalidate } = useData();
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (formVal: Task) => {
        setLoading(true);
        const newTask = await ClientTask.post(formVal);
        console.log("Created task in database: ", newTask);
        setLoading(false);
        revalidate();
        modal.remove();
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
            <div onClick={e => e.stopPropagation()} className="w-auto lg:w-[50vw]">
                <TaskForm onSubmit={handleSubmit} loading={loading} />
            </div>
        </Modal>
    );
});

export default CreateTaskModal;
