import { useState } from "react";
import dayjs from "dayjs";
import { FaSync } from "react-icons/fa";
import DateField from "components/controls/DateField";
import TextField from "components/controls/TextField";
import { Task } from "lib/types";
import Button from "components/controls/Button";
import useData from "lib/clientData/useData";
import GoalField from "components/controls/GoalField";
import ComplexDateField from "components/controls/ComplexDateField";
import SubtasksField from "components/controls/SubtasksField";

const TaskForm = ({
    task,
    onSubmit,
    onSubmitNoClose,
    onCancelChange,
    loading = false,
    className = "",
}: {
    task?: Task;
    onSubmit: (task: Task) => void;
    onSubmitNoClose: (task: Task) => void;
    onCancelChange: (task: Task, cancelled: boolean) => void;
    loading?: boolean;
    className?: string;
}): JSX.Element => {
    const { data } = useData();
    const [value, setValue] = useState<Task>(
        task || {
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
        <div className={`flex flex-col gap-2 ${className}`}>
            <h1 className="text-2xl">{task ? "Edit Task" : "Create Task"}</h1>
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
            <ComplexDateField
                label="Target Date"
                value={value.targetDate}
                onChange={v => setValue(cur => ({ ...cur, targetDate: v }))}
            />
            <GoalField
                goals={data.goals}
                value={value.goalId}
                onChange={v => setValue(cur => ({ ...cur, goalId: v }))}
            />
            <SubtasksField
                value={value.subtasks}
                onChange={v => {
                    const newVal = { ...value, subtasks: v };
                    setValue(newVal);
                    onSubmitNoClose(newVal);
                }}
            />
            <div className="flex gap-4 mt-4">
                {task?.cancelledAt ? (
                    <Button
                        className="grid place-items-center px-6 py-1 bg-green-800"
                        onClick={() => {
                            if (loading) return;
                            if (window.confirm("Really un-cancel this task?"))
                                onCancelChange(value, false);
                        }}
                    >
                        Uncancel
                    </Button>
                ) : (
                    <Button
                        className="grid place-items-center px-6 py-1 bg-red-800"
                        onClick={() => {
                            if (loading) return;
                            if (window.confirm("Really cancel this task?"))
                                onCancelChange(value, true);
                        }}
                    >
                        Cancel
                    </Button>
                )}
                <Button
                    className="grid place-items-center py-1 flex-grow"
                    onClick={() => {
                        if (loading) return;
                        onSubmit(value);
                    }}
                >
                    {loading ? (
                        <FaSync className="animate-spin my-[0.3rem]" />
                    ) : task ? (
                        "Update"
                    ) : (
                        "Create"
                    )}
                </Button>
            </div>
        </div>
    );
};

export default TaskForm;
