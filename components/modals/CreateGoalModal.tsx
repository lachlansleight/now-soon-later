import { create, useModal } from "@ebay/nice-modal-react";
import { useState } from "react";
import useData from "lib/clientData/useData";
import { Goal } from "lib/types";
import useKeyboard from "lib/hooks/useKeyboard";
import ClientGoal from "lib/database/ClientGoal";
import GoalForm from "components/forms/GoalForm";
import Modal from "./Modal";

const CreateGoalModal = create(({ goal }: { goal?: Goal }) => {
    const modal = useModal();
    const { revalidate } = useData();
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (formVal: Goal) => {
        setLoading(true);
        if (goal) {
            const editedGoal = await ClientGoal.patch({ ...formVal, id: goal.id });
            console.log("Edited goal in database: ", editedGoal);
        } else {
            const newGoal = await ClientGoal.post(formVal);
            console.log("Created goal in database: ", newGoal);
        }
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
                <GoalForm goal={goal} onSubmit={handleSubmit} loading={loading} />
            </div>
        </Modal>
    );
});

export default CreateGoalModal;
