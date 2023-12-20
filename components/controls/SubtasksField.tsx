import { useCallback, useState } from "react";
import { FaAngleDown, FaAngleUp, FaPlus, FaTimes } from "react-icons/fa";
import { Subtask } from "lib/types";
import Checkbox from "./Checkbox";
import Button from "./Button";

const SubtasksField = ({
    label = "Subtasks",
    className = "",
    value,
    onChange,
}: {
    label?: string;
    className?: string;
    value?: Subtask[];
    onChange: (value: Subtask[]) => void;
}): JSX.Element => {
    const [newTaskName, setNewTaskName] = useState("");
    const changeTaskCompleted = (completed: boolean, index: number) => {
        if (value)
            onChange(
                value.map((s, i) => {
                    if (i === index) return { ...s, completed };
                    else return s;
                })
            );
    };
    const addTask = (name: string) => {
        if (!name) return;
        onChange(value ? [...value, { name, completed: false }] : [{ name, completed: false }]);
        setNewTaskName("");
    };
    const moveTask = useCallback(
        (index: number, direction: -1 | 1) => {
            if (!value) return;
            if (direction === -1 && index === 0) return;
            if (direction === 1 && index === value.length - 1) return;
            const newIndex = index + direction;
            const newTasks = [...value];
            const temp = newTasks[index];
            newTasks[index] = newTasks[newIndex];
            newTasks[newIndex] = temp;
            onChange(newTasks);
        },
        [value]
    );

    const deleteTask = useCallback(
        (index: number) => {
            if (!value) return;
            onChange(value.filter((_, i) => i !== index));
        },
        [value]
    );

    return (
        <div className={`w-full flex flex-col ${className}`}>
            <label className="w-24 text-xs mb-2">{label}</label>
            <div className="flex flex-col gap-2">
                {value?.map((subtask, i) => (
                    <div className="flex gap-2 items-center justify-between ml-4" key={i}>
                        <div className="flex gap-2 items-center">
                            <Checkbox
                                checked={subtask.completed}
                                onChange={checked => changeTaskCompleted(checked, i)}
                            />
                            <span>{subtask.name}</span>
                        </div>
                        <div className="flex gap-2">
                            {i === 0 ? (
                                <div className="w-8" />
                            ) : (
                                <button
                                    className="rounded p-0 text-xl grid place-items-center w-8 h-8 border border-white border-opacity-20"
                                    onClick={() => moveTask(i, -1)}
                                >
                                    <FaAngleUp />
                                </button>
                            )}
                            <button
                                className="rounded p-0 text-xl grid place-items-center w-8 h-8 bg-red-700 bg-opacity-70"
                                onClick={() => deleteTask(i)}
                            >
                                <FaTimes />
                            </button>
                            {i === value.length - 1 ? (
                                <div className="w-8" />
                            ) : (
                                <button
                                    className="rounded p-0 text-xl grid place-items-center w-8 h-8 border border-white border-opacity-20"
                                    onClick={() => moveTask(i, 1)}
                                >
                                    <FaAngleDown />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
                <div className="flex gap-2 items-center ml-4">
                    <input
                        type={"text"}
                        className="flex-grow bg-neutral-700 rounded px-2 py-1"
                        value={newTaskName}
                        placeholder={"New Task"}
                        onChange={e => {
                            setNewTaskName(e.target.value);
                        }}
                    />
                    <Button
                        className="w-10 h-8 grid place-items-center"
                        disabled={newTaskName === ""}
                        onClick={() => addTask(newTaskName)}
                    >
                        <FaPlus />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default SubtasksField;
