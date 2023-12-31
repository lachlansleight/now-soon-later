import { useState } from "react";
import dayjs from "dayjs";
import { FaSync } from "react-icons/fa";
import DateField from "components/controls/DateField";
import TextField from "components/controls/TextField";
import { Goal } from "lib/types";
import Button from "components/controls/Button";
import useData from "lib/clientData/useData";
import GoalField from "components/controls/GoalField";

const GoalForm = ({
    goal,
    onSubmit,
    loading,
}: {
    goal?: Goal;
    onSubmit: (goal: Goal) => void;
    loading?: boolean;
}): JSX.Element => {
    const { data } = useData();

    const [value, setValue] = useState<Goal>(
        goal || {
            id: "",
            name: "",
            createdAt: dayjs().startOf("day").add(12, "hour").toDate(),
            targetDate: dayjs().startOf("day").add(12, "hour").toDate(),
            status: "active",
        }
    );

    if (!data) {
        return (
            <div>
                <FaSync className="animate-spin text-4xl" />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-2">
            <h1 className="text-2xl">{goal ? "Edit Goal" : "Create Goal"}</h1>
            <TextField
                label="Name"
                value={value.name}
                onChange={v => setValue(cur => ({ ...cur, name: v }))}
            />
            <DateField
                label="Created"
                value={value.createdAt}
                onChange={v => setValue(cur => ({ ...cur, createdAt: v }))}
            />
            <DateField
                label="Target Date"
                value={value.targetDate}
                onChange={v => setValue(cur => ({ ...cur, targetDate: v }))}
            />
            <GoalField
                label="Parent Goal"
                goals={data.goals}
                value={value.parentGoalId}
                onChange={v => setValue(cur => ({ ...cur, goalId: v }))}
            />
            <Button
                className="grid place-items-center py-1 mt-4"
                onClick={() => {
                    if (loading) return;
                    onSubmit(value);
                }}
            >
                {loading ? (
                    <FaSync className="animate-spin my-[0.3rem]" />
                ) : goal ? (
                    "Update"
                ) : (
                    "Create"
                )}
            </Button>
        </div>
    );
};

export default GoalForm;
