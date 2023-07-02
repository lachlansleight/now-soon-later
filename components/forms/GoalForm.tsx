import { useState } from "react";
import dayjs from "dayjs";
import DateField from "components/controls/DateField";
import TextField from "components/controls/TextField";
import { Goal } from "lib/types";
import Button from "components/controls/Button";

const GoalForm = ({
    goal,
    onSubmit,
}: {
    goal?: Goal;
    onSubmit: (goal: Goal) => void;
}): JSX.Element => {
    const [value, setValue] = useState<Goal>(
        goal || {
            id: "",
            name: "",
            createdAt: dayjs().startOf("day").add(12, "hour").toDate(),
            targetDate: dayjs().startOf("day").add(12, "hour").toDate(),
            status: "active",
        }
    );

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
            <Button onClick={() => onSubmit(value)}>{goal ? "Update" : "Create"}</Button>
        </div>
    );
};

export default GoalForm;
